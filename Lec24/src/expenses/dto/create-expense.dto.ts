import { IsInt, IsMongoId, Min } from 'class-validator';

export class CreateExpenseDto {
  @IsMongoId()
  user: string;

  @IsMongoId()
  product: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
