import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Director } from './entities/director.entity';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { QueryDirectorDto } from './dto/query-director.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';

@Injectable()
export class DirectorsService {
  constructor(
    @InjectRepository(Director)
    private readonly directorRepository: Repository<Director>,
  ) {}

  async findAll(query: QueryDirectorDto): Promise<PaginatedResult<Director>> {
    const { page = 1, limit = 10, name, nationality, birthYearFrom, birthYearTo } =
      query;

    // Filtering + pagination is done on the director table alone first,
    // because joining the one-to-many "films" relation before paginating
    // would multiply rows and break skip/take and the total count.
    const qb = this.directorRepository.createQueryBuilder('director');

    if (name) {
      qb.andWhere('director.name LIKE :name', { name: `%${name}%` });
    }
    if (nationality) {
      qb.andWhere('director.nationality = :nationality', { nationality });
    }
    if (birthYearFrom) {
      qb.andWhere('director.birthYear >= :birthYearFrom', { birthYearFrom });
    }
    if (birthYearTo) {
      qb.andWhere('director.birthYear <= :birthYearTo', { birthYearTo });
    }

    qb.orderBy('director.id', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [directors, total] = await qb.getManyAndCount();

    const ids = directors.map((director) => director.id);
    const data = ids.length
      ? await this.directorRepository.find({
          where: { id: In(ids) },
          relations: { films: true },
          order: { id: 'ASC' },
        })
      : [];

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number): Promise<Director> {
    const director = await this.directorRepository.findOne({
      where: { id },
      relations: { films: true },
    });
    if (!director) {
      throw new NotFoundException(`Director with id ${id} not found`);
    }
    return director;
  }

  async create(dto: CreateDirectorDto): Promise<Director> {
    const director = this.directorRepository.create(dto);
    return this.directorRepository.save(director);
  }

  async update(id: number, dto: UpdateDirectorDto): Promise<Director> {
    const director = await this.findOne(id);
    Object.assign(director, dto);
    return this.directorRepository.save(director);
  }

  async remove(id: number): Promise<void> {
    const result = await this.directorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Director with id ${id} not found`);
    }
  }
}
