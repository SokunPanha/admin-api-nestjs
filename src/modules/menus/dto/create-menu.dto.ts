import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MenuStatus } from '../../../common/constants/entity-status';
import { MultiLanguageText } from '../../../common/types/multi-language.type';

export class MenuCreateRequest {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  parent_id?: number;

  @ApiProperty({ example: 'dashboard' })
  @IsString()
  @MinLength(2)
  code: string;

  @ApiProperty({
    type: MultiLanguageText,
    description: 'Multi-language labels',
  })
  @IsObject()
  labels: MultiLanguageText;

  @ApiPropertyOptional({ example: 'DashboardOutlined' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ example: '/dashboard' })
  @IsOptional()
  @IsString()
  route_path?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  sort_order?: number;

  @ApiPropertyOptional({ enum: MenuStatus, example: MenuStatus.ACTIVE })
  @IsOptional()
  @IsEnum(MenuStatus)
  status?: MenuStatus;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  is_visible?: boolean;
}
