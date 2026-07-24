import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ExpenseCategory } from '../entities/expense.entity';

export class FindExpensesQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(ExpenseCategory, {
    message: `category must be one of: ${Object.values(ExpenseCategory).join(', ')}`,
  })
  category?: ExpenseCategory;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceFrom?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceTo?: number;
}
