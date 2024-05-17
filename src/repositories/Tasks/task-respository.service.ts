import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskRequest } from '../../task/dto/request/create-task.request';
import { UpdateTaskRequest } from '../../task/dto/request/update-task.request';
import { ChangeTaskStatusRequest } from '../../task/dto/request/change-task-status.request';

@Injectable()
export class TaskRepositoryService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    const task = this.taskRepository.create(taskData);
    return await this.taskRepository.save(task);
  }

  async findTaskByUserIdAndTitle(userId: number, title: string): Promise<Task> {
    return this.taskRepository.findOne({ where: { userId, title } });
  }

  async findTaskByIdAndUserId(taskId: number, userId: number): Promise<Task> {
    return this.taskRepository.findOne({ where: { id: taskId, userId } });
  }

  async findTaskByUserId(userId: number): Promise<Task[]> {
    return this.taskRepository.find({ where: { userId } });
  }

  async updateTask(task: Task, body: UpdateTaskRequest | ChangeTaskStatusRequest): Promise<Task> {
    Object.assign(task, body);
    return await this.taskRepository.save(task);
  }

  async deleteTask(taskId: number, userId: number): Promise<boolean> {
    const result = await this.taskRepository
      .createQueryBuilder()
      .softDelete()
      .from(Task)
      .where('id = :taskId', { taskId })
      .andWhere('userId = :userId', { userId })
      .execute();

    return result.affected > 0;
  }
}
