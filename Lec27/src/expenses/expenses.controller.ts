import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { FindExpensesQueryDto } from './dto/find-expenses-query.dto';
import { TopSpendersQueryDto } from './dto/top-spenders-query.dto';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import {
  CurrentUser,
  CurrentUserPayload,
} from '../common/decorators/current-user.decorator';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  findAll(@Query() query: FindExpensesQueryDto) {
    return this.expensesService.findAll(query);
  }

  @Get('statistic')
  getStatisticsByCategory() {
    return this.expensesService.getStatisticsByCategory();
  }

  @Get('top-spenders')
  getTopSpenders(@Query() query: TopSpendersQueryDto) {
    return this.expensesService.getTopSpenders(query.limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.expensesService.findOne(id);
  }

  @Throttle({ strict: { limit: 5, ttl: 60000 } })
  @Post()
  create(
    @Body() createExpenseDto: CreateExpenseDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.expensesService.create(createExpenseDto, currentUser.userId);
  }

  @Throttle({ strict: { limit: 5, ttl: 60000 } })
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.expensesService.update(id, updateExpenseDto, currentUser.userId);
  }

  @Throttle({ strict: { limit: 5, ttl: 60000 } })
  @Delete(':id')
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.expensesService.remove(id, currentUser.userId);
  }
}
