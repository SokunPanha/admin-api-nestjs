import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateCenterUserDto } from './create-center-user.dto';

export class UpdateCenterUserDto extends PartialType(
  OmitType(CreateCenterUserDto, ['password'] as const),
) {}
