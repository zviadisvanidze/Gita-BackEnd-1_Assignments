import { Injectable, NotFoundException } from '@nestjs/common';
import { Expense } from './entities/expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { FindExpensesQueryDto } from './dto/find-expenses-query.dto';
import { paginate } from '../common/utils/paginate';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';

@Injectable()
export class ExpensesService {
  private expenses: Expense[] = [];

  findAll(query: FindExpensesQueryDto): PaginatedResult<Expense> {
    const { page, take, category, priceFrom, priceTo } = query;
    let filtered = this.expenses;

    if (category) {
      filtered = filtered.filter((e) => e.category === category);
    }
    if (priceFrom !== undefined) {
      filtered = filtered.filter((e) => e.price >= priceFrom);
    }
    if (priceTo !== undefined) {
      filtered = filtered.filter((e) => e.price <= priceTo);
    }

    return paginate(filtered, page, take);
  }

  private getNextId(): number {
    const lastId = this.expenses[this.expenses.length - 1]?.id || 0;
    return lastId + 1;
  }

  findOne(id: number): Expense {
    const expense = this.expenses.find((e) => e.id === id);
    if (!expense) {
      throw new NotFoundException(`Expense with id ${id} not found`);
    }
    return expense;
  }

  create(dto: CreateExpenseDto): Expense {
    const newExpense: Expense = {
      id: this.getNextId(),
      category: dto.category,
      productName: dto.productName,
      quantity: dto.quantity,
      price: dto.price,
      totalPrice: dto.quantity * dto.price,
    };
    this.expenses.push(newExpense);
    return newExpense;
  }

  update(id: number, dto: UpdateExpenseDto): Expense {
    const expense = this.findOne(id);
    Object.assign(expense, dto);
    expense.totalPrice = expense.quantity * expense.price;
    return expense;
  }

  remove(id: number): Expense {
    const index = this.expenses.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new NotFoundException(`Expense with id ${id} not found`);
    }
    return this.expenses.splice(index, 1)[0];
  }
}
