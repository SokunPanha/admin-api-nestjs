import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class UserBindRoleListRequest {
  @ApiProperty({ type: Number, example: 1 })
  @IsInt()
  @Type(() => Number)
  user_id: number;
}

export class UserBindRoleListResponse {
  @ApiProperty({ type: [Number], example: [1, 2, 3] })
  role_ids: number[];
}
