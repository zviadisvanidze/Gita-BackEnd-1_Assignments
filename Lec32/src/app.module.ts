import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesModule } from './movies/movies.module';
import { DirectorsModule } from './directors/directors.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './common/mail/mail.module';
import { Movie } from './movies/entities/movie.entity';
import { MovieImage } from './movies/entities/movie-image.entity';
import { Director } from './directors/entities/director.entity';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', '127.0.0.1'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_NAME', 'lec28'),
        entities: [Movie, Director, User, MovieImage],
        synchronize: true,
      }),
    }),
    MailModule,
    MoviesModule,
    DirectorsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
