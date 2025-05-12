import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { orderItemEntity } from 'src/model/order_item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { orderEntity } from 'src/model/order.entity';
import { userEntity } from 'src/model/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AtStrategy } from 'src/middlewares/access_token/at.strategy';
import { RtStrategy } from 'src/middlewares/refresh_token/rt.strategy';
import { bookEntity } from 'src/model/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([orderEntity, orderItemEntity, userEntity, bookEntity])],
  controllers: [OrderController],
  providers: [OrderService, AtStrategy, RtStrategy, JwtService],
})
export class OrderModule { }
