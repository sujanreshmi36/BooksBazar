import { Controller, Get, Post, Body, Patch, Param, Delete, FileTypeValidator, ParseFilePipe, UploadedFile, UseGuards, UseInterceptors, Req, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
// import { UpdateBookDto } from './dto/update-book.dto';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { roleType } from 'src/helper/types/index.type';
import { UploadService } from 'src/helper/utils/files_upload';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { PaginationDto } from 'src/helper/utils/pagination.dto';

@ApiTags('Book')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })

@Controller('book')
export class BookController {
  constructor
    (private readonly bookService: BookService,
      private readonly uploadService: UploadService) { }

  @Post()
  @Roles(roleType.seller)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'add Book' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @Body() createBookDto: CreateBookDto,
    @Req() req: any,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          // new MaxFileSizeValidator({ maxSize: 1000 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|png|jpg|webp)/ }),
        ],
      }),
    )
    file?: Express.Multer.File,
  ) {

    console.log(createBookDto);

    const id = req.user.id;
    const s3response = await this.uploadService.upload(file);

    return this.bookService.create(id, createBookDto, s3response);
  }
  @Get("getAll")
  @Roles(roleType.seller)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get all products by token ' })
  findAllBy(@Req() req: any, @Query() paginationDto?: PaginationDto
  ) {
    const id = req.user.sub;
    return this.bookService.findAllBy(id, paginationDto);
  }

  // @Get()
  // findAll() {
  //   return this.bookService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.bookService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
  //   return this.bookService.update(+id, updateBookDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.bookService.remove(+id);
  // }
}
