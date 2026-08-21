import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { UsersModule } from '../users/users.module';
import { SubscriptionGuard } from './subscription.guard';
import { Product, ProductSchema } from './schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    UsersModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, SubscriptionGuard],
  exports: [ProductsService],
})
export class ProductsModule {}
