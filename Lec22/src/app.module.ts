import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ExpensesModule } from './expenses/expenses.module';

@Module({
  imports: [UsersModule, ExpensesModule],
})
export class AppModule {}
