import { ApiProperty } from '@nestjs/swagger';

export class MenuCreateResponse {
  @ApiProperty({ example: 201 })
  code: number;

  @ApiProperty({ example: 'Created' })
  message: string;

  @ApiProperty()
  data: any;
}

export class MenuItem {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  parent_id: number | null;

  @ApiProperty({ example: 'dashboard' })
  code: string;

  @ApiProperty({ example: { en: 'Dashboard', kh: 'ផ្ទាំងគ្រប់គ្រង' } })
  labels: Record<string, string>;

  @ApiProperty({ example: 'dashboard' })
  icon: string | null;

  @ApiProperty({ example: '/dashboard' })
  route_path: string | null;

  @ApiProperty({ example: 1 })
  sort_order: number;

  @ApiProperty({ example: 'active' })
  status: string;

  @ApiProperty({ example: true })
  is_visible: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updated_at: Date;
}

export class MenuListResponse {
  @ApiProperty({ type: [MenuItem] })
  items: MenuItem[];

  @ApiProperty({ example: 30 })
  total: number;
}

export class MenuUpdateResponse {
  @ApiProperty({ example: 200 })
  code: number;

  @ApiProperty({ example: 'Success' })
  message: string;

  @ApiProperty()
  data: any;
}

export class MenuDeleteResponse {
  @ApiProperty({ example: 200 })
  code: number;

  @ApiProperty({ example: 'Success' })
  message: string;

  @ApiProperty()
  data: any;
}

export class MenuUpdateStatusResponse {
  @ApiProperty({ example: 200 })
  code: number;

  @ApiProperty({ example: 'Status updated successfully' })
  message: string;

  @ApiProperty()
  data: any;
}
