import { IsInt, IsOptional, IsString, IsObject, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @ApiPropertyOptional({ example: 10, minimum: 1 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page_size: number = 10;

  @ApiPropertyOptional({ example: 'search term' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({
    example: { field: 'created_at', order: 'DESC' },
  })
  @IsOptional()
  @IsObject()
  sort?: {
    field: string;
    order: 'ASC' | 'DESC';
  };

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  filters?: Record<string, any>;
}
