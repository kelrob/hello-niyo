import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TaskService } from './task.service';
import { CreateTaskRequest } from './dto/request/create-task.request';
import { GetTaskResponse, GetTasksResponse } from './dto/response/task.response';
import { UpdateTaskRequest } from './dto/request/update-task.request';
import { ChangeTaskStatusRequest } from './dto/request/change-task-status.request';

@Controller('task')
@UseGuards(AuthGuard('jwt'))
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  public async createTask(@Body() body: CreateTaskRequest, @Request() req): Promise<GetTaskResponse> {
    return this.taskService.createTask(body, req.user.id);
  }

  @Get(':id')
  public async getTask(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<GetTaskResponse> {
    return this.taskService.getTask(id, req.user.id);
  }

  @Get()
  public async getTasks(@Request() req): Promise<GetTasksResponse> {
    return this.taskService.getTasks(req.user.id);
  }

  @Patch(':id')
  public async updateTask(
    @Body() body: UpdateTaskRequest,
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<GetTaskResponse> {
    return this.taskService.updateTask(id, req.user.id, body);
  }

  @Patch(':id/status/update')
  public async changeStatus(
    @Body() body: ChangeTaskStatusRequest,
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<GetTaskResponse> {
    return this.taskService.changeTaskStatus(id, req.user.id, body);
  }

  @Delete(':id')
  public async deleteTask(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<GetTaskResponse> {
    return this.taskService.deleteTask(id, req.user.id);
  }
}
