import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleStatus } from '../../../common/constants/entity-status';

export class CreateRoleDto {
  @ApiProperty({ example: 'Admin' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'admin' })
  @IsString()
  @MinLength(2)
  code: string;

  @ApiPropertyOptional({ example: 'Administrator role with full access' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: RoleStatus, example: RoleStatus.ACTIVE })
  @IsOptional()
  @IsEnum(RoleStatus)
  status?: RoleStatus;
}
