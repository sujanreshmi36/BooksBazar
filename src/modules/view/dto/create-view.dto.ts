import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateViewDto {
    @ApiProperty()
    @IsString()
    userId: String;

    @ApiProperty()
    @IsString()
    bookId: String;

}
