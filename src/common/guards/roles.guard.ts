import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.user_roles) {
      throw new ForbiddenException('User does not have the required roles');
    }

    const userRoleCodes = user.user_roles.map((ur: any) => ur.role.code);
    const hasRole = requiredRoles.some((role) => userRoleCodes.includes(role));

    if (!hasRole) {
      throw new ForbiddenException('User does not have the required roles');
    }

    return true;
  }
}
