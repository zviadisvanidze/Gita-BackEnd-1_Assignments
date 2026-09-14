import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateDirectorDto {
  @ApiProperty({ description: 'Director full name', example: 'Christopher Nolan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Birth year', example: 1970, minimum: 1850, maximum: 2100 })
  @IsOptional()
  @IsInt()
  @Min(1850)
  @Max(2100)
  birthYear?: number;

  @ApiPropertyOptional({ description: 'Nationality', example: 'British' })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiPropertyOptional({ description: 'Short biography' })
  @IsOptional()
  @IsString()
  bio?: string;
}
