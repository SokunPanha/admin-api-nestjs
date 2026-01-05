import { Entity, Column, Index, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RoleStatus } from '../../common/constants/entity-status';
import { CenterUserRole } from './center-user-role.entity';
import { RoleMenu } from './role-menu.entity';

@Entity('roles')
@Index('idx_roles_status', ['status'])
export class Role extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 50, default: RoleStatus.ACTIVE })
  status: RoleStatus;

  // Relations
  @OneToMany(() => CenterUserRole, (userRole) => userRole.role)
  user_roles: CenterUserRole[];

  @OneToMany(() => RoleMenu, (roleMenu) => roleMenu.role)
  role_menus: RoleMenu[];
}
