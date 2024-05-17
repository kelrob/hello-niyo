import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskRequest } from './dto/request/create-task.request';
import { GetTaskResponse, GetTasksResponse } from './dto/response/task.response';
import { TaskRepositoryService } from '../repositories/Tasks/task-respository.service';
import { plainToInstance } from 'class-transformer';
import { UpdateTaskRequest } from './dto/request/update-task.request';
import { HelpersService } from '../helpers/helpers.service';
import { ChangeTaskStatusRequest } from './dto/request/change-task-status.request';
import { TaskStatusType } from '../repositories/Tasks/task.constants';

import * as moment from 'moment';
import { TaskGateway } from './task.gateway';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepositoryService: TaskRepositoryService,
    private readonly helpersService: HelpersService,
    private readonly taskGateway: TaskGateway,
  ) {}

  public async createTask(body: CreateTaskRequest, userId: number): Promise<GetTaskResponse> {
    const { title } = body;
    body.userId = userId;

    // Check if user already have task with an existing title
    const taskExists = await this.taskRepositoryService.findTaskByUserIdAndTitle(userId, title);
    if (taskExists) throw new ConflictException(`You already have a task with title ${title}`);

    const task = await this.taskRepositoryService.createTask(body);

    // Emit the taskCreated event when a new task is created
    this.taskGateway.handleTaskCreated(task);
    return plainToInstance(GetTaskResponse, { message: 'Task created Successfully', data: task });
  }

  public async getTask(id: number, userId: number): Promise<GetTaskResponse> {
    const task = await this.taskRepositoryService.findTaskByIdAndUserId(id, userId);

    if (!task) throw new NotFoundException(`Task with ID ${id} not found for user`);

    return plainToInstance(GetTaskResponse, { message: 'Task retrieved successfully', data: task });
  }

  public async getTasks(userId: number): Promise<GetTasksResponse> {
    const tasks = await this.taskRepositoryService.findTaskByUserId(userId);
    return plainToInstance(GetTasksResponse, { message: 'User Tasks retrieved', data: tasks });
  }

  public async updateTask(taskId: number, userId: number, body: UpdateTaskRequest): Promise<GetTaskResponse> {
    if (this.helpersService.isObjectEmpty(body)) {
      throw new BadRequestException('Body can not be empty');
    }

    const taskToUpdate = await this.taskRepositoryService.findTaskByIdAndUserId(taskId, userId);
    if (!taskToUpdate) {
      throw new NotFoundException(`Task with ID ${taskId} not found for user`);
    }

    const updatedTask = await this.taskRepositoryService.updateTask(taskToUpdate, body);

    return plainToInstance(GetTaskResponse, { message: 'Task Updated successfully', data: updatedTask });
  }

  public async changeTaskStatus(
    taskId: number,
    userId: number,
    body: ChangeTaskStatusRequest,
  ): Promise<GetTaskResponse> {
    const taskToUpdate = await this.taskRepositoryService.findTaskByIdAndUserId(taskId, userId);
    if (!taskToUpdate) {
      throw new NotFoundException(`Task with ID ${taskId} not found for user`);
    }

    if (body.status === taskToUpdate.status) {
      throw new ConflictException(`Task is already in the status ${body.status}`);
    }

    if (body.status === TaskStatusType.inProgress) {
      body.startedAt = moment().toDate();
    }

    if (body.status === TaskStatusType.completed) {
      body.completedAt = moment().toDate();
    }

    const updatedTask = await this.taskRepositoryService.updateTask(taskToUpdate, body);

    return plainToInstance(GetTaskResponse, { message: 'Task Updated successfully', data: updatedTask });
  }

  public async deleteTask(taskId: number, userId: number): Promise<GetTaskResponse> {
    const taskToDelete = await this.taskRepositoryService.findTaskByIdAndUserId(taskId, userId);
    if (!taskToDelete) {
      throw new NotFoundException(`Task with ID ${taskId} not found for user`);
    }

    const deleteSuccess = await this.taskRepositoryService.deleteTask(taskId, userId);
    if (!deleteSuccess) {
      throw new InternalServerErrorException('Unable to delete. Please try again later');
    }

    return plainToInstance(GetTaskResponse, {
      message: 'Task Deleted Successfully',
      data: {
        id: taskId,
        userId,
      },
    });
  }
}
