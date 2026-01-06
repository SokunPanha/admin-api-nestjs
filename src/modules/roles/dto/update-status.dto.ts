import { IsInt, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleStatus } from '../../../common/constants/entity-status';

export class RoleUpdateStatusRequest {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number;

  @ApiProperty({ enum: RoleStatus, example: RoleStatus.ACTIVE })
  @IsEnum(RoleStatus)
  status: RoleStatus;
}
