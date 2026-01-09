import { Entity, Column, Index, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserStatus } from '../../common/constants/entity-status';
import { CenterUserRole } from './center-user-role.entity';
import { RefreshToken } from './refresh-token.entity';

@Entity('center_users')
@Index('idx_center_users_status', ['status'])
export class CenterUser extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password_hash?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  first_name: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  last_name: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone_number: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar_url: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({ type: 'timestamp', nullable: true })
  last_login_at: Date | null;

  // Relations
  @OneToMany(() => CenterUserRole, (userRole) => userRole.user)
  user_roles: CenterUserRole[];

  @OneToMany(() => RefreshToken, (token) => token.user)
  refresh_tokens: RefreshToken[];
}
