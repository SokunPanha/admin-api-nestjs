import { PartialType, OmitType, ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { CenterUserCreateRequest } from './create-center-user.dto';

export class CenterUserUpdateRequest extends PartialType(
  OmitType(CenterUserCreateRequest, ['password'] as const),
) {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number;
}
