import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [UsersModule, ExpensesModule, ProductsModule],
})
export class AppModule {}
