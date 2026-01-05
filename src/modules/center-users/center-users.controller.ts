import { Controller, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CenterUsersService } from './center-users.service';
import { CreateCenterUserDto } from './dto/create-center-user.dto';
import { UpdateCenterUserDto } from './dto/update-center-user.dto';
import { ListCenterUsersDto } from './dto/list-center-users.dto';
import { AssignRolesDto } from './dto/assign-roles.dto';

@ApiTags('System Setting - Center Users')
@Controller('admin/v1/system-setting/center-users')
export class CenterUsersController {
  constructor(private readonly centerUsersService: CenterUsersService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new center user' })
  create(@Body() createDto: CreateCenterUserDto) {
    return this.centerUsersService.create(createDto);
  }

  @Post('list')
  @ApiOperation({ summary: 'List center users with pagination and filters' })
  list(@Body() listDto: ListCenterUsersDto) {
    return this.centerUsersService.list(listDto);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Find center user by ID' })
  findById(@Body('id', ParseIntPipe) id: number) {
    return this.centerUsersService.findById(id);
  }

  @Post('update')
  @ApiOperation({ summary: 'Update center user' })
  update(
    @Body('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCenterUserDto,
  ) {
    return this.centerUsersService.update(id, updateDto);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Delete center user (soft delete)' })
  delete(@Body('id', ParseIntPipe) id: number) {
    return this.centerUsersService.delete(id);
  }

  @Post('assign-roles')
  @ApiOperation({ summary: 'Assign roles to center user' })
  assignRoles(@Body() assignDto: AssignRolesDto) {
    return this.centerUsersService.assignRoles(assignDto);
  }
}
