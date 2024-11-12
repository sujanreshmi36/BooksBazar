import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateViewDto {

    @ApiProperty()
    @IsString()
    bookId: string;

}
