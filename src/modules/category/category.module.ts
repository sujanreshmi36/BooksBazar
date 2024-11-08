import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { categoryEntity } from 'src/model/category.entity';
import { JwtService } from '@nestjs/jwt';
import { AtStrategy } from 'src/middlewares/access_token/at.strategy';
import { RtStrategy } from 'src/middlewares/refresh_token/rt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([categoryEntity])],
  controllers: [CategoryController],
  providers: [CategoryService, AtStrategy, RtStrategy, JwtService],
})
export class CategoryModule { }
