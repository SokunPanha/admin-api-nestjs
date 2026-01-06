import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { MenuCreateRequest } from './create-menu.dto';

export class MenuUpdateRequest extends PartialType(MenuCreateRequest) {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number;
}
