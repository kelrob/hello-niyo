import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepositoryService } from '../repositories/Users/user-repository.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { SignupRequest } from './dto/request/signup.request';
import { LoginRequest } from './dto/request/login.request';
import { User } from '../repositories/Users/entities/user.entity';
import { PayloadResponse } from './dto/response/payload.response';
import * as moment from 'moment';

describe('AuthService', () => {
  let service: AuthService;
  let userRepositoryService: UserRepositoryService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const signupRequest: SignupRequest = {
    firstName: 'testFirstName',
    lastName: 'testLastName',
    email: 'test@example.com',
    password: 'password',
  };

  const loginRequest: LoginRequest = {
    email: 'test@example.com',
    password: 'wrongPassword',
  };

  const newUser: MockUser = {
    id: 1,
    firstName: 'testFirstName',
    lastName: 'testLastName',
    email: 'test@example.com',
    password: 'password',
    hashPassword: () => Promise.resolve(),
    createdAt: moment('2024-05-17 09:43:53.142466').toDate(),
    updatedAt: moment('2024-05-17 09:43:53.142466').toDate(),
  };

  const payload: PayloadResponse = {
    exp: 0,
    iat: 0,
    email: 'test@example.com',
    id: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepositoryService,
          useValue: {
            findUserByEmail: jest.fn(),
            createUser: jest.fn(),
            findUserByEmailAndId: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepositoryService = module.get<UserRepositoryService>(UserRepositoryService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('signup', () => {
    it('should throw BadRequestException if user already exists', async () => {
      jest.spyOn(userRepositoryService, 'findUserByEmail').mockResolvedValue({} as User);

      await expect(service.signup(signupRequest)).rejects.toThrow(BadRequestException);
    });

    it('should create a new user and return SignupResponse', async () => {
      jest.spyOn(userRepositoryService, 'findUserByEmail').mockResolvedValue(null);
      jest.spyOn(userRepositoryService, 'createUser').mockResolvedValue(newUser);

      const result = await service.signup(signupRequest);

      expect(userRepositoryService.createUser).toHaveBeenCalledWith(signupRequest);
      expect(result).toHaveProperty('message', 'Account created Successfully');
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user does not exist', async () => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'password',
      };

      jest.spyOn(userRepositoryService, 'findUserByEmail').mockResolvedValue(null);

      await expect(service.login(loginRequest)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      jest.spyOn(userRepositoryService, 'findUserByEmail').mockResolvedValue(newUser);
      jest.spyOn(service, 'checkPassword' as any).mockResolvedValue(false);

      await expect(service.login(loginRequest)).rejects.toThrow(UnauthorizedException);
    });

    it('should return LoginResponse with access token if credentials are valid', async () => {
      const accessToken = 'generatedToken';

      jest.spyOn(userRepositoryService, 'findUserByEmail').mockResolvedValue(newUser);
      jest.spyOn(service, 'checkPassword' as any).mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue(accessToken);
      jest.spyOn(configService, 'get').mockReturnValue('3600');

      const result = await service.login(loginRequest);

      expect(result).toHaveProperty('message', 'Logged in successfully');
      expect(result).toHaveProperty('accessToken', accessToken);
      expect(result.data).toHaveProperty('id', newUser.id);
      expect(result.data).toHaveProperty('email', newUser.email);
    });
  });

  describe('validateUser', () => {
    it('should throw UnauthorizedException if user does not exist', async () => {
      jest.spyOn(userRepositoryService, 'findUserByEmailAndId').mockResolvedValue(null);

      await expect(service.validateUser(payload)).rejects.toThrow(UnauthorizedException);
    });

    it('should return the user if valid payload is provided', async () => {
      jest.spyOn(userRepositoryService, 'findUserByEmailAndId').mockResolvedValue(newUser);

      const result = await service.validateUser(payload);

      expect(result).toEqual(newUser);
    });
  });
});

class MockUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  hashPassword: () => Promise<void>;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<MockUser>) {
    this.id = data.id || 1;
    this.firstName = data.firstName || 'John';
    this.lastName = data.lastName || 'Doe';
    this.email = data.email || 'test@example.com';
    this.password = data.password || 'password';
    this.hashPassword = () => Promise.resolve();
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}
