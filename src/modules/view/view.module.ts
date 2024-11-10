import { Module } from '@nestjs/common';
import { ViewService } from './view.service';
import { ViewController } from './view.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { bookEntity } from 'src/model/book.entity';
import { userEntity } from 'src/model/user.entity';
import { viewEntity } from 'src/model/view.entity';

@Module({
  imports: [TypeOrmModule.forFeature([userEntity, bookEntity, viewEntity])],
  controllers: [ViewController],
  providers: [ViewService],
})
export class ViewModule { }
