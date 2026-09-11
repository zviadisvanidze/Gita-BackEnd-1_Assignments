import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { S3Service } from '../common/aws/s3.service';

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockQueryBuilder = () => ({
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn(),
});

const createMockRepository = <T extends ObjectLiteral = any>(): MockRepository<T> => ({
  createQueryBuilder: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let repository: MockRepository<User>;
  let s3Service: { uploadFile: jest.Mock; deleteFile: jest.Mock };
  let queryBuilder: ReturnType<typeof createMockQueryBuilder>;

  beforeEach(async () => {
    queryBuilder = createMockQueryBuilder();
    repository = createMockRepository<User>();
    s3Service = { uploadFile: jest.fn(), deleteFile: jest.fn() };
    repository.createQueryBuilder!.mockReturnValue(queryBuilder);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repository },
        { provide: S3Service, useValue: s3Service },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('returns paginated users without filters', async () => {
      const users = [{ id: 1, name: 'Ana' } as User];
      queryBuilder.getManyAndCount.mockResolvedValue([users, 1]);

      const result = await service.findAll({});

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(queryBuilder.andWhere).not.toHaveBeenCalled();
      expect(queryBuilder.orderBy).toHaveBeenCalledWith('user.id', 'ASC');
      expect(queryBuilder.skip).toHaveBeenCalledWith(0);
      expect(queryBuilder.take).toHaveBeenCalledWith(10);
      expect(result).toEqual({
        data: users,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('applies name, email and pagination filters', async () => {
      queryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

      await service.findAll({ page: 2, limit: 5, name: 'Ana', email: 'ana@' });

      expect(queryBuilder.andWhere).toHaveBeenCalledWith('user.name LIKE :name', {
        name: '%Ana%',
      });
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'user.email LIKE :email',
        { email: '%ana@%' },
      );
      expect(queryBuilder.skip).toHaveBeenCalledWith(5);
      expect(queryBuilder.take).toHaveBeenCalledWith(5);
    });
  });

  describe('findOne', () => {
    it('returns the user when found', async () => {
      const user = { id: 1, name: 'Ana' } as User;
      repository.findOneBy!.mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toBe(user);
    });

    it('throws NotFoundException when the user does not exist', async () => {
      repository.findOneBy!.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('creates and persists a new user', async () => {
      const dto: CreateUserDto = { name: 'Ana', email: 'ana@example.com' };
      const created = { ...dto } as User;
      const saved = { id: 1, ...dto } as User;
      repository.create!.mockReturnValue(created);
      repository.save!.mockResolvedValue(saved);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(created);
      expect(result).toBe(saved);
    });
  });

  describe('update', () => {
    it('merges the dto into the existing user and saves it', async () => {
      const existing = { id: 1, name: 'Old Name', email: 'ana@example.com' } as User;
      repository.findOneBy!.mockResolvedValue(existing);
      repository.save!.mockImplementation(async (user) => user);

      const result = await service.update(1, { name: 'New Name' });

      expect(result).toEqual({
        id: 1,
        name: 'New Name',
        email: 'ana@example.com',
      });
    });

    it('throws NotFoundException when the user to update does not exist', async () => {
      repository.findOneBy!.mockResolvedValue(null);

      await expect(service.update(99, { name: 'X' })).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes the user and its photo from S3 when a photo is set', async () => {
      repository.findOneBy!.mockResolvedValue({
        id: 1,
        photoKey: 'users/1/a.jpg',
      } as User);

      await expect(service.remove(1)).resolves.toBeUndefined();

      expect(s3Service.deleteFile).toHaveBeenCalledWith('users/1/a.jpg');
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('deletes the user without touching S3 when no photo is set', async () => {
      repository.findOneBy!.mockResolvedValue({ id: 1, photoKey: null } as User);

      await service.remove(1);

      expect(s3Service.deleteFile).not.toHaveBeenCalled();
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('throws NotFoundException when the user does not exist', async () => {
      repository.findOneBy!.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });

  describe('uploadPhoto', () => {
    it('uploads the new photo, saves it, then deletes the old one', async () => {
      const user = {
        id: 1,
        photoUrl: 'https://cdn/users/1/old.jpg',
        photoKey: 'users/1/old.jpg',
      } as User;
      repository.findOneBy!.mockResolvedValue(user);
      s3Service.uploadFile.mockResolvedValue({
        key: 'users/1/new.jpg',
        url: 'https://cdn/users/1/new.jpg',
      });
      repository.save!.mockImplementation(async (u) => u);
      const file = {
        originalname: 'new.jpg',
        buffer: Buffer.from('x'),
        mimetype: 'image/jpeg',
      } as Express.Multer.File;

      const result = await service.uploadPhoto(1, file);

      expect(s3Service.uploadFile).toHaveBeenCalledWith(
        file.buffer,
        expect.stringContaining('users/1/'),
        'image/jpeg',
      );
      expect(result.photoUrl).toBe('https://cdn/users/1/new.jpg');
      expect(result.photoKey).toBe('users/1/new.jpg');
      expect(s3Service.deleteFile).toHaveBeenCalledWith('users/1/old.jpg');
    });

    it('does not attempt to delete an old photo when none existed', async () => {
      const user = { id: 1, photoUrl: null, photoKey: null } as User;
      repository.findOneBy!.mockResolvedValue(user);
      s3Service.uploadFile.mockResolvedValue({
        key: 'users/1/new.jpg',
        url: 'https://cdn/users/1/new.jpg',
      });
      repository.save!.mockImplementation(async (u) => u);
      const file = {
        originalname: 'new.jpg',
        buffer: Buffer.from('x'),
        mimetype: 'image/jpeg',
      } as Express.Multer.File;

      await service.uploadPhoto(1, file);

      expect(s3Service.deleteFile).not.toHaveBeenCalled();
    });
  });

  describe('deletePhoto', () => {
    it('deletes the photo from S3 and clears the columns', async () => {
      const user = {
        id: 1,
        photoUrl: 'https://cdn/users/1/a.jpg',
        photoKey: 'users/1/a.jpg',
      } as User;
      repository.findOneBy!.mockResolvedValue(user);
      repository.save!.mockImplementation(async (u) => u);

      const result = await service.deletePhoto(1);

      expect(s3Service.deleteFile).toHaveBeenCalledWith('users/1/a.jpg');
      expect(result.photoUrl).toBeNull();
      expect(result.photoKey).toBeNull();
    });

    it('is a no-op when the user has no photo set', async () => {
      const user = { id: 1, photoUrl: null, photoKey: null } as User;
      repository.findOneBy!.mockResolvedValue(user);

      const result = await service.deletePhoto(1);

      expect(s3Service.deleteFile).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
      expect(result).toBe(user);
    });
  });
});
