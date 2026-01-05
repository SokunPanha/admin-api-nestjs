import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from '../../database/entities/menu.entity';
import { RoleMenu } from '../../database/entities/role-menu.entity';
import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, RoleMenu])],
  controllers: [MenusController],
  providers: [MenusService],
  exports: [MenusService],
})
export class MenusModule {}
