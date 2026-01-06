import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { RoleCreateRequest } from './create-role.dto';

export class RoleUpdateRequest extends PartialType(RoleCreateRequest) {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number;
}
