import { IsInt, IsMongoId, Min } from 'class-validator';

export class CreateExpenseDto {
  @IsMongoId()
  product: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
