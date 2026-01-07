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
import { RoleCreateRequest } from './dto/create-role.dto';
import { RoleUpdateRequest } from './dto/update-role.dto';
import { RoleListRequest } from './dto/list-roles.dto';
import { RoleAssignMenusRequest } from './dto/assign-menus.dto';
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

  async create(createDto: RoleCreateRequest) {
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

  async list(listDto: RoleListRequest) {
    const { page, page_size, sort, id, name, code, status, created_at_from, created_at_to, menu_ids } = listDto;
    const skip = (page - 1) * page_size;

    const queryBuilder = this.roleRepository.createQueryBuilder('role');

    if (id) queryBuilder.andWhere('role.id = :id', { id });
    if (name) queryBuilder.andWhere('role.name LIKE :name', { name: `%${name}%` });
    if (code) queryBuilder.andWhere('role.code LIKE :code', { code: `%${code}%` });
    if (status) queryBuilder.andWhere('role.status = :status', { status });
    if (created_at_from) queryBuilder.andWhere('role.created_at >= :from', { from: created_at_from });
    if (created_at_to) queryBuilder.andWhere('role.created_at <= :to', { to: created_at_to });
    if (menu_ids && menu_ids.length > 0) {
      queryBuilder.innerJoin('role.role_menus', 'rm').andWhere('rm.menu_id IN (:...menuIds)', { menuIds: menu_ids });
    }

    if (sort && sort.field) {
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

  async update(id: number, updateDto: RoleUpdateRequest) {
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

  async updateStatus(id: number, status: string) {
    const role = await this.roleRepository.findOne({ where: { id } });

    if (!role) {
      throw new NotFoundException({
        code: StatusCode.NOT_FOUND,
        message: StatusMessages[StatusCode.NOT_FOUND],
        data: null,
      });
    }

    role.status = status as any;
    await this.roleRepository.save(role);

    return {
      code: StatusCode.SUCCESS,
      message: 'Status updated successfully',
      data: role,
    };
  }

  async assignMenus(assignDto: RoleAssignMenusRequest) {
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
