import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, BadRequestException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';


@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('initiate')
  async initiatePayment(
    @Body() createPaymentDto: CreatePaymentDto
  ) {
    const { amount, orderId } = createPaymentDto;

    if (!amount || !orderId) {
      throw new BadRequestException('Amount and productId are required');
      ;
    }


    try {
      const paymentUrl = await this.paymentService.initiatePayment(amount, orderId);
      return {
        status: HttpStatus.OK,
        url: paymentUrl
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    };
  }
}


