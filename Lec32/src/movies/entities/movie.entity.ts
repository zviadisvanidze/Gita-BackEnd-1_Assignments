import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Director } from '../../directors/entities/director.entity';
import { MovieImage } from './movie-image.entity';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  genre: string;

  @Column()
  year: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  rating: number;

  @ManyToOne(() => Director, (director) => director.films, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'directorId' })
  director: Director;

  @Column()
  directorId: number;

  @OneToMany(() => MovieImage, (image) => image.movie)
  images: MovieImage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
