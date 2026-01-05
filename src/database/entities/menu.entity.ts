import { Entity, Column, Index, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MenuStatus } from '../../common/constants/entity-status';
import { RoleMenu } from './role-menu.entity';

@Entity('menus')
@Index('idx_menus_status', ['status'])
export class Menu extends BaseEntity {
  @Column({ type: 'bigint', nullable: true })
  parent_id: number | null;

  @Column({ type: 'varchar', length: 100, unique: true })
  code: string;

  @Column({ type: 'jsonb' })
  labels: Record<string, string>; // { "en": "Dashboard", "kh": "..." }

  @Column({ type: 'varchar', length: 100, nullable: true })
  icon: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  route_path: string | null;

  @Column({ type: 'int', default: 0 })
  sort_order: number;

  @Column({ type: 'varchar', length: 50, default: MenuStatus.ACTIVE })
  status: MenuStatus;

  @Column({ type: 'boolean', default: true })
  is_visible: boolean;

  // Relations
  @ManyToOne(() => Menu, (menu) => menu.children, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' })
  parent: Menu | null;

  @OneToMany(() => Menu, (menu) => menu.parent)
  children: Menu[];

  @OneToMany(() => RoleMenu, (roleMenu) => roleMenu.menu)
  role_menus: RoleMenu[];
}
