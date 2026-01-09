import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { RoleCreateRequest } from './dto/create-role.dto';
import { RoleUpdateRequest } from './dto/update-role.dto';
import { RoleDeleteRequest } from './dto/delete-role.dto';
import { RoleUpdateStatusRequest } from './dto/update-status.dto';
import { RoleListRequest } from './dto/list-roles.dto';
import { RoleAssignMenusRequest } from './dto/assign-menus.dto';
import {
  RoleBindMenuListRequest,
  RoleBindMenuListResponse,
} from './dto/role-bind-menu-list.dto';
import {
  RoleCreateResponse,
  RoleListResponse,
  RoleUpdateResponse,
  RoleDeleteResponse,
  RoleUpdateStatusResponse,
  RoleAssignMenusResponse,
} from './dto/role-response.dto';

@ApiTags('System Setting - Roles')
@ApiBearerAuth('bearer')
@Controller('system-setting/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, type: RoleCreateResponse })
  create(@Body() createDto: RoleCreateRequest) {
    return this.rolesService.create(createDto);
  }

  @Post('list')
  @ApiOperation({ summary: 'List roles with pagination and filters' })
  @ApiResponse({ status: 200, type: RoleListResponse })
  list(@Body() listDto: RoleListRequest) {
    return this.rolesService.list(listDto);
  }

  @Post('update')
  @ApiOperation({ summary: 'Update role' })
  @ApiResponse({ status: 200, type: RoleUpdateResponse })
  update(@Body() updateDto: RoleUpdateRequest) {
    return this.rolesService.update(updateDto.id, updateDto);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Delete role (soft delete)' })
  @ApiResponse({ status: 200, type: RoleDeleteResponse })
  delete(@Body() deleteDto: RoleDeleteRequest) {
    return this.rolesService.delete(deleteDto.id);
  }

  @Post('update-status')
  @ApiOperation({ summary: 'Update role status' })
  @ApiResponse({ status: 200, type: RoleUpdateStatusResponse })
  updateStatus(@Body() updateStatusDto: RoleUpdateStatusRequest) {
    return this.rolesService.updateStatus(
      updateStatusDto.id,
      updateStatusDto.status,
    );
  }

  @Post('assign-menus')
  @ApiOperation({ summary: 'Assign menus to role' })
  @ApiResponse({ status: 200, type: RoleAssignMenusResponse })
  assignMenus(@Body() assignDto: RoleAssignMenusRequest) {
    return this.rolesService.assignMenus(assignDto);
  }

  @Post('role-bind-menu-list')
  @ApiOperation({ summary: 'Get list of menu IDs bound to a role' })
  @ApiResponse({ status: 200, type: RoleBindMenuListResponse })
  getRoleBindMenuList(@Body() request: RoleBindMenuListRequest) {
    return this.rolesService.getRoleBindMenuList(request);
  }
}
