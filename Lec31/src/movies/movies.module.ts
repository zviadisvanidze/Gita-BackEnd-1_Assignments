import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { MovieImage } from './entities/movie-image.entity';
import { Director } from '../directors/entities/director.entity';
import { S3Module } from '../common/aws/s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie, Director, MovieImage]),
    S3Module,
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
