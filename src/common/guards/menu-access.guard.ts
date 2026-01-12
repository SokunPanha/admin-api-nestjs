import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Menu } from '../../database/entities/menu.entity';
import { RoleMenu } from '../../database/entities/role-menu.entity';
import { MenuStatus } from '../constants/entity-status';

export const MENU_PATH_KEY = 'menuPath';
export const MenuPath = (path: string) => SetMetadata(MENU_PATH_KEY, path);
export const SKIP_MENU_CHECK_KEY = 'skipMenuCheck';
export const SkipMenuCheck = () => SetMetadata(SKIP_MENU_CHECK_KEY, true);

/**
 * Guard to check if user has access to a specific menu based on route path
 *
 * Usage:
 * @MenuPath('/admin/users')
 * @Get('list')
 * async listUsers() { ... }
 */
@Injectable()
export class MenuAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    @InjectRepository(RoleMenu)
    private roleMenuRepository: Repository<RoleMenu>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if menu check should be skipped for this route
    const skipMenuCheck = this.reflector.getAllAndOverride<boolean>(
      SKIP_MENU_CHECK_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (skipMenuCheck) {
      return true;
    }

    // Get the menu path from decorator
    const menuPath = this.reflector.getAllAndOverride<string>(MENU_PATH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no menu path specified, allow access (not menu-protected)
    if (!menuPath) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // User should be authenticated at this point (JWT guard runs first)
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Find the menu by route path
    const menu = await this.menuRepository.findOne({
      where: { route_path: menuPath },
    });

    if (!menu) {
      // Menu doesn't exist in database, deny access
      throw new ForbiddenException('Menu not found');
    }

    // Check if menu is active
    if (menu.status !== MenuStatus.ACTIVE) {
      throw new ForbiddenException('This menu is currently inactive');
    }

    // Check if menu is visible
    if (!menu.is_visible) {
      throw new ForbiddenException('This menu is not accessible');
    }

    // Get user's role IDs
    const userRoleIds = user.user_roles?.map((ur: any) => ur.role_id) || [];

    if (userRoleIds.length === 0) {
      throw new ForbiddenException('User has no roles assigned');
    }

    // Check if any of user's roles have access to this menu
    const roleMenuAccess = await this.roleMenuRepository.findOne({
      where: {
        menu_id: menu.id,
        role_id: In(userRoleIds),
      },
    });

    if (!roleMenuAccess) {
      throw new ForbiddenException(
        'You do not have permission to access this menu',
      );
    }

    return true;
  }
}
