import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class verifyEmailDTO {
    @ApiProperty()
    @IsString()
    @IsEmail()
    email: string;
}