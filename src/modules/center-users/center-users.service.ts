import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In, Between } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CenterUser } from '../../database/entities/center-user.entity';
import { CenterUserRole } from '../../database/entities/center-user-role.entity';
import { Role } from '../../database/entities/role.entity';
import { CenterUserCreateRequest } from './dto/create-center-user.dto';
import { CenterUserUpdateRequest } from './dto/update-center-user.dto';
import { CenterUserListRequest } from './dto/list-center-users.dto';
import { CenterUserAssignRolesRequest } from './dto/assign-roles.dto';
import {
  StatusCode,
  StatusMessages,
} from '../../common/constants/status-codes';

@Injectable()
export class CenterUsersService {
  constructor(
    @InjectRepository(CenterUser)
    private centerUserRepository: Repository<CenterUser>,
    @InjectRepository(CenterUserRole)
    private centerUserRoleRepository: Repository<CenterUserRole>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createDto: CenterUserCreateRequest) {
    // Check if username or email already exists
    const existing = await this.centerUserRepository.findOne({
      where: [{ username: createDto.username }, { email: createDto.email }],
    });

    if (existing) {
      throw new ConflictException({
        code: StatusCode.USERNAME_ALREADY_EXISTS,
        message: StatusMessages[StatusCode.USERNAME_ALREADY_EXISTS],
        data: null,
      });
    }

    // Hash password
    const password_hash = await bcrypt.hash(createDto.password, 10);

    // Create user
    const user = this.centerUserRepository.create({
      ...createDto,
      password_hash,
    });

    await this.centerUserRepository.save(user);

    // Remove password from response
    delete user.password_hash;

    return {
      code: StatusCode.CREATED,
      message: StatusMessages[StatusCode.CREATED],
      data: user,
    };
  }

  async list(listDto: CenterUserListRequest) {
    const { page, page_size, sort, id, username, email, phone_number, status, created_at_from, created_at_to, role_ids } = listDto;
    const skip = (page - 1) * page_size;

    const queryBuilder =
      this.centerUserRepository.createQueryBuilder('user');

    if (id) {
      queryBuilder.andWhere('user.id = :id', { id });
    }
    if (username) {
      queryBuilder.andWhere('user.username LIKE :username', {
        username: `%${username}%`,
      });
    }
    if (email) {
      queryBuilder.andWhere('user.email LIKE :email', {
        email: `%${email}%`,
      });
    }
    if (phone_number) {
      queryBuilder.andWhere('user.phone_number LIKE :phone_number', {
        phone_number: `%${phone_number}%`,
      });
    }
    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }
    if (created_at_from) {
      queryBuilder.andWhere('user.created_at >= :from', {
        from: created_at_from,
      });
    }
    if (created_at_to) {
      queryBuilder.andWhere('user.created_at <= :to', {
        to: created_at_to,
      });
    }
    if (role_ids && role_ids.length > 0) {
      queryBuilder
        .innerJoin('user.user_roles', 'ur')
        .andWhere('ur.role_id IN (:...roleIds)', {
          roleIds: role_ids,
        });
    }

    // Sorting
    if (sort && sort.field) {
      queryBuilder.orderBy(`user.${sort.field}`, sort.order);
    } else {
      queryBuilder.orderBy('user.created_at', 'DESC');
    }

    // Pagination
    queryBuilder.skip(skip).take(page_size);

    const [items, total] = await queryBuilder.getManyAndCount();

    // Remove password hashes
    items.forEach((user) => delete user.password_hash);

    return {
      code: StatusCode.SUCCESS,
      message: StatusMessages[StatusCode.SUCCESS],
      data: { total, items },
    };
  }

  async findById(id: number) {
    const user = await this.centerUserRepository.findOne({
      where: { id },
      relations: ['user_roles', 'user_roles.role'],
    });

    if (!user) {
      throw new NotFoundException({
        code: StatusCode.NOT_FOUND,
        message: StatusMessages[StatusCode.NOT_FOUND],
        data: null,
      });
    }

    delete user.password_hash;

    return {
      code: StatusCode.SUCCESS,
      message: StatusMessages[StatusCode.SUCCESS],
      data: user,
    };
  }

  async update(id: number, updateDto: CenterUserUpdateRequest) {
    const user = await this.centerUserRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException({
        code: StatusCode.NOT_FOUND,
        message: StatusMessages[StatusCode.NOT_FOUND],
        data: null,
      });
    }

    // Check for conflicts on username/email if being updated
    if (updateDto.username || updateDto.email) {
      const existing = await this.centerUserRepository.findOne({
        where: [
          updateDto.username ? { username: updateDto.username } : {},
          updateDto.email ? { email: updateDto.email } : {},
        ],
      });

      if (existing && existing.id !== id) {
        throw new ConflictException({
          code: StatusCode.USERNAME_ALREADY_EXISTS,
          message: StatusMessages[StatusCode.USERNAME_ALREADY_EXISTS],
          data: null,
        });
      }
    }

    Object.assign(user, updateDto);
    await this.centerUserRepository.save(user);

    delete user.password_hash;

    return {
      code: StatusCode.SUCCESS,
      message: StatusMessages[StatusCode.SUCCESS],
      data: user,
    };
  }

  async delete(id: number) {
    const user = await this.centerUserRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException({
        code: StatusCode.NOT_FOUND,
        message: StatusMessages[StatusCode.NOT_FOUND],
        data: null,
      });
    }

    await this.centerUserRepository.softRemove(user);

    return {
      code: StatusCode.SUCCESS,
      message: StatusMessages[StatusCode.SUCCESS],
      data: { id },
    };
  }

  async updateStatus(id: number, status: string) {
    const user = await this.centerUserRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException({
        code: StatusCode.NOT_FOUND,
        message: StatusMessages[StatusCode.NOT_FOUND],
        data: null,
      });
    }

    user.status = status as any;
    await this.centerUserRepository.save(user);

    delete user.password_hash;

    return {
      code: StatusCode.SUCCESS,
      message: 'Status updated successfully',
      data: user,
    };
  }

  async assignRoles(assignDto: CenterUserAssignRolesRequest) {
    const { user_id, role_ids } = assignDto;

    const user = await this.centerUserRepository.findOne({
      where: { id: user_id },
    });

    if (!user) {
      throw new NotFoundException({
        code: StatusCode.NOT_FOUND,
        message: StatusMessages[StatusCode.NOT_FOUND],
        data: null,
      });
    }

    // Verify all roles exist
    const roles = await this.roleRepository.find({
      where: { id: In(role_ids) },
    });

    if (roles.length !== role_ids.length) {
      throw new NotFoundException({
        code: StatusCode.NOT_FOUND,
        message: 'One or more roles not found',
        data: null,
      });
    }

    // Remove existing role assignments
    await this.centerUserRoleRepository.delete({ user_id });

    // Create new assignments
    const userRoles = role_ids.map((role_id) =>
      this.centerUserRoleRepository.create({
        user_id,
        role_id,
      }),
    );

    await this.centerUserRoleRepository.save(userRoles);

    return {
      code: StatusCode.SUCCESS,
      message: 'Roles assigned successfully',
      data: { user_id, role_ids },
    };
  }
}
