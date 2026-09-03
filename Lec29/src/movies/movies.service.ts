import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { Director } from '../directors/entities/director.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { QueryMovieDto } from './dto/query-movie.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Director)
    private readonly directorRepository: Repository<Director>,
  ) {}

  async findAll(query: QueryMovieDto): Promise<PaginatedResult<Movie>> {
    const { page = 1, limit = 10, name, genre, yearFrom, yearTo, directorId } =
      query;

    const qb = this.movieRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.director', 'director');

    if (name) {
      qb.andWhere('movie.title LIKE :name', { name: `%${name}%` });
    }
    if (genre) {
      qb.andWhere('movie.genre = :genre', { genre });
    }
    if (yearFrom) {
      qb.andWhere('movie.year >= :yearFrom', { yearFrom });
    }
    if (yearTo) {
      qb.andWhere('movie.year <= :yearTo', { yearTo });
    }
    if (directorId) {
      qb.andWhere('movie.directorId = :directorId', { directorId });
    }

    qb.orderBy('movie.id', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: { director: true },
    });
    if (!movie) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }
    return movie;
  }

  async create(dto: CreateMovieDto): Promise<Movie> {
    const director = await this.directorRepository.findOne({
      where: { id: dto.directorId },
    });
    if (!director) {
      throw new NotFoundException(
        `Director with id ${dto.directorId} not found`,
      );
    }
    const movie = this.movieRepository.create({ ...dto, director });
    return this.movieRepository.save(movie);
  }

  async update(id: number, dto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.findOne(id);

    if (dto.directorId) {
      const director = await this.directorRepository.findOne({
        where: { id: dto.directorId },
      });
      if (!director) {
        throw new NotFoundException(
          `Director with id ${dto.directorId} not found`,
        );
      }
      movie.director = director;
    }

    Object.assign(movie, { ...dto, director: movie.director });
    return this.movieRepository.save(movie);
  }

  async remove(id: number): Promise<void> {
    const result = await this.movieRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }
  }
}
