import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { MailService } from '../common/mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { LoginDto } from './dto/login.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  private readonly otpExpirationMinutes: number;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {
    this.otpExpirationMinutes = Number(
      this.configService.get<string>('OTP_EXPIRATION_MINUTES', '10'),
    );
  }

  private generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private signToken(user: User): string {
    return this.jwtService.sign({ sub: user.id, email: user.email });
  }

  private sanitizeUser(user: User): Omit<User, 'password' | 'otpCode' | 'otpExpiresAt'> {
    const { password, otpCode, otpExpiresAt, ...safeUser } = user;
    return safeUser;
  }

  private async issueAndSendOtp(user: User): Promise<void> {
    const code = this.generateOtpCode();
    user.otpCode = await bcrypt.hash(code, SALT_ROUNDS);
    user.otpExpiresAt = new Date(
      Date.now() + this.otpExpirationMinutes * 60 * 1000,
    );
    await this.userRepository.save(user);
    await this.mailService.sendOtpEmail(
      user.email,
      user.name,
      code,
      this.otpExpirationMinutes,
    );
  }

  async register(dto: RegisterDto): Promise<{ message: string; email: string }> {
    const existing = await this.userRepository.findOneBy({ email: dto.email });
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      isVerified: false,
      isActive: true,
    });
    await this.userRepository.save(user);

    await this.issueAndSendOtp(user);

    return {
      message:
        'Registration successful. Please check your email for the verification code.',
      email: user.email,
    };
  }

  async verifyOtp(
    dto: VerifyOtpDto,
  ): Promise<{ accessToken: string; user: Partial<User> }> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect(['user.otpCode', 'user.otpExpiresAt'])
      .where('user.email = :email', { email: dto.email })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.isVerified) {
      throw new BadRequestException('User is already verified');
    }
    if (!user.otpCode || !user.otpExpiresAt) {
      throw new BadRequestException(
        'No active verification code. Please request a new one',
      );
    }
    if (user.otpExpiresAt.getTime() < Date.now()) {
      throw new BadRequestException(
        'Verification code has expired. Please request a new one',
      );
    }

    const isValid = await bcrypt.compare(dto.code, user.otpCode);
    if (!isValid) {
      throw new BadRequestException('Invalid verification code');
    }

    user.isVerified = true;
    user.otpCode = null;
    user.otpExpiresAt = null;
    await this.userRepository.save(user);

    await this.mailService.sendWelcomeEmail(user.email, user.name);

    return { accessToken: this.signToken(user), user: this.sanitizeUser(user) };
  }

  async resendOtp(dto: ResendOtpDto): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ email: dto.email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.isVerified) {
      throw new BadRequestException('User is already verified');
    }

    await this.issueAndSendOtp(user);

    return { message: 'A new verification code has been sent to your email.' };
  }

  async login(
    dto: LoginDto,
  ): Promise<{ accessToken: string; user: Partial<User> }> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: dto.email })
      .getOne();

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isActive) {
      throw new ForbiddenException('This account has been deactivated');
    }
    if (!user.isVerified) {
      throw new ForbiddenException('Please verify your email before logging in');
    }

    return { accessToken: this.signToken(user), user: this.sanitizeUser(user) };
  }

  async deactivate(userId: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.isActive) {
      throw new BadRequestException('Account is already deactivated');
    }

    user.isActive = false;
    await this.userRepository.save(user);

    await this.mailService.sendAccountDeactivatedEmail(user.email, user.name);

    return { message: 'Your account has been deactivated.' };
  }
}
