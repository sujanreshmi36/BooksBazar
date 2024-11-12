import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class CreatePaymentDto {
    @ApiProperty()
    @IsString()
    productId: string;


    @ApiProperty({ description: "amunt" })
    @Type(() => Number)
    @IsNumber()
    amount: number;

}
