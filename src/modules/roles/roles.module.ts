import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../../database/entities/role.entity';
import { RoleMenu } from '../../database/entities/role-menu.entity';
import { Menu } from '../../database/entities/menu.entity';
import { CenterUserRole } from '../../database/entities/center-user-role.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, RoleMenu, Menu, CenterUserRole])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
