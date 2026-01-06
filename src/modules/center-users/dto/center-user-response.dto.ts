import { ApiProperty } from '@nestjs/swagger';

export class CenterUserCreateResponse {
  @ApiProperty({ example: 201 })
  code: number;

  @ApiProperty({ example: 'Created' })
  message: string;

  @ApiProperty()
  data: any;
}

export class CenterUserItem {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'john_doe' })
  username: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: 'John' })
  first_name: string | null;

  @ApiProperty({ example: 'Doe' })
  last_name: string | null;

  @ApiProperty({ example: '+1234567890' })
  phone_number: string | null;

  @ApiProperty({ example: 'https://example.com/avatar.jpg' })
  avatar_url: string | null;

  @ApiProperty({ example: 'active' })
  status: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  last_login_at: Date | null;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updated_at: Date;
}

export class CenterUserListResponse {
  @ApiProperty({ type: [CenterUserItem] })
  items: CenterUserItem[];

  @ApiProperty({ example: 100 })
  total: number;
}

export class CenterUserUpdateResponse {
  @ApiProperty({ example: 200 })
  code: number;

  @ApiProperty({ example: 'Success' })
  message: string;

  @ApiProperty()
  data: any;
}

export class CenterUserDeleteResponse {
  @ApiProperty({ example: 200 })
  code: number;

  @ApiProperty({ example: 'Success' })
  message: string;

  @ApiProperty()
  data: any;
}

export class CenterUserUpdateStatusResponse {
  @ApiProperty({ example: 200 })
  code: number;

  @ApiProperty({ example: 'Status updated successfully' })
  message: string;

  @ApiProperty()
  data: any;
}

export class CenterUserAssignRolesResponse {
  @ApiProperty({ example: 200 })
  code: number;

  @ApiProperty({ example: 'Roles assigned successfully' })
  message: string;

  @ApiProperty()
  data: any;
}
