import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ExpenseCategory } from '../entities/expense.entity';

export class CreateExpenseDto {
  @IsEnum(ExpenseCategory, {
    message: `category must be one of: ${Object.values(ExpenseCategory).join(', ')}`,
  })
  category: ExpenseCategory;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;
}
