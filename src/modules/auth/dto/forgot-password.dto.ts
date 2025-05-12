import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class forgotPasswordDto {
    @ApiProperty()
    @IsEmail()
    email: string;
}