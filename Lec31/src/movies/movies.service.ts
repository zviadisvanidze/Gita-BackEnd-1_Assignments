import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { MovieImage } from './entities/movie-image.entity';
import { Director } from '../directors/entities/director.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { QueryMovieDto } from './dto/query-movie.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { S3Service } from '../common/aws/s3.service';
import { buildObjectKey } from '../common/aws/s3-key.util';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Director)
    private readonly directorRepository: Repository<Director>,
    @InjectRepository(MovieImage)
    private readonly movieImageRepository: Repository<MovieImage>,
    private readonly s3Service: S3Service,
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

    const [movies, total] = await qb.getManyAndCount();

    // Re-fetch with the images relation after paginating: joining the
    // one-to-many "images" relation before paginating would multiply rows
    // and break skip/take and the total count (same trap as directors.films).
    const ids = movies.map((movie) => movie.id);
    const data = ids.length
      ? await this.movieRepository.find({
          where: { id: In(ids) },
          relations: { director: true, images: true },
          order: { id: 'ASC' },
        })
      : [];

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: { director: true, images: true },
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
    const movie = await this.findOne(id);
    await Promise.all(
      movie.images.map((image) => this.s3Service.deleteFile(image.imageKey)),
    );
    await this.movieRepository.delete(id);
  }

  async addImages(
    movieId: number,
    files: Express.Multer.File[],
  ): Promise<MovieImage[]> {
    await this.findOne(movieId);
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image file is required');
    }

    const uploads = await Promise.all(
      files.map((file) =>
        this.s3Service.uploadFile(
          file.buffer,
          buildObjectKey('movies', movieId, file.originalname),
          file.mimetype,
        ),
      ),
    );

    const images = uploads.map(({ key, url }) =>
      this.movieImageRepository.create({
        imageUrl: url,
        imageKey: key,
        movieId,
      }),
    );

    return this.movieImageRepository.save(images);
  }

  async removeImage(movieId: number, imageId: number): Promise<void> {
    const image = await this.movieImageRepository.findOne({
      where: { id: imageId, movieId },
    });
    if (!image) {
      throw new NotFoundException(
        `Image with id ${imageId} not found for movie ${movieId}`,
      );
    }

    await this.s3Service.deleteFile(image.imageKey);
    await this.movieImageRepository.delete(imageId);
  }
}
