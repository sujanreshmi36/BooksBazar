import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

class OrderInfo {
    @ApiProperty({ description: "Quantity of the book ordered" })
    @Type(() => Number)  // This will handle number conversion correctly
    @IsNumber()
    quantity: number;

    @ApiProperty({ description: "Price of the book ordered" })
    @Type(() => Number)  // Handles number conversion correctly
    @IsNumber()
    price: number;

    @ApiProperty({ description: "ID of the book ordered" })
    @IsString()
    book: string;
}

export class CreateOrderDto {
    @ApiProperty({ description: "Shipping address for the order" })
    @IsString()
    shipping_address: string;

    @ApiProperty({ description: "Phone for the order" })
    @IsString()
    phone: string;


    @IsOptional()
    @ApiProperty({ type: [OrderInfo], description: "List of items in the order" })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderInfo)
    orderItem?: OrderInfo[];
}
