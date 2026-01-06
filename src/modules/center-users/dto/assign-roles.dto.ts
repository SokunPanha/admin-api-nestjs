import { IsArray, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CenterUserAssignRolesRequest {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Type(() => Number)
  user_id: number;

  @ApiProperty({ type: [Number], example: [1, 2, 3] })
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  role_ids: number[];
}
