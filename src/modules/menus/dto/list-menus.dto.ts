import { IsOptional, IsString, IsEnum, IsBoolean, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { MenuStatus } from '../../../common/constants/entity-status';

export class ListMenusFilters {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  id?: number;

  @ApiPropertyOptional({ example: 1, description: 'null for root menus' })
  @IsOptional()
  @Type(() => Number)
  parent_id?: number | null;

  @ApiPropertyOptional({ example: 'dashboard' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ enum: MenuStatus })
  @IsOptional()
  @IsEnum(MenuStatus)
  status?: MenuStatus;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Type(() => Boolean)
  is_visible?: boolean;

  @ApiPropertyOptional({ example: '/dashboard' })
  @IsOptional()
  @IsString()
  route_path?: string;

  @ApiPropertyOptional({ example: '2024-01-01T00:00:00Z' })
  @IsOptional()
  @IsString()
  created_at_from?: string;

  @ApiPropertyOptional({ example: '2024-12-31T23:59:59Z' })
  @IsOptional()
  @IsString()
  created_at_to?: string;
}

export class MenuListRequest extends PaginationDto {
  @ApiPropertyOptional({ type: ListMenusFilters })
  @IsOptional()
  @Type(() => ListMenusFilters)
  declare filters?: ListMenusFilters;
}
