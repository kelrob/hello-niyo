import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupRequest } from './dto/request/signup.request';
import { SignupResponse } from './dto/response/signup.response';
import { plainToInstance } from 'class-transformer';
import { UserRepositoryService } from '../repositories/Users/user-repository.service';
import { LoginRequest } from './dto/request/login.request';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginResponse } from './dto/response/login.response';
import { PayloadResponse } from './dto/response/payload.response';
import { User } from '../repositories/Users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepositoryService: UserRepositoryService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async signup(body: SignupRequest): Promise<SignupResponse> {
    const { email } = body;
    const userExists = await this.userRepositoryService.findUserByEmail(email);

    if (userExists) {
      throw new BadRequestException('User already Exists');
    }

    const data = await this.userRepositoryService.createUser(body);
    return plainToInstance(SignupResponse, { message: 'Account created Successfully', data });
  }

  public async login(body: LoginRequest): Promise<any> {
    const { email, password } = body;
    const user = await this.userRepositoryService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid Login credentials');
    }

    // compare passwords
    if (!(await this.checkPassword(password, user.password))) {
      throw new UnauthorizedException('Incorrect Login Credentials');
    }

    // generate and sign token
    const token = this.createToken({
      email: user.email,
      id: user.id,
    });

    const data = { ...user, ...token };
    return plainToInstance(LoginResponse, {
      message: 'Logged in successfully',
      data,
      accessToken: token.accessToken,
    });
  }

  public async validateUser(payload: PayloadResponse): Promise<User> {
    const user = await this.userRepositoryService.findUserByEmailAndId(payload.email, payload.id);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }

  private checkPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private createToken(payload: { email: string; id: number }): { expiresIn: string; accessToken: string } {
    const accessToken = this.jwtService.sign(payload);

    return {
      expiresIn: this.configService.get('jwt.expiresIn'),
      accessToken,
    };
  }
}
