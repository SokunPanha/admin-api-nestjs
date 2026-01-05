import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CenterUser } from '../../database/entities/center-user.entity';
import { CenterUserRole } from '../../database/entities/center-user-role.entity';
import { Role } from '../../database/entities/role.entity';
import { CenterUsersController } from './center-users.controller';
import { CenterUsersService } from './center-users.service';

@Module({
  imports: [TypeOrmModule.forFeature([CenterUser, CenterUserRole, Role])],
  controllers: [CenterUsersController],
  providers: [CenterUsersService],
  exports: [CenterUsersService],
})
export class CenterUsersModule {}
