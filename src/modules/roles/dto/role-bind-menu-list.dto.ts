import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class RoleBindMenuListRequest {
  @ApiProperty({ type: Number, example: 1 })
  @IsInt()
  @Type(() => Number)
  role_id: number;
}

export class RoleBindMenuListResponse {
  @ApiProperty({ type: [Number], example: [1, 2, 3, 4, 5] })
  menu_ids: number[];
}
