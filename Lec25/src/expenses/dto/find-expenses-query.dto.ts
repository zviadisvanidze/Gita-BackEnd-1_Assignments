import { IsMongoId, IsOptional } from 'class-validator';

export class FindExpensesQueryDto {
  @IsOptional()
  @IsMongoId()
  user?: string;

  @IsOptional()
  @IsMongoId()
  product?: string;
}
