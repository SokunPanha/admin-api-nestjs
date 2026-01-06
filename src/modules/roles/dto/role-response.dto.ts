import { ApiProperty } from '@nestjs/swagger';

export class RoleCreateResponse {
  @ApiProperty({ example: 201 })
  code: number;

  @ApiProperty({ example: 'Created' })
  message: string;

  @ApiProperty()
  data: any;
}

export class RoleItem {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Admin' })
  name: string;

  @ApiProperty({ example: 'admin' })
  code: string;

  @ApiProperty({ example: 'Administrator role with full access' })
  description: string | null;

  @ApiProperty({ example: 'active' })
  status: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updated_at: Date;
}

export class RoleListResponse {
  @ApiProperty({ type: [RoleItem] })
  items: RoleItem[];

  @ApiProperty({ example: 50 })
  total: number;
}

export class RoleUpdateResponse {
  @ApiProperty({ example: 200 })
  code: number;

  @ApiProperty({ example: 'Success' })
  message: string;

  @ApiProperty()
  data: any;
}

export class RoleDeleteResponse {
  @ApiProperty({ example: 200 })
  code: number;

  @ApiProperty({ example: 'Success' })
  message: string;

  @ApiProperty()
  data: any;
}

export class RoleUpdateStatusResponse {
  @ApiProperty({ example: 200 })
  code: number;

  @ApiProperty({ example: 'Status updated successfully' })
  message: string;

  @ApiProperty()
  data: any;
}

export class RoleAssignMenusResponse {
  @ApiProperty({ example: 200 })
  code: number;

  @ApiProperty({ example: 'Menus assigned successfully' })
  message: string;

  @ApiProperty()
  data: any;
}
