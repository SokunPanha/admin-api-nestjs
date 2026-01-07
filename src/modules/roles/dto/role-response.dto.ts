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
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: String, example: 'Admin' })
  name: string;

  @ApiProperty({ type: String, example: 'admin' })
  code: string;

  @ApiProperty({ type: String, example: 'Administrator role with full access', nullable: true })
  description: string | null;

  @ApiProperty({ type: String, example: 'active' })
  status: string;

  @ApiProperty({ type: Date, example: '2024-01-01T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ type: Date, example: '2024-01-01T00:00:00.000Z' })
  updated_at: Date;
}

export class RoleListResponse {
  @ApiProperty({ type: [RoleItem] })
  items: RoleItem[];

  @ApiProperty({ type: Number, example: 50 })
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
