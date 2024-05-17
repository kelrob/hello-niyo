import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignupRequest } from './dto/request/signup.request';
import { SignupResponse } from './dto/response/signup.response';
import { LoginRequest } from './dto/request/login.request';
import { LoginResponse } from './dto/response/login.response';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const signupRequest: SignupRequest = {
    firstName: 'testFirstName',
    lastName: 'testLastName',
    email: 'test@example.com',
    password: 'password',
  };

  const loginRequest: LoginRequest = {
    email: 'test@example.com',
    password: 'password',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('signup', () => {
    it('should call authService.signup with the correct body', async () => {
      jest.spyOn(service, 'signup');

      await controller.signup(signupRequest);

      expect(service.signup).toHaveBeenCalledWith(signupRequest);
    });

    it('should return the correct response', async () => {
      const signupResponse: SignupResponse = {
        message: 'Account created Successfully',
        data: {
          id: 1,
          email: 'test@example.com',
          firstName: 'testFirstName',
          lastName: 'testLastName',
        },
      };
      jest.spyOn(service, 'signup').mockResolvedValue(signupResponse);

      const result = await controller.signup(signupRequest);

      expect(result).toEqual(signupResponse);
    });
  });

  describe('login', () => {
    it('should call authService.login with the correct body', async () => {
      jest.spyOn(service, 'login');

      await controller.login(loginRequest);

      expect(service.login).toHaveBeenCalledWith(loginRequest);
    });

    it('should return the correct response', async () => {
      const loginResponse: LoginResponse = {
        message: 'Logged in successfully',
        data: {
          id: 17,
          email: 'johndoe@email.com',
          firstName: 'John',
          lastName: 'Doe',
        },
        accessToken: 'randomToken',
      };
      jest.spyOn(service, 'login').mockResolvedValue(loginResponse);

      const result = await controller.login(loginRequest);

      expect(result).toEqual(loginResponse);
    });
  });
});
