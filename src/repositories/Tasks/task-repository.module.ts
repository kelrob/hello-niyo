import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskRepositoryService } from './task-respository.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  providers: [TaskRepositoryService],
  exports: [TaskRepositoryService],
})
export class TaskRepositoryModule {}
