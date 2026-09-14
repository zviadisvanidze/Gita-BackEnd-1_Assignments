import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { S3Service } from '../common/aws/s3.service';
import { buildObjectKey } from '../common/aws/s3-key.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly s3Service: S3Service,
  ) {}

  async findAll(query: QueryUserDto): Promise<PaginatedResult<User>> {
    const { page = 1, limit = 10, name, email } = query;

    const qb = this.userRepository.createQueryBuilder('user');

    if (name) {
      qb.andWhere('user.name LIKE :name', { name: `%${name}%` });
    }
    if (email) {
      qb.andWhere('user.email LIKE :email', { email: `%${email}%` });
    }

    qb.orderBy('user.id', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(dto);
    return this.userRepository.save(user);
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    if (user.photoKey) {
      await this.s3Service.deleteFile(user.photoKey);
    }
    await this.userRepository.delete(id);
  }

  async uploadPhoto(id: number, file: Express.Multer.File): Promise<User> {
    const user = await this.findOne(id);
    const key = buildObjectKey('users', user.id, file.originalname);
    const { key: newKey, url } = await this.s3Service.uploadFile(
      file.buffer,
      key,
      file.mimetype,
    );

    const oldKey = user.photoKey;
    user.photoUrl = url;
    user.photoKey = newKey;
    await this.userRepository.save(user);

    if (oldKey) {
      await this.s3Service.deleteFile(oldKey);
    }

    return user;
  }

  async deletePhoto(id: number): Promise<User> {
    const user = await this.findOne(id);
    if (!user.photoKey) {
      return user;
    }

    await this.s3Service.deleteFile(user.photoKey);
    user.photoUrl = null;
    user.photoKey = null;
    return this.userRepository.save(user);
  }
}
