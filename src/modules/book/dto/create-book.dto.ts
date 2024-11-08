import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { BookConditon } from "src/helper/types/index.type";

export class CreateBookDto {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsString()
    author: string;

    @ApiProperty()
    @IsString()
    publisher: string;

    @ApiProperty()
    @IsString()
    edition: string;

    @ApiProperty()
    @IsEnum(BookConditon)
    condition: BookConditon;

    @ApiProperty({ required: false, type: 'string', format: 'binary' })
    @IsString()
    @IsOptional()
    photo: any;

    @Transform(({ value }) => parseInt(value))
    @ApiProperty()
    @IsNumber()
    price: number;

    @ApiProperty()
    @IsArray()
    @IsUUID("all", { each: true })
    categoryIds: string[];
}
