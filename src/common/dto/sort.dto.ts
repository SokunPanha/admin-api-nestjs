import { ApiProperty } from '@nestjs/swagger';
import type { SortOrder } from '../types/sort-order.type';

export class SortDto {
  @ApiProperty({ type: String, example: 'created_at' })
  field: string;

  @ApiProperty({ enum: ['ASC', 'DESC'], example: 'DESC' })
  order: SortOrder;
}
