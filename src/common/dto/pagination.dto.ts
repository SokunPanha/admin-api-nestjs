import { IsInt, IsOptional, IsObject, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SortDto } from './sort.dto';

export class PaginationDto {
  @ApiPropertyOptional({ example: 1, minimum: 1, type: Number })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @ApiPropertyOptional({ example: 10, minimum: 1, type: Number })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page_size: number = 10;

  @ApiPropertyOptional({
    type: SortDto,
    example: { field: 'created_at', order: 'DESC' },
  })
  @IsOptional()
  @IsObject()
  sort?: SortDto;
}
