import { IsOptional, IsString, IsEnum, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { RoleStatus } from '../../../common/constants/entity-status';

export class ListRolesFilters {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  id?: number;

  @ApiPropertyOptional({ example: 'Admin' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'admin' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ enum: RoleStatus })
  @IsOptional()
  @IsEnum(RoleStatus)
  status?: RoleStatus;

  @ApiPropertyOptional({ type: [Number], example: [1, 2] })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  menu_ids?: number[];

  @ApiPropertyOptional({ example: '2024-01-01T00:00:00Z' })
  @IsOptional()
  @IsString()
  created_at_from?: string;

  @ApiPropertyOptional({ example: '2024-12-31T23:59:59Z' })
  @IsOptional()
  @IsString()
  created_at_to?: string;
}

export class ListRolesDto extends PaginationDto {
  @ApiPropertyOptional({ type: ListRolesFilters })
  @IsOptional()
  @Type(() => ListRolesFilters)
  declare filters?: ListRolesFilters;
}
