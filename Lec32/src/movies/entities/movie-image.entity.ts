import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Movie } from './movie.entity';

@Entity('movie_images')
export class MovieImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;

  @Column()
  imageKey: string;

  @ManyToOne(() => Movie, (movie) => movie.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movieId' })
  movie: Movie;

  @Column()
  movieId: number;

  @CreateDateColumn()
  createdAt: Date;
}
