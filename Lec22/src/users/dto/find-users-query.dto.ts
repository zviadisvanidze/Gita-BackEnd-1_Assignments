import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { GenderFilter } from '../entities/user.entity';

export class FindUsersQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(GenderFilter)
  gender?: GenderFilter;

  @IsOptional()
  @IsString()
  email?: string;
}
