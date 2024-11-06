import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationDto {
    @Transform(({ value }) => parseInt(value))
    @ApiPropertyOptional()
    @IsInt()
    @Min(1)
    @IsOptional()
    page: number;


    @Transform(({ value }) => parseInt(value))
    @ApiPropertyOptional()
    @IsInt()
    @Min(1)
    @IsOptional()
    pageSize: number;
}