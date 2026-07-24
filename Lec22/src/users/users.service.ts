import { Injectable, NotFoundException } from '@nestjs/common';
import { genderFilterMap, User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { paginate } from '../common/utils/paginate';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 1,
      firstName: 'Giorgi',
      lastName: 'Beridze',
      email: 'giorgi.beridze@example.com',
      phoneNumber: '555111222',
      gender: 'male',
    },
    {
      id: 2,
      firstName: 'Nino',
      lastName: 'Kapanadze',
      email: 'nino.kapanadze@example.com',
      phoneNumber: '555333444',
      gender: 'female',
    },
    {
      id: 3,
      firstName: 'Levan',
      lastName: 'Maisuradze',
      email: 'levan.maisuradze@example.com',
      phoneNumber: '555555666',
      gender: 'male',
    },
  ];
  findAll(query: FindUsersQueryDto): PaginatedResult<User> {
    const { page, take, gender, email } = query;
    let filtered = this.users;

    if (gender || email) {
      filtered = filtered.filter((u) => {
        const matchesGender = !!gender && u.gender === genderFilterMap[gender];
        const matchesEmail =
          !!email && u.email.toLowerCase().startsWith(email.toLowerCase());
        return matchesGender || matchesEmail;
      });
    }

    return paginate(filtered, page, take);
  }

  private getNextId(): number {
    const lastId = this.users[this.users.length - 1]?.id || 0;
    return lastId + 1;
  }

  findOne(id: number): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  create(dto: CreateUserDto): User {
    const newUser: User = {
      id: this.getNextId(),
      ...dto,
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
}
