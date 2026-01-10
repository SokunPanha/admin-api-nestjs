import { ApiProperty } from '@nestjs/swagger';
import { MultiLanguageText } from '../../../common/types/multi-language.type';

export class MenuCreateResponse {}

export class MenuItem {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: Number, example: 1, nullable: true })
  parent_id: number | null;

  @ApiProperty({ type: MultiLanguageText })
  labels: MultiLanguageText;

  @ApiProperty({ type: String, example: 'dashboard', nullable: true })
  icon: string | null;

  @ApiProperty({ type: String, example: '/dashboard', nullable: true })
  route_path: string | null;

  @ApiProperty({ type: Number, example: 1 })
  sort_order: number;

  @ApiProperty({ type: String, example: 'active' })
  status: string;

  @ApiProperty({ type: Boolean, example: true })
  is_visible: boolean;

  @ApiProperty({ type: Date, example: '2024-01-01T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ type: Date, example: '2024-01-01T00:00:00.000Z' })
  updated_at: Date;
}

export class MenuListResponse {
  @ApiProperty({ type: [MenuItem] })
  items: MenuItem[];

  @ApiProperty({ example: 30 })
  total: number;
}

export class MenuUpdateResponse {}

export class MenuDeleteResponse {}

export class MenuUpdateStatusResponse {}
