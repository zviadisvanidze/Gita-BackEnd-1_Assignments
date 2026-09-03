import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { Director } from '../directors/entities/director.entity';
import { CreateMovieDto } from './dto/create-movie.dto';

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockQueryBuilder = () => ({
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn(),
});

const createMockRepository = <T extends ObjectLiteral = any>(): MockRepository<T> => ({
  createQueryBuilder: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

describe('MoviesService', () => {
  let service: MoviesService;
  let movieRepository: MockRepository<Movie>;
  let directorRepository: MockRepository<Director>;
  let queryBuilder: ReturnType<typeof createMockQueryBuilder>;

  beforeEach(async () => {
    queryBuilder = createMockQueryBuilder();
    movieRepository = createMockRepository<Movie>();
    directorRepository = createMockRepository<Director>();
    movieRepository.createQueryBuilder!.mockReturnValue(queryBuilder);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: getRepositoryToken(Movie), useValue: movieRepository },
        { provide: getRepositoryToken(Director), useValue: directorRepository },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('joins the director and returns paginated movies without filters', async () => {
      const movies = [{ id: 1, title: 'Inception' } as Movie];
      queryBuilder.getManyAndCount.mockResolvedValue([movies, 1]);

      const result = await service.findAll({});

      expect(movieRepository.createQueryBuilder).toHaveBeenCalledWith('movie');
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'movie.director',
        'director',
      );
      expect(queryBuilder.andWhere).not.toHaveBeenCalled();
      expect(queryBuilder.orderBy).toHaveBeenCalledWith('movie.id', 'ASC');
      expect(queryBuilder.skip).toHaveBeenCalledWith(0);
      expect(queryBuilder.take).toHaveBeenCalledWith(10);
      expect(result).toEqual({
        data: movies,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('applies title, genre, year range, director and pagination filters', async () => {
      queryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

      await service.findAll({
        page: 3,
        limit: 5,
        name: 'Inception',
        genre: 'Sci-Fi',
        yearFrom: 2000,
        yearTo: 2020,
        directorId: 7,
      });

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'movie.title LIKE :name',
        { name: '%Inception%' },
      );
      expect(queryBuilder.andWhere).toHaveBeenCalledWith('movie.genre = :genre', {
        genre: 'Sci-Fi',
      });
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'movie.year >= :yearFrom',
        { yearFrom: 2000 },
      );
      expect(queryBuilder.andWhere).toHaveBeenCalledWith('movie.year <= :yearTo', {
        yearTo: 2020,
      });
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'movie.directorId = :directorId',
        { directorId: 7 },
      );
      expect(queryBuilder.skip).toHaveBeenCalledWith(10);
      expect(queryBuilder.take).toHaveBeenCalledWith(5);
    });
  });

  describe('findOne', () => {
    it('returns the movie with its director when found', async () => {
      const movie = { id: 1, title: 'Inception' } as Movie;
      movieRepository.findOne!.mockResolvedValue(movie);

      const result = await service.findOne(1);

      expect(movieRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { director: true },
      });
      expect(result).toBe(movie);
    });

    it('throws NotFoundException when the movie does not exist', async () => {
      movieRepository.findOne!.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const dto: CreateMovieDto = {
      title: 'Inception',
      genre: 'Sci-Fi',
      year: 2010,
      directorId: 5,
    };

    it('creates the movie when the director exists', async () => {
      const director = { id: 5, name: 'Nolan' } as Director;
      const created = { ...dto, director } as unknown as Movie;
      const saved = { ...created, id: 1 } as Movie;
      directorRepository.findOne!.mockResolvedValue(director);
      movieRepository.create!.mockReturnValue(created);
      movieRepository.save!.mockResolvedValue(saved);

      const result = await service.create(dto);

      expect(directorRepository.findOne).toHaveBeenCalledWith({
        where: { id: dto.directorId },
      });
      expect(movieRepository.create).toHaveBeenCalledWith({ ...dto, director });
      expect(movieRepository.save).toHaveBeenCalledWith(created);
      expect(result).toBe(saved);
    });

    it('throws NotFoundException when the director does not exist', async () => {
      directorRepository.findOne!.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
      expect(movieRepository.create).not.toHaveBeenCalled();
      expect(movieRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('keeps the existing director when directorId is not provided', async () => {
      const existingDirector = { id: 5, name: 'Nolan' } as Director;
      const movie = {
        id: 1,
        title: 'Old Title',
        director: existingDirector,
      } as Movie;
      movieRepository.findOne!.mockResolvedValue(movie);
      movieRepository.save!.mockImplementation(async (m) => m);

      const result = await service.update(1, { title: 'New Title' });

      expect(directorRepository.findOne).not.toHaveBeenCalled();
      expect(result.director).toBe(existingDirector);
      expect(result.title).toBe('New Title');
    });

    it('reassigns the director when a new directorId is provided and found', async () => {
      const oldDirector = { id: 5, name: 'Nolan' } as Director;
      const newDirector = { id: 8, name: 'Spielberg' } as Director;
      const movie = { id: 1, title: 'Old Title', director: oldDirector } as Movie;
      movieRepository.findOne!.mockResolvedValue(movie);
      directorRepository.findOne!.mockResolvedValue(newDirector);
      movieRepository.save!.mockImplementation(async (m) => m);

      const result = await service.update(1, { directorId: 8 });

      expect(directorRepository.findOne).toHaveBeenCalledWith({
        where: { id: 8 },
      });
      expect(result.director).toBe(newDirector);
    });

    it('throws NotFoundException when the new director does not exist', async () => {
      const movie = {
        id: 1,
        title: 'Old Title',
        director: { id: 5 } as Director,
      } as Movie;
      movieRepository.findOne!.mockResolvedValue(movie);
      directorRepository.findOne!.mockResolvedValue(null);

      await expect(service.update(1, { directorId: 999 })).rejects.toThrow(
        NotFoundException,
      );
      expect(movieRepository.save).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when the movie to update does not exist', async () => {
      movieRepository.findOne!.mockResolvedValue(null);

      await expect(service.update(99, { title: 'X' })).rejects.toThrow(
        NotFoundException,
      );
      expect(directorRepository.findOne).not.toHaveBeenCalled();
      expect(movieRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes the movie when it exists', async () => {
      movieRepository.delete!.mockResolvedValue({ affected: 1 });

      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(movieRepository.delete).toHaveBeenCalledWith(1);
    });

    it('throws NotFoundException when nothing was deleted', async () => {
      movieRepository.delete!.mockResolvedValue({ affected: 0 });

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
