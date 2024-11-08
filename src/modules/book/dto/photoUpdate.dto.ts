import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class PhotoUpdateDto {
    @ApiProperty({ required: false, type: 'string', format: 'binary' })
    @IsOptional()
    photo: any;
}