import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { MenusService } from './menus.service';
import { MenuCreateRequest } from './dto/create-menu.dto';
import { MenuUpdateRequest } from './dto/update-menu.dto';
import { MenuDeleteRequest } from './dto/delete-menu.dto';
import { MenuUpdateStatusRequest } from './dto/update-status.dto';
import { MenuListRequest } from './dto/list-menus.dto';
import {
  MenuCreateResponse,
  MenuListResponse,
  MenuUpdateResponse,
  MenuDeleteResponse,
  MenuUpdateStatusResponse,
} from './dto/menu-response.dto';

@ApiTags('System Setting - Menus')
@ApiBearerAuth('bearer')
@Controller('admin/v1/system-setting/menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new menu' })
  @ApiResponse({ status: 201, type: MenuCreateResponse })
  create(@Body() createDto: MenuCreateRequest) {
    return this.menusService.create(createDto);
  }

  @Post('list')
  @ApiOperation({ summary: 'List menus with pagination and filters' })
  @ApiResponse({ status: 200, type: MenuListResponse })
  list(@Body() listDto: MenuListRequest) {
    return this.menusService.list(listDto);
  }

  @Post('update')
  @ApiOperation({ summary: 'Update menu' })
  @ApiResponse({ status: 200, type: MenuUpdateResponse })
  update(@Body() updateDto: MenuUpdateRequest) {
    return this.menusService.update(updateDto.id, updateDto);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Delete menu (soft delete)' })
  @ApiResponse({ status: 200, type: MenuDeleteResponse })
  delete(@Body() deleteDto: MenuDeleteRequest) {
    return this.menusService.delete(deleteDto.id);
  }

  @Post('update-status')
  @ApiOperation({ summary: 'Update menu status' })
  @ApiResponse({ status: 200, type: MenuUpdateStatusResponse })
  updateStatus(@Body() updateStatusDto: MenuUpdateStatusRequest) {
    return this.menusService.updateStatus(
      updateStatusDto.id,
      updateStatusDto.status,
    );
  }
}
