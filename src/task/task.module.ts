import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskRepositoryModule } from '../repositories/Tasks/task-repository.module';
import { HelpersService } from '../helpers/helpers.service';
import { TaskGateway } from './task.gateway';

@Module({
  imports: [TaskRepositoryModule],
  controllers: [TaskController],
  providers: [TaskService, HelpersService, TaskGateway],
})
export class TaskModule {}
