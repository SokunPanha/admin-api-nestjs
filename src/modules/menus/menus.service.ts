import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Menu } from '../../database/entities/menu.entity';
import { RoleMenu } from '../../database/entities/role-menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ListMenusDto } from './dto/list-menus.dto';
import {
  StatusCode,
  StatusMessages,
} from '../../common/constants/status-codes';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    @InjectRepository(RoleMenu)
    private roleMenuRepository: Repository<RoleMenu>,
  ) {}

  async create(createDto: CreateMenuDto) {
    const existing = await this.menuRepository.findOne({
      where: { code: createDto.code },
    });

    if (existing) {
      throw new ConflictException({
        code: StatusCode.CONFLICT,
        message: 'Menu code already exists',
        data: null,
      });
    }

    if (createDto.parent_id) {
      const parent = await this.menuRepository.findOne({
        where: { id: createDto.parent_id },
      });

      if (!parent) {
        throw new NotFoundException({
          code: StatusCode.INVALID_PARENT_MENU,
          message: StatusMessages[StatusCode.INVALID_PARENT_MENU],
          data: null,
        });
      }
    }

    const menu = this.menuRepository.create(createDto);
    await this.menuRepository.save(menu);

    return {
      code: StatusCode.CREATED,
      message: StatusMessages[StatusCode.CREATED],
      data: menu,
    };
  }

  async list(listDto: ListMenusDto) {
    const { page, page_size, keyword, sort, filters } = listDto;
    const skip = (page - 1) * page_size;

    const queryBuilder = this.menuRepository.createQueryBuilder('menu');

    if (keyword) {
      queryBuilder.andWhere(
        "(menu.code LIKE :keyword OR menu.labels::text LIKE :keyword)",
        { keyword: `%${keyword}%` },
      );
    }

    if (filters) {
      if (filters.id) queryBuilder.andWhere('menu.id = :id', { id: filters.id });
      if (filters.parent_id !== undefined) {
        if (filters.parent_id === null) {
          queryBuilder.andWhere('menu.parent_id IS NULL');
        } else {
          queryBuilder.andWhere('menu.parent_id = :parentId', { parentId: filters.parent_id });
        }
      }
      if (filters.code) queryBuilder.andWhere('menu.code LIKE :code', { code: `%${filters.code}%` });
      if (filters.status) queryBuilder.andWhere('menu.status = :status', { status: filters.status });
      if (filters.is_visible !== undefined) queryBuilder.andWhere('menu.is_visible = :visible', { visible: filters.is_visible });
      if (filters.route_path) queryBuilder.andWhere('menu.route_path LIKE :path', { path: `%${filters.route_path}%` });
      if (filters.created_at_from) queryBuilder.andWhere('menu.created_at >= :from', { from: filters.created_at_from });
      if (filters.created_at_to) queryBuilder.andWhere('menu.created_at <= :to', { to: filters.created_at_to });
    }

    if (sort) {
      queryBuilder.orderBy(`menu.${sort.field}`, sort.order);
    } else {
      queryBuilder.orderBy('menu.sort_order', 'ASC');
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
    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: ['parent', 'children', 'role_menus'],
    });

    if (!menu) {
      throw new NotFoundException({
        code: StatusCode.NOT_FOUND,
        message: StatusMessages[StatusCode.NOT_FOUND],
        data: null,
      });
    }

    return {
      code: StatusCode.SUCCESS,
      message: StatusMessages[StatusCode.SUCCESS],
      data: menu,
    };
  }

  async update(id: number, updateDto: UpdateMenuDto) {
    const menu = await this.menuRepository.findOne({ where: { id } });

    if (!menu) {
      throw new NotFoundException({
        code: StatusCode.NOT_FOUND,
        message: StatusMessages[StatusCode.NOT_FOUND],
        data: null,
      });
    }

    if (updateDto.code) {
      const existing = await this.menuRepository.findOne({
        where: { code: updateDto.code },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException({
          code: StatusCode.CONFLICT,
          message: 'Menu code already exists',
          data: null,
        });
      }
    }

    if (updateDto.parent_id) {
      if (updateDto.parent_id === id) {
        throw new BadRequestException({
          code: StatusCode.INVALID_PARENT_MENU,
          message: 'Menu cannot be its own parent',
          data: null,
        });
      }

      const parent = await this.menuRepository.findOne({
        where: { id: updateDto.parent_id },
      });

      if (!parent) {
        throw new NotFoundException({
          code: StatusCode.INVALID_PARENT_MENU,
          message: StatusMessages[StatusCode.INVALID_PARENT_MENU],
          data: null,
        });
      }
    }

    Object.assign(menu, updateDto);
    await this.menuRepository.save(menu);

    return {
      code: StatusCode.SUCCESS,
      message: StatusMessages[StatusCode.SUCCESS],
      data: menu,
    };
  }

  async delete(id: number) {
    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: ['children'],
    });

    if (!menu) {
      throw new NotFoundException({
        code: StatusCode.NOT_FOUND,
        message: StatusMessages[StatusCode.NOT_FOUND],
        data: null,
      });
    }

    if (menu.children && menu.children.length > 0) {
      throw new BadRequestException({
        code: StatusCode.MENU_HAS_CHILDREN,
        message: StatusMessages[StatusCode.MENU_HAS_CHILDREN],
        data: { children_count: menu.children.length },
      });
    }

    await this.menuRepository.softRemove(menu);

    return {
      code: StatusCode.SUCCESS,
      message: StatusMessages[StatusCode.SUCCESS],
      data: { id },
    };
  }
}
