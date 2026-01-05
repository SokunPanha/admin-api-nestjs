import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CenterUser } from './center-user.entity';
import { Role } from './role.entity';

@Entity('center_user_roles')
@Unique(['user_id', 'role_id'])
export class CenterUserRole extends BaseEntity {
  @Column({ type: 'bigint' })
  user_id: number;

  @Column({ type: 'bigint' })
  role_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  assigned_at: Date;

  @Column({ type: 'bigint', nullable: true })
  assigned_by: number | null;

  // Relations
  @ManyToOne(() => CenterUser, (user) => user.user_roles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: CenterUser;

  @ManyToOne(() => Role, (role) => role.user_roles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => CenterUser, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assigned_by' })
  assigner: CenterUser | null;
}
