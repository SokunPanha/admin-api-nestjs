import { Controller, Post, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ListMenusDto } from './dto/list-menus.dto';

@ApiTags('System Setting - Menus')
@Controller('admin/v1/system-setting/menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new menu' })
  create(@Body() createDto: CreateMenuDto) {
    return this.menusService.create(createDto);
  }

  @Post('list')
  @ApiOperation({ summary: 'List menus with pagination and filters' })
  list(@Body() listDto: ListMenusDto) {
    return this.menusService.list(listDto);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Find menu by ID' })
  findById(@Body('id', ParseIntPipe) id: number) {
    return this.menusService.findById(id);
  }

  @Post('update')
  @ApiOperation({ summary: 'Update menu' })
  update(
    @Body('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateMenuDto,
  ) {
    return this.menusService.update(id, updateDto);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Delete menu (soft delete)' })
  delete(@Body('id', ParseIntPipe) id: number) {
    return this.menusService.delete(id);
  }
}
