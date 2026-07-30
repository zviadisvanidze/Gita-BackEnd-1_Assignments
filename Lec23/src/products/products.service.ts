import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const SUBSCRIBER_DISCOUNT_RATE = 0.1;

@Injectable()
export class ProductsService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Wireless Mouse',
      price: 100,
      category: 'Electronics',
      description: 'Ergonomic wireless mouse',
      quantity: 50,
    },
    {
      id: 2,
      name: 'Notebook',
      price: 20,
      category: 'Stationery',
      description: 'A5 lined notebook',
      quantity: 200,
    },
    {
      id: 3,
      name: 'Desk Lamp',
      price: 40,
      category: 'Home',
      description: 'LED desk lamp with adjustable brightness',
      quantity: 75,
    },
  ];

  findAll(hasActiveSubscription: boolean): Product[] {
    if (!hasActiveSubscription) {
      return this.products;
    }
    return this.products.map((product) => ({
      ...product,
      price: Math.round(product.price * (1 - SUBSCRIBER_DISCOUNT_RATE) * 100) / 100,
    }));
  }

  private getNextId(): number {
    const lastId = this.products[this.products.length - 1]?.id || 0;
    return lastId + 1;
  }

  findOne(id: number): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  create(dto: CreateProductDto): Product {
    const newProduct: Product = {
      id: this.getNextId(),
      ...dto,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  update(id: number, dto: UpdateProductDto): Product {
    const product = this.findOne(id);
    Object.assign(product, dto);
    return product;
  }

  remove(id: number): Product {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return this.products.splice(index, 1)[0];
  }
}
