import { Injectable, NotFoundException } from '@nestjs/common';
import { Expense } from './entities/expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  private expenses: Expense[] = [];
  private idCounter = 1;

  findAll(): Expense[] {
    return this.expenses;
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
      id: this.idCounter++,
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
