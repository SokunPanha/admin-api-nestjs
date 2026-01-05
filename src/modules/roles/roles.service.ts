import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from '../../database/entities/role.entity';
import { RoleMenu } from '../../database/entities/role-menu.entity';
import { Menu } from '../../database/entities/menu.entity';
import { CenterUserRole } from '../../database/entities/center-user-role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ListRolesDto } from './dto/list-roles.dto';
import { AssignMenusDto } from './dto/assign-menus.dto';
import {
  StatusCode,
  StatusMessages,
} from '../../common/constants/status-codes';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(RoleMenu)
    private roleMenuRepository: Repository<RoleMenu>,
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    @InjectRepository(CenterUserRole)
    private centerUserRoleRepository: Repository<CenterUserRole>,
  ) {}

  async create(createDto: CreateRoleDto) {
    const existing = await this.roleRepository.findOne({
      where: [{ name: createDto.name }, { code: createDto.code }],
    });

    if (existing) {
      throw new ConflictException({
        code: StatusCode.CONFLICT,
        message: 'Role name or code already exists',
        data: null,
      });
    }

    const role = this.roleRepository.create(createDto);
    await this.roleRepository.save(role);

    return {
      code: StatusCode.CREATED,
      message: StatusMessages[StatusCode.CREATED],
      data: role,
    };
  }

  async list(listDto: ListRolesDto) {
    const { page, page_size, keyword, sort, filters } = listDto;
    const skip = (page - 1) * page_size;

    const queryBuilder = this.roleRepository.createQueryBuilder('role');

    if (keyword) {
      queryBuilder.andWhere(
        '(role.name LIKE :keyword OR role.code LIKE :keyword OR role.description LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    if (filters) {
      if (filters.id) queryBuilder.andWhere('role.id = :id', { id: filters.id });
      if (filters.name) queryBuilder.andWhere('role.name LIKE :name', { name: `%${filters.name}%` });
      if (filters.code) queryBuilder.andWhere('role.code LIKE :code', { code: `%${filters.code}%` });
      if (filters.status) queryBuilder.andWhere('role.status = :status', { status: filters.status });
      if (filters.created_at_from) queryBuilder.andWhere('role.created_at >= :from', { from: filters.created_at_from });
      if (filters.created_at_to) queryBuilder.andWhere('role.created_at <= :to', { to: filters.created_at_to });
      if (filters.menu_ids && filters.menu_ids.length > 0) {
        queryBuilder.innerJoin('role.role_menus', 'rm').andWhere('rm.menu_id IN (:...menuIds)', { menuIds: filters.menu_ids });
      }
    }

    if (sort) {
      queryBuilder.orderBy(`role.${sort.field}`, sort.order);
    } else {
      queryBuilder.orderBy('role.created_at', 'DESC');
    }

    queryBuilder.skip(skip).take(page_size);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      code: StatusCode.SUCCESS,
      message: StatusMessages[StatusCode.SUCCESS],
      data: { total, items },
    };
  }

  async findById(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['role_menus', 'role_menus.menu'],
    });

    if (!role) {
      throw new NotFoundException({
        code: StatusCode.NOT_FOUND,
        message: StatusMessages[StatusCode.NOT_FOUND],
        data: null,
      });
    }

    return {
      code: StatusCode.SUCCESS,
      message: StatusMessages[StatusCode.SUCCESS],
      data: role,
    };
  }

  async update(id: number, updateDto: UpdateRoleDto) {
    const role = await this.roleRepository.findOne({ where: { id } });

    if (!role) {
      throw new NotFoundException({
        code: StatusCode.NOT_FOUND,
        message: StatusMessages[StatusCode.NOT_FOUND],
        data: null,
      });
    }

    if (updateDto.name || updateDto.code) {
      const existing = await this.roleRepository.findOne({
        where: [
          updateDto.name ? { name: updateDto.name } : {},
          updateDto.code ? { code: updateDto.code } : {},
        ],
      });

      if (existing && existing.id !== id) {
        throw new ConflictException({
          code: StatusCode.CONFLICT,
          message: 'Role name or code already exists',
          data: null,
        });
      }
    }

    Object.assign(role, updateDto);
    await this.roleRepository.save(role);

    return {
      code: StatusCode.SUCCESS,
      message: StatusMessages[StatusCode.SUCCESS],
      data: role,
    };
  }

  async delete(id: number) {
    const role = await this.roleRepository.findOne({ where: { id } });

    if (!role) {
      throw new NotFoundException({
        code: StatusCode.NOT_FOUND,
        message: StatusMessages[StatusCode.NOT_FOUND],
        data: null,
      });
    }

    const usersCount = await this.centerUserRoleRepository.count({ where: { role_id: id } });

    if (usersCount > 0) {
      throw new BadRequestException({
        code: StatusCode.ROLE_IN_USE,
        message: StatusMessages[StatusCode.ROLE_IN_USE],
        data: { users_count: usersCount },
      });
    }

    await this.roleRepository.softRemove(role);

    return {
      code: StatusCode.SUCCESS,
      message: StatusMessages[StatusCode.SUCCESS],
      data: { id },
    };
  }

  async assignMenus(assignDto: AssignMenusDto) {
    const { role_id, menu_ids } = assignDto;

    const role = await this.roleRepository.findOne({ where: { id: role_id } });

    if (!role) {
      throw new NotFoundException({
        code: StatusCode.NOT_FOUND,
        message: StatusMessages[StatusCode.NOT_FOUND],
        data: null,
      });
    }

    const menus = await this.menuRepository.find({ where: { id: In(menu_ids) } });

    if (menus.length !== menu_ids.length) {
      throw new NotFoundException({
        code: StatusCode.NOT_FOUND,
        message: 'One or more menus not found',
        data: null,
      });
    }

    await this.roleMenuRepository.delete({ role_id });

    const roleMenus = menu_ids.map((menu_id) =>
      this.roleMenuRepository.create({ role_id, menu_id }),
    );

    await this.roleMenuRepository.save(roleMenus);

    return {
      code: StatusCode.SUCCESS,
      message: 'Menus assigned successfully',
      data: { role_id, menu_ids },
    };
  }
}
