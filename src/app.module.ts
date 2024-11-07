import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { BookModule } from './modules/book/book.module';
import { OrderModule } from './modules/order/order.module';
import { OrderItemModule } from './modules/order_item/order_item.module';
import { PaymentModule } from './modules/payment/payment.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [AuthModule, CategoryModule, BookModule, OrderModule, OrderItemModule, PaymentModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
