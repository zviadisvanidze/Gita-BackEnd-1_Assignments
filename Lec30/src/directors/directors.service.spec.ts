import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { In, ObjectLiteral, Repository } from 'typeorm';
import { DirectorsService } from './directors.service';
import { Director } from './entities/director.entity';
import { CreateDirectorDto } from './dto/create-director.dto';

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
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

describe('DirectorsService', () => {
  let service: DirectorsService;
  let repository: MockRepository<Director>;
  let queryBuilder: ReturnType<typeof createMockQueryBuilder>;

  beforeEach(async () => {
    queryBuilder = createMockQueryBuilder();
    repository = createMockRepository<Director>();
    repository.createQueryBuilder!.mockReturnValue(queryBuilder);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DirectorsService,
        { provide: getRepositoryToken(Director), useValue: repository },
      ],
    }).compile();

    service = module.get<DirectorsService>(DirectorsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('returns paginated directors and loads their films when results exist', async () => {
      const summaryRows = [{ id: 1 } as Director];
      const fullDirectors = [
        { id: 1, name: 'Nolan', films: [] } as unknown as Director,
      ];
      queryBuilder.getManyAndCount.mockResolvedValue([summaryRows, 1]);
      repository.find!.mockResolvedValue(fullDirectors);

      const result = await service.findAll({});

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('director');
      expect(queryBuilder.andWhere).not.toHaveBeenCalled();
      expect(queryBuilder.orderBy).toHaveBeenCalledWith('director.id', 'ASC');
      expect(queryBuilder.skip).toHaveBeenCalledWith(0);
      expect(queryBuilder.take).toHaveBeenCalledWith(10);
      expect(repository.find).toHaveBeenCalledWith({
        where: { id: In([1]) },
        relations: { films: true },
        order: { id: 'ASC' },
      });
      expect(result).toEqual({
        data: fullDirectors,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('applies name, nationality, birth year and pagination filters', async () => {
      queryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

      await service.findAll({
        page: 2,
        limit: 5,
        name: 'Nolan',
        nationality: 'British',
        birthYearFrom: 1950,
        birthYearTo: 1980,
      });

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'director.name LIKE :name',
        { name: '%Nolan%' },
      );
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'director.nationality = :nationality',
        { nationality: 'British' },
      );
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'director.birthYear >= :birthYearFrom',
        { birthYearFrom: 1950 },
      );
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'director.birthYear <= :birthYearTo',
        { birthYearTo: 1980 },
      );
      expect(queryBuilder.skip).toHaveBeenCalledWith(5);
      expect(queryBuilder.take).toHaveBeenCalledWith(5);
    });

    it('skips the relations lookup when there are no matching directors', async () => {
      queryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

      const result = await service.findAll({});

      expect(repository.find).not.toHaveBeenCalled();
      expect(result).toEqual({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      });
    });
  });

  describe('findOne', () => {
    it('returns the director with its films when found', async () => {
      const director = {
        id: 1,
        name: 'Nolan',
        films: [],
      } as unknown as Director;
      repository.findOne!.mockResolvedValue(director);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { films: true },
      });
      expect(result).toBe(director);
    });

    it('throws NotFoundException when the director does not exist', async () => {
      repository.findOne!.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('creates and persists a new director', async () => {
      const dto: CreateDirectorDto = { name: 'Nolan' };
      const created = { ...dto } as Director;
      const saved = { id: 1, ...dto } as Director;
      repository.create!.mockReturnValue(created);
      repository.save!.mockResolvedValue(saved);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(created);
      expect(result).toBe(saved);
    });
  });

  describe('update', () => {
    it('merges the dto into the existing director and saves it', async () => {
      const existing = {
        id: 1,
        name: 'Old Name',
        nationality: 'US',
      } as Director;
      repository.findOne!.mockResolvedValue(existing);
      repository.save!.mockImplementation(async (director) => director);

      const result = await service.update(1, { name: 'New Name' });

      expect(result).toEqual({ id: 1, name: 'New Name', nationality: 'US' });
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, name: 'New Name' }),
      );
    });

    it('throws NotFoundException when the director to update does not exist', async () => {
      repository.findOne!.mockResolvedValue(null);

      await expect(service.update(99, { name: 'X' })).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes the director when it exists', async () => {
      repository.delete!.mockResolvedValue({ affected: 1 });

      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('throws NotFoundException when nothing was deleted', async () => {
      repository.delete!.mockResolvedValue({ affected: 0 });

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
