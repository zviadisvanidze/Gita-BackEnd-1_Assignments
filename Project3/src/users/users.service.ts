import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findAll(query: FindUsersQueryDto): Promise<PaginatedResult<User>> {
    const filter: QueryFilter<UserDocument> = {};

    if (query.age !== undefined) {
      filter.age = query.age;
    } else if (query.ageFrom !== undefined || query.ageTo !== undefined) {
      filter.age = {};
      if (query.ageFrom !== undefined) filter.age.$gte = query.ageFrom;
      if (query.ageTo !== undefined) filter.age.$lte = query.ageTo;
    }

    if (query.gender) {
      filter.gender = query.gender;
    }

    if (query.name) {
      filter.$or = [
        { firstName: { $regex: query.name, $options: 'i' } },
        { lastName: { $regex: query.name, $options: 'i' } },
      ];
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.userModel.find(filter).skip(skip).limit(limit).lean().exec(),
      this.userModel.countDocuments(filter).exec(),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('იუზერი ვერ მოიძებნა');
    }
    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const user = new this.userModel(dto);
    return user.save();
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, dto);
    return user.save();
  }

  async remove(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundException('იუზერი ვერ მოიძებნა');
    }
    return user;
  }

  async count(): Promise<number> {
    return this.userModel.estimatedDocumentCount().exec();
  }
}
