import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';

@Entity('directors')
export class Director {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  birthYear: number;

  @Column({ nullable: true })
  nationality: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @OneToMany(() => Movie, (movie) => movie.director)
  films: Movie[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
