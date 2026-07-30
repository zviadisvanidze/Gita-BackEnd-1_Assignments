import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { UsersModule } from '../users/users.module';
import { SubscriptionGuard } from './subscription.guard';

@Module({
  imports: [UsersModule],
  controllers: [ProductsController],
  providers: [ProductsService, SubscriptionGuard],
})
export class ProductsModule {}
