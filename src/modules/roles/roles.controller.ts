import { Controller, Post, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ListRolesDto } from './dto/list-roles.dto';
import { AssignMenusDto } from './dto/assign-menus.dto';

@ApiTags('System Setting - Roles')
@Controller('admin/v1/system-setting/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new role' })
  create(@Body() createDto: CreateRoleDto) {
    return this.rolesService.create(createDto);
  }

  @Post('list')
  @ApiOperation({ summary: 'List roles with pagination and filters' })
  list(@Body() listDto: ListRolesDto) {
    return this.rolesService.list(listDto);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Find role by ID' })
  findById(@Body('id', ParseIntPipe) id: number) {
    return this.rolesService.findById(id);
  }

  @Post('update')
  @ApiOperation({ summary: 'Update role' })
  update(
    @Body('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateDto);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Delete role (soft delete)' })
  delete(@Body('id', ParseIntPipe) id: number) {
    return this.rolesService.delete(id);
  }

  @Post('assign-menus')
  @ApiOperation({ summary: 'Assign menus to role' })
  assignMenus(@Body() assignDto: AssignMenusDto) {
    return this.rolesService.assignMenus(assignDto);
  }
}
