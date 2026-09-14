import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ description: 'Movie title', example: 'Inception' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Movie genre', example: 'Sci-Fi' })
  @IsString()
  @IsNotEmpty()
  genre: string;

  @ApiProperty({ description: 'Release year', example: 2010, minimum: 1888, maximum: 2100 })
  @IsInt()
  @Min(1888)
  @Max(2100)
  year: number;

  @ApiPropertyOptional({ description: 'Movie description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Movie rating', example: 8.8, minimum: 0, maximum: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  rating?: number;

  @ApiProperty({ description: 'ID of the director', example: 1 })
  @Type(() => Number)
  @IsInt()
  directorId: number;
}
