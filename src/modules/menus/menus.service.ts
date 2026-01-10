import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from '../../database/entities/menu.entity';
import { RoleMenu } from '../../database/entities/role-menu.entity';
import { MenuCreateRequest } from './dto/create-menu.dto';
import { MenuUpdateRequest } from './dto/update-menu.dto';
import { MenuListRequest } from './dto/list-menus.dto';
import { ParentMenuMasterdataRequest } from './dto/parent-menu-masterdata.dto';
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

  async create(createDto: MenuCreateRequest) {
    // Convert parent_id = 0 to null for top-level menus
    const parent_id = createDto.parent_id === 0 ? null : createDto.parent_id;

    if (parent_id) {
      const parent = await this.menuRepository.findOne({
        where: { id: parent_id },
      });

      if (!parent) {
        throw new NotFoundException({
          code: StatusCode.INVALID_PARENT_MENU,
          message: StatusMessages[StatusCode.INVALID_PARENT_MENU],
          data: null,
        });
      }
    }

    const menu = this.menuRepository.create({
      ...createDto,
      parent_id,
    });
    await this.menuRepository.save(menu);

    return {
      code: StatusCode.CREATED,
      message: StatusMessages[StatusCode.CREATED],
      data: menu,
    };
  }

  async list(listDto: MenuListRequest) {
    const { page, page_size, sort, id, parent_id, status, is_visible, route_path, created_at_from, created_at_to } = listDto;
    const skip = (page - 1) * page_size;

    const queryBuilder = this.menuRepository.createQueryBuilder('menu');

    if (id) queryBuilder.andWhere('menu.id = :id', { id });
    if (parent_id !== undefined) {
      if (parent_id === null) {
        queryBuilder.andWhere('menu.parent_id IS NULL');
      } else {
        queryBuilder.andWhere('menu.parent_id = :parentId', { parentId: parent_id });
      }
    }
    if (status) queryBuilder.andWhere('menu.status = :status', { status });
    if (is_visible !== undefined) queryBuilder.andWhere('menu.is_visible = :visible', { visible: is_visible });
    if (route_path) queryBuilder.andWhere('menu.route_path LIKE :path', { path: `%${route_path}%` });
    if (created_at_from) queryBuilder.andWhere('menu.created_at >= :from', { from: created_at_from });
    if (created_at_to) queryBuilder.andWhere('menu.created_at <= :to', { to: created_at_to });

    if (sort && sort.field) {
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
      relations: ['role_menus'],
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

  async update(id: number, updateDto: MenuUpdateRequest) {
    const menu = await this.menuRepository.findOne({ where: { id } });

    if (!menu) {
      throw new NotFoundException({
        code: StatusCode.NOT_FOUND,
        message: StatusMessages[StatusCode.NOT_FOUND],
        data: null,
      });
    }

    // Convert parent_id = 0 to null for top-level menus
    const parent_id =
      updateDto.parent_id !== undefined
        ? updateDto.parent_id === 0
          ? null
          : updateDto.parent_id
        : undefined;

    if (parent_id) {
      if (parent_id === id) {
        throw new BadRequestException({
          code: StatusCode.INVALID_PARENT_MENU,
          message: 'Menu cannot be its own parent',
          data: null,
        });
      }

      const parent = await this.menuRepository.findOne({
        where: { id: parent_id },
      });

      if (!parent) {
        throw new NotFoundException({
          code: StatusCode.INVALID_PARENT_MENU,
          message: StatusMessages[StatusCode.INVALID_PARENT_MENU],
          data: null,
        });
      }
    }

    Object.assign(menu, {
      ...updateDto,
      ...(parent_id !== undefined && { parent_id }),
    });
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
    });

    if (!menu) {
      throw new NotFoundException({
        code: StatusCode.NOT_FOUND,
        message: StatusMessages[StatusCode.NOT_FOUND],
        data: null,
      });
    }

    // Check if menu has children
    const childrenCount = await this.menuRepository.count({
      where: { parent_id: id },
    });

    if (childrenCount > 0) {
      throw new BadRequestException({
        code: StatusCode.MENU_HAS_CHILDREN,
        message: StatusMessages[StatusCode.MENU_HAS_CHILDREN],
        data: { children_count: childrenCount },
      });
    }

    await this.menuRepository.softRemove(menu);

    return {
      code: StatusCode.SUCCESS,
      message: StatusMessages[StatusCode.SUCCESS],
      data: { id },
    };
  }

  async updateStatus(id: number, status: string) {
    const menu = await this.menuRepository.findOne({ where: { id } });

    if (!menu) {
      throw new NotFoundException({
        code: StatusCode.NOT_FOUND,
        message: StatusMessages[StatusCode.NOT_FOUND],
        data: null,
      });
    }

    menu.status = status as any;
    await this.menuRepository.save(menu);

    return {
      code: StatusCode.SUCCESS,
      message: 'Status updated successfully',
      data: menu,
    };
  }

  async getParentMenuMasterdata(request: ParentMenuMasterdataRequest) {
    const queryBuilder = this.menuRepository
      .createQueryBuilder('menu')
      .where('menu.parent_id IS NULL');

    if (request.status) {
      queryBuilder.andWhere('menu.status = :status', { status: request.status });
    }

    queryBuilder.orderBy('menu.sort_order', 'ASC');

    const menus = await queryBuilder.getMany();

    const items = menus.map((menu) => ({
      id: menu.id,
      label: menu.labels?.en || `Menu ${menu.id}`,
    }));

    return {
      code: StatusCode.SUCCESS,
      message: StatusMessages[StatusCode.SUCCESS],
      data: { items },
    };
  }
}
