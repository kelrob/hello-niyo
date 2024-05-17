import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupRequest } from './dto/request/signup.request';
import { SignupResponse } from './dto/response/signup.response';
import { LoginRequest } from './dto/request/login.request';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  public async signup(@Body() body: SignupRequest): Promise<SignupResponse> {
    return this.authService.signup(body);
  }

  @Post('login')
  public async login(@Body() body: LoginRequest): Promise<any> {
    return this.authService.login(body);
  }
}
