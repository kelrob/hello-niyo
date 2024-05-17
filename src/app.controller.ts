import { Controller, Get, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect('/api/v1/health-check')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/health-check')
  healthCheck(): { status: boolean; message: string } {
    return this.appService.healthCheck();
  }
}
