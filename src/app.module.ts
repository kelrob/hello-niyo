import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { HelpersService } from './helpers/helpers.service';

@Module({
  imports: [ConfigModule.forRoot(), CoreModule, AuthModule, TaskModule],
  controllers: [AppController],
  providers: [AppService, HelpersService],
})
export class AppModule {}
