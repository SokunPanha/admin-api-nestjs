import { IsOptional, IsString, IsEnum, IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { UserStatus } from '../../../common/constants/entity-status';

export class CenterUserListRequest extends PaginationDto {
  @ApiPropertyOptional({ type: Number, example: 1 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;

  @ApiPropertyOptional({ type: String, example: 'john_doe' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ type: String, example: 'john@example.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ type: String, example: '+1234567890' })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiPropertyOptional({ enum: UserStatus })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({ type: [Number], example: [1, 2] })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  role_ids?: number[];

  @ApiPropertyOptional({ type: String, example: '2024-01-01T00:00:00Z' })
  @IsOptional()
  @IsString()
  created_at_from?: string;

  @ApiPropertyOptional({ type: String, example: '2024-12-31T23:59:59Z' })
  @IsOptional()
  @IsString()
  created_at_to?: string;
}
