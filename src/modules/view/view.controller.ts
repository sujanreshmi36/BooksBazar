import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ViewService } from './view.service';
import { CreateViewDto } from './dto/create-view.dto';
import { UpdateViewDto } from './dto/update-view.dto';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';

@Controller('view')
@ApiTags('View')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class ViewController {
  constructor(private readonly viewService: ViewService) { }

  @Post()
  @ApiBody({ type: CreateViewDto })
  async recordView(@Body() body: { userId: string, bookId: string }) {
    return this.viewService.recordView(body.userId, body.bookId);
  }

  // @Get('history')
  // async getViewedBooks(@Query('userId') userId: string) {
  //   return this.viewService.getViewedBooks(userId);
  // }

  @Get()
  findAll() {
    return this.viewService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.viewService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateViewDto: UpdateViewDto) {
    return this.viewService.update(+id, updateViewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.viewService.remove(+id);
  }
}
