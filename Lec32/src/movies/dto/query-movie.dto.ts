import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class QueryMovieDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filter by movie title' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filter by genre' })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiPropertyOptional({ description: 'Filter by minimum release year' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1888)
  yearFrom?: number;

  @ApiPropertyOptional({ description: 'Filter by maximum release year' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Max(2100)
  yearTo?: number;

  @ApiPropertyOptional({ description: 'Filter by director ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  directorId?: number;
}
