import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private users: User[];

  constructor() {
    const now = new Date();
    this.users = [
      {
        id: 1,
        firstName: 'Giorgi',
        lastName: 'Beridze',
        email: 'giorgi.beridze@example.com',
        phoneNumber: '555111222',
        gender: 'male',
        subscriptionStartDate: this.addMonths(now, -1),
        subscriptionEndDate: this.addMonths(now, 1),
      },
      {
        id: 2,
        firstName: 'Nino',
        lastName: 'Kapanadze',
        email: 'nino.kapanadze@example.com',
        phoneNumber: '555333444',
        gender: 'female',
        subscriptionStartDate: this.addMonths(now, -3),
        subscriptionEndDate: this.addMonths(now, -2),
      },
      {
        id: 3,
        firstName: 'Levan',
        lastName: 'Maisuradze',
        email: 'levan.maisuradze@example.com',
        phoneNumber: '555555666',
        gender: 'male',
        subscriptionStartDate: this.addMonths(now, -1),
        subscriptionEndDate: this.addMonths(now, 1),
      },
    ];
  }

  findAll(): User[] {
    return this.users;
  }

  private getNextId(): number {
    const lastId = this.users[this.users.length - 1]?.id || 0;
    return lastId + 1;
  }

  private addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  findOne(id: number): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  findByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email);
  }

  create(dto: CreateUserDto): User {
    const now = new Date();
    const newUser: User = {
      id: this.getNextId(),
      ...dto,
      subscriptionStartDate: now,
      subscriptionEndDate: this.addMonths(now, 1),
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, dto: UpdateUserDto): User {
    const user = this.findOne(id);
    Object.assign(user, dto);
    return user;
  }

  remove(id: number): User {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.users.splice(index, 1)[0];
  }

  upgradeSubscription(email: string): User {
    const user = this.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    const now = new Date();
    const base = user.subscriptionEndDate > now ? user.subscriptionEndDate : now;
    user.subscriptionEndDate = this.addMonths(base, 1);
    return user;
  }
}
