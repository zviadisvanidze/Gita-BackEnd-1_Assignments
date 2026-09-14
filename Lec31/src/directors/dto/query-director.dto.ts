import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class QueryDirectorDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filter by director name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filter by nationality' })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiPropertyOptional({ description: 'Filter by minimum birth year' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  birthYearFrom?: number;

  @ApiPropertyOptional({ description: 'Filter by maximum birth year' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  birthYearTo?: number;
}
