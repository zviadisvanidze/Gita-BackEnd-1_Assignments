import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ObjectLiteral, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { MailService } from '../common/mail/mail.service';

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockQueryBuilder = () => ({
  addSelect: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  getOne: jest.fn(),
});

const createMockRepository = <T extends ObjectLiteral = any>(): MockRepository<T> => ({
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  createQueryBuilder: jest.fn(),
});

describe('AuthService', () => {
  let service: AuthService;
  let repository: MockRepository<User>;
  let mailService: { sendOtpEmail: jest.Mock; sendWelcomeEmail: jest.Mock; sendAccountDeactivatedEmail: jest.Mock };
  let jwtService: { sign: jest.Mock };
  let queryBuilder: ReturnType<typeof createMockQueryBuilder>;

  beforeEach(async () => {
    queryBuilder = createMockQueryBuilder();
    repository = createMockRepository<User>();
    repository.createQueryBuilder!.mockReturnValue(queryBuilder);
    mailService = {
      sendOtpEmail: jest.fn(),
      sendWelcomeEmail: jest.fn(),
      sendAccountDeactivatedEmail: jest.fn(),
    };
    jwtService = { sign: jest.fn().mockReturnValue('signed-jwt-token') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: repository },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: { get: jest.fn((_key, def) => def) } },
        { provide: MailService, useValue: mailService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('creates an unverified user and sends an OTP email', async () => {
      const dto = { name: 'Ana', email: 'ana@example.com', password: 'password123' };
      repository.findOneBy!.mockResolvedValue(null);
      const created = { ...dto } as User;
      repository.create!.mockReturnValue(created);
      repository.save!.mockResolvedValue({ ...created, id: 1 });

      const result = await service.register(dto);

      expect(repository.findOneBy).toHaveBeenCalledWith({ email: dto.email });
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: dto.name,
          email: dto.email,
          isVerified: false,
          isActive: true,
        }),
      );
      expect(mailService.sendOtpEmail).toHaveBeenCalledWith(
        dto.email,
        dto.name,
        expect.any(String),
        expect.any(Number),
      );
      expect(result).toEqual({
        message: expect.any(String),
        email: dto.email,
      });
    });

    it('throws ConflictException when the email is already registered', async () => {
      repository.findOneBy!.mockResolvedValue({ id: 1 } as User);

      await expect(
        service.register({ name: 'Ana', email: 'ana@example.com', password: 'password123' }),
      ).rejects.toThrow(ConflictException);
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('verifyOtp', () => {
    it('activates the user, sends a welcome email and returns a token', async () => {
      const code = '123456';
      const hashedCode = await bcrypt.hash(code, 10);
      const user = {
        id: 1,
        name: 'Ana',
        email: 'ana@example.com',
        isVerified: false,
        otpCode: hashedCode,
        otpExpiresAt: new Date(Date.now() + 60_000),
      } as User;
      queryBuilder.getOne.mockResolvedValue(user);
      repository.save!.mockImplementation(async (u) => u);

      const result = await service.verifyOtp({ email: user.email, code });

      expect(user.isVerified).toBe(true);
      expect(user.otpCode).toBeNull();
      expect(mailService.sendWelcomeEmail).toHaveBeenCalledWith(user.email, user.name);
      expect(result.accessToken).toBe('signed-jwt-token');
      expect(result.user).not.toHaveProperty('otpCode');
    });

    it('throws BadRequestException for an invalid code', async () => {
      const user = {
        id: 1,
        email: 'ana@example.com',
        isVerified: false,
        otpCode: await bcrypt.hash('123456', 10),
        otpExpiresAt: new Date(Date.now() + 60_000),
      } as User;
      queryBuilder.getOne.mockResolvedValue(user);

      await expect(
        service.verifyOtp({ email: user.email, code: '000000' }),
      ).rejects.toThrow(BadRequestException);
      expect(mailService.sendWelcomeEmail).not.toHaveBeenCalled();
    });

    it('throws BadRequestException when the code has expired', async () => {
      const user = {
        id: 1,
        email: 'ana@example.com',
        isVerified: false,
        otpCode: await bcrypt.hash('123456', 10),
        otpExpiresAt: new Date(Date.now() - 60_000),
      } as User;
      queryBuilder.getOne.mockResolvedValue(user);

      await expect(
        service.verifyOtp({ email: user.email, code: '123456' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws NotFoundException when the user does not exist', async () => {
      queryBuilder.getOne.mockResolvedValue(null);

      await expect(
        service.verifyOtp({ email: 'missing@example.com', code: '123456' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('login', () => {
    it('returns an access token for valid, verified and active credentials', async () => {
      const password = 'password123';
      const user = {
        id: 1,
        name: 'Ana',
        email: 'ana@example.com',
        password: await bcrypt.hash(password, 10),
        isActive: true,
        isVerified: true,
      } as User;
      queryBuilder.getOne.mockResolvedValue(user);

      const result = await service.login({ email: user.email, password });

      expect(result.accessToken).toBe('signed-jwt-token');
      expect(result.user).not.toHaveProperty('password');
    });

    it('throws UnauthorizedException for a wrong password', async () => {
      const user = {
        id: 1,
        email: 'ana@example.com',
        password: await bcrypt.hash('correct-password', 10),
        isActive: true,
        isVerified: true,
      } as User;
      queryBuilder.getOne.mockResolvedValue(user);

      await expect(
        service.login({ email: user.email, password: 'wrong-password' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws ForbiddenException when the account is not verified', async () => {
      const password = 'password123';
      const user = {
        id: 1,
        email: 'ana@example.com',
        password: await bcrypt.hash(password, 10),
        isActive: true,
        isVerified: false,
      } as User;
      queryBuilder.getOne.mockResolvedValue(user);

      await expect(service.login({ email: user.email, password })).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('throws ForbiddenException when the account is deactivated', async () => {
      const password = 'password123';
      const user = {
        id: 1,
        email: 'ana@example.com',
        password: await bcrypt.hash(password, 10),
        isActive: false,
        isVerified: true,
      } as User;
      queryBuilder.getOne.mockResolvedValue(user);

      await expect(service.login({ email: user.email, password })).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('deactivate', () => {
    it('deactivates the account and sends a notification email', async () => {
      const user = {
        id: 1,
        name: 'Ana',
        email: 'ana@example.com',
        isActive: true,
      } as User;
      repository.findOneBy!.mockResolvedValue(user);
      repository.save!.mockImplementation(async (u) => u);

      const result = await service.deactivate(1);

      expect(user.isActive).toBe(false);
      expect(mailService.sendAccountDeactivatedEmail).toHaveBeenCalledWith(
        user.email,
        user.name,
      );
      expect(result).toEqual({ message: expect.any(String) });
    });

    it('throws BadRequestException when the account is already deactivated', async () => {
      repository.findOneBy!.mockResolvedValue({ id: 1, isActive: false } as User);

      await expect(service.deactivate(1)).rejects.toThrow(BadRequestException);
      expect(mailService.sendAccountDeactivatedEmail).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when the user does not exist', async () => {
      repository.findOneBy!.mockResolvedValue(null);

      await expect(service.deactivate(99)).rejects.toThrow(NotFoundException);
    });
  });
});
