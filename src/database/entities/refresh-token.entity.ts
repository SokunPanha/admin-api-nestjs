import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CenterUser } from './center-user.entity';

@Entity('refresh_tokens')
export class RefreshToken extends BaseEntity {
  @Column({ type: 'bigint' })
  user_id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  token_hash: string;

  @Column({ type: 'timestamp' })
  expires_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  revoked_at: Date | null;

  @Column({ type: 'bigint', nullable: true })
  replaced_by: number | null;

  // Relations
  @ManyToOne(() => CenterUser, (user) => user.refresh_tokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: CenterUser;

  @ManyToOne(() => RefreshToken, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'replaced_by' })
  replacement: RefreshToken | null;
}
