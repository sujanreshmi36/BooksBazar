import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class CreatePaymentDto {
    @ApiProperty()
    @IsString()
    orderId: string;


    @ApiProperty({ description: "amount" })
    @Type(() => Number)
    @IsNumber()
    amount: number;

}
