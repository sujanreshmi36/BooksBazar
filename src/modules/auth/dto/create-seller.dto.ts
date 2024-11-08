import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEnum } from "class-validator";
import { roleType } from "src/helper/types/index.type";

export class CreateSellerDto {

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    password: string;



}