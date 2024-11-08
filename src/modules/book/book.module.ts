import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { bookEntity } from 'src/model/book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { categoryEntity } from 'src/model/category.entity';
import { userEntity } from 'src/model/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AtStrategy } from 'src/middlewares/access_token/at.strategy';
import { RtStrategy } from 'src/middlewares/refresh_token/rt.strategy';
import { UploadService } from 'src/helper/utils/files_upload';

@Module({
  imports: [TypeOrmModule.forFeature([categoryEntity, userEntity, bookEntity])],
  controllers: [BookController],
  providers: [BookService, AtStrategy, RtStrategy, JwtService, UploadService],
})
export class BookModule { }
