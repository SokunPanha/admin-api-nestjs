import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CenterUsersService } from './center-users.service';
import { CenterUserCreateRequest } from './dto/create-center-user.dto';
import { CenterUserUpdateRequest } from './dto/update-center-user.dto';
import { CenterUserDeleteRequest } from './dto/delete-center-user.dto';
import { CenterUserUpdateStatusRequest } from './dto/update-status.dto';
import { CenterUserListRequest } from './dto/list-center-users.dto';
import { CenterUserAssignRolesRequest } from './dto/assign-roles.dto';
import {
  CenterUserCreateResponse,
  CenterUserListResponse,
  CenterUserUpdateResponse,
  CenterUserDeleteResponse,
  CenterUserUpdateStatusResponse,
  CenterUserAssignRolesResponse,
} from './dto/center-user-response.dto';

@ApiTags('System Setting - Center Users')
@ApiBearerAuth('bearer')
@Controller('system-setting/center-users')
export class CenterUsersController {
  constructor(private readonly centerUsersService: CenterUsersService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new center user' })
  @ApiResponse({ status: 201, type: CenterUserCreateResponse })
  create(@Body() createDto: CenterUserCreateRequest) {
    return this.centerUsersService.create(createDto);
  }

  @Post('list')
  @ApiOperation({ summary: 'List center users with pagination and filters' })
  @ApiResponse({ status: 200, type: CenterUserListResponse })
  list(@Body() listDto: CenterUserListRequest) {
    return this.centerUsersService.list(listDto);
  }

  @Post('update')
  @ApiOperation({ summary: 'Update center user' })
  @ApiResponse({ status: 200, type: CenterUserUpdateResponse })
  update(@Body() updateDto: CenterUserUpdateRequest) {
    return this.centerUsersService.update(updateDto.id, updateDto);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Delete center user (soft delete)' })
  @ApiResponse({ status: 200, type: CenterUserDeleteResponse })
  delete(@Body() deleteDto: CenterUserDeleteRequest) {
    return this.centerUsersService.delete(deleteDto.id);
  }

  @Post('update-status')
  @ApiOperation({ summary: 'Update center user status' })
  @ApiResponse({ status: 200, type: CenterUserUpdateStatusResponse })
  updateStatus(@Body() updateStatusDto: CenterUserUpdateStatusRequest) {
    return this.centerUsersService.updateStatus(
      updateStatusDto.id,
      updateStatusDto.status,
    );
  }

  @Post('assign-roles')
  @ApiOperation({ summary: 'Assign roles to center user' })
  @ApiResponse({ status: 200, type: CenterUserAssignRolesResponse })
  assignRoles(@Body() assignDto: CenterUserAssignRolesRequest) {
    return this.centerUsersService.assignRoles(assignDto);
  }
}
