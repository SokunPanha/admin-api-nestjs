import { IsOptional, IsString, IsEnum, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { MenuStatus } from '../../../common/constants/entity-status';

export class MenuListRequest extends PaginationDto {
  @ApiPropertyOptional({ type: Number, example: 1 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;

  @ApiPropertyOptional({ type: Number, example: 1, description: 'null for root menus', nullable: true })
  @IsOptional()
  @Type(() => Number)
  parent_id?: number | null;

  @ApiPropertyOptional({ enum: MenuStatus })
  @IsOptional()
  @IsEnum(MenuStatus)
  status?: MenuStatus;

  @ApiPropertyOptional({ type: Boolean, example: true })
  @IsOptional()
  @Type(() => Boolean)
  is_visible?: boolean;

  @ApiPropertyOptional({ type: String, example: '/dashboard' })
  @IsOptional()
  @IsString()
  route_path?: string;

  @ApiPropertyOptional({ type: String, example: '2024-01-01T00:00:00Z' })
  @IsOptional()
  @IsString()
  created_at_from?: string;

  @ApiPropertyOptional({ type: String, example: '2024-12-31T23:59:59Z' })
  @IsOptional()
  @IsString()
  created_at_to?: string;
}
