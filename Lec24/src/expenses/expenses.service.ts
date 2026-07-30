import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, Types } from 'mongoose';
import { Expense, ExpenseDocument } from './schemas/expense.schema';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { FindExpensesQueryDto } from './dto/find-expenses-query.dto';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';

const USER_POPULATE_FIELDS = 'firstName lastName email';
const PRODUCT_POPULATE_FIELDS = 'name category price';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private readonly expenseModel: Model<ExpenseDocument>,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  async findAll(query: FindExpensesQueryDto): Promise<Expense[]> {
    const filter: QueryFilter<Expense> = {};
    if (query.user) {
      filter.user = query.user;
    }
    if (query.product) {
      filter.product = query.product;
    }
    return this.expenseModel
      .find(filter)
      .populate('user', USER_POPULATE_FIELDS)
      .populate('product', PRODUCT_POPULATE_FIELDS)
      .exec();
  }

  async findOne(id: string): Promise<ExpenseDocument> {
    const expense = await this.expenseModel
      .findById(id)
      .populate('user', USER_POPULATE_FIELDS)
      .populate('product', PRODUCT_POPULATE_FIELDS)
      .exec();
    if (!expense) {
      throw new NotFoundException(`Expense with id ${id} not found`);
    }
    return expense;
  }

  async create(dto: CreateExpenseDto): Promise<Expense> {
    await this.usersService.findOne(dto.user);
    const product = await this.productsService.findOne(dto.product);

    const newExpense = new this.expenseModel({
      user: dto.user,
      product: dto.product,
      quantity: dto.quantity,
      price: product.price,
    });
    return newExpense.save();
  }

  async update(id: string, dto: UpdateExpenseDto): Promise<Expense> {
    const expense = await this.expenseModel.findById(id).exec();
    if (!expense) {
      throw new NotFoundException(`Expense with id ${id} not found`);
    }

    if (dto.user) {
      await this.usersService.findOne(dto.user);
      expense.user = new Types.ObjectId(dto.user);
    }

    if (dto.product) {
      const product = await this.productsService.findOne(dto.product);
      expense.product = new Types.ObjectId(dto.product);
      expense.price = product.price;
    }

    if (dto.quantity !== undefined) {
      expense.quantity = dto.quantity;
    }

    return expense.save();
  }

  async remove(id: string): Promise<Expense> {
    const expense = await this.expenseModel.findByIdAndDelete(id).exec();
    if (!expense) {
      throw new NotFoundException(`Expense with id ${id} not found`);
    }
    return expense;
  }
}
