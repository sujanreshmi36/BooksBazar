import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsString } from "class-validator";
import { roleType } from "src/helper/types/index.type";

export class CreateUserDto {

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    password: string;

    @ApiProperty()
    @IsEnum(roleType)
    role: roleType;
}
