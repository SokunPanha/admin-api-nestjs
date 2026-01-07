import { ApiProperty } from '@nestjs/swagger';

export class CenterUserCreateResponse {}

export class CenterUserItem {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: String, example: 'john_doe' })
  username: string;

  @ApiProperty({ type: String, example: 'john@example.com' })
  email: string;

  @ApiProperty({ type: String, example: 'John', nullable: true })
  first_name: string | null;

  @ApiProperty({ type: String, example: 'Doe', nullable: true })
  last_name: string | null;

  @ApiProperty({ type: String, example: '+1234567890', nullable: true })
  phone_number: string | null;

  @ApiProperty({ type: String, example: 'https://example.com/avatar.jpg', nullable: true })
  avatar_url: string | null;

  @ApiProperty({ type: String, example: 'active' })
  status: string;

  @ApiProperty({ type: Date, example: '2024-01-01T00:00:00.000Z', nullable: true })
  last_login_at: Date | null;

  @ApiProperty({ type: Date, example: '2024-01-01T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ type: Date, example: '2024-01-01T00:00:00.000Z' })
  updated_at: Date;
}

export class CenterUserListResponse {
  @ApiProperty({ type: [CenterUserItem] })
  items: CenterUserItem[];

  @ApiProperty({ type: Number, example: 100 })
  total: number;
}

export class CenterUserUpdateResponse {}

export class CenterUserDeleteResponse {}

export class CenterUserUpdateStatusResponse {}

export class CenterUserAssignRolesResponse {}
