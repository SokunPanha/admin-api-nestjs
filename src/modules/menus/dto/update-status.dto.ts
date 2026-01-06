import { IsInt, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MenuStatus } from '../../../common/constants/entity-status';

export class MenuUpdateStatusRequest {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number;

  @ApiProperty({ enum: MenuStatus, example: MenuStatus.ACTIVE })
  @IsEnum(MenuStatus)
  status: MenuStatus;
}
