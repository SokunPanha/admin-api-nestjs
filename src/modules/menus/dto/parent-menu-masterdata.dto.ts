import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { MenuStatus } from '../../../common/constants/entity-status';

export class ParentMenuMasterdataRequest {
  @ApiPropertyOptional({ enum: MenuStatus })
  @IsOptional()
  @IsEnum(MenuStatus)
  status?: MenuStatus;
}

export class ParentMenuMasterdataItem {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: String, example: 'dashboard' })
  code: string;

  @ApiProperty({ type: String, example: 'Dashboard' })
  label: string;
}

export class ParentMenuMasterdataResponse {
  @ApiProperty({ type: [ParentMenuMasterdataItem] })
  items: ParentMenuMasterdataItem[];
}
