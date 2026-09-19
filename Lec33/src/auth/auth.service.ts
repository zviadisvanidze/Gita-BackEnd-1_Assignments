import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';
import { CreateUserInput } from '../users/dto/create-user.input';
import { LoginInput } from './dto/login.input';
import { AuthPayload } from './types/auth-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private signToken(user: UserDocument): string {
    return this.jwtService.sign({ sub: user.id, email: user.email });
  }

  async register(input: CreateUserInput): Promise<AuthPayload> {
    const existing = await this.usersService.findByEmail(input.email);
    if (existing) {
      throw new ConflictException(
        `User with email ${input.email} already exists`,
      );
    }
    const user = await this.usersService.create(input);
    return { accessToken: this.signToken(user), user };
  }

  async login(input: LoginInput): Promise<AuthPayload> {
    const user = await this.usersService.findByEmailWithPassword(
      input.email,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isMatch = await bcrypt.compare(input.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return { accessToken: this.signToken(user), user };
  }
}
