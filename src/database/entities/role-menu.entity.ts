import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Role } from './role.entity';
import { Menu } from './menu.entity';

@Entity('role_menus')
@Unique(['role_id', 'menu_id'])
export class RoleMenu extends BaseEntity {
  @Column({ type: 'bigint' })
  role_id: number;

  @Column({ type: 'bigint' })
  menu_id: number;

  // Relations
  @ManyToOne(() => Role, (role) => role.role_menus, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Menu, (menu) => menu.role_menus, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_id' })
  menu: Menu;
}
