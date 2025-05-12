import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  private esewaConfig = {
    merchantId: process.env.ESEWA_MERCHANT_ID,
    successUrl: process.env.ESEWA_SUCCESS_URL,
    failureUrl: process.env.ESEWA_FAILURE_URL,
    esewaPaymentUrl: process.env.ESEWA_PAYMENT_URL,
    secret: process.env.ESEWA_SECRET,
  };



  async initiatePayment(amount: number, orderId: string): Promise<string> {
    // Ensure unique transaction UUID for each attempt
    const uniqueOrderId = `${orderId}-${Date.now()}`;
    let paymentData = {
      amount: amount.toString(),
      failure_url: this.esewaConfig.failureUrl,
      product_delivery_charge: '0',
      product_service_charge: '0',
      product_code: this.esewaConfig.merchantId,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      success_url: this.esewaConfig.successUrl,
      tax_amount: '0',
      total_amount: amount.toString(),
      transaction_uuid: uniqueOrderId,
    } as any;

    const data = `total_amount=${paymentData.total_amount},transaction_uuid=${paymentData.transaction_uuid},product_code=${paymentData.product_code}`;

    // Generate HMAC SHA256 signature
    const signature = this.generateHash(data, this.esewaConfig.secret);
    paymentData = { ...paymentData, signature };

    try {
      const response = await axios.post(this.esewaConfig.esewaPaymentUrl, null, {
        params: paymentData,
      });

      // Extract payment URL from the response
      const paymentUrl = response.request.res.responseUrl;
      return paymentUrl;
    } catch (error) {
      console.error('eSewa Payment Error:', error.message);
      throw new Error('Payment initiation failed');
    }
  }

  //Method to generatehash
  private generateHash(data: string, secret: string): string {
    if (!data || !secret) {
      throw new Error('Both data and secret are required to generate a hash.');
    }

    const hash = crypto.createHmac('sha256', secret).update(data).digest('base64');
    return hash;
  }
}
