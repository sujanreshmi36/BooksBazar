import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { BookConditon } from "src/helper/types/index.type";


export class UpdateBookDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    title: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    author: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    publisher: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    edition: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum(BookConditon)
    condition: BookConditon;

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @ApiProperty()
    @IsNumber()
    price: number;

    @ApiProperty()
    @IsArray()
    @IsOptional()
    @IsUUID("all", { each: true })
    categoryIds: string[];
}
