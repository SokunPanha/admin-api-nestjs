import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CenterUserUpdatePasswordRequest {
  @ApiProperty({ type: Number, example: 1 })
  @IsInt()
  @Type(() => Number)
  id: number;

  @ApiProperty({ type: String, example: 'NewPassword123!' })
  @IsString()
  @MinLength(8)
  new_password: string;
}

export class CenterUserUpdatePasswordResponse {}
