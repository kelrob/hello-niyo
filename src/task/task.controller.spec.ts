import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateTaskRequest } from './dto/request/create-task.request';
import { GetTaskResponse, GetTasksResponse } from './dto/response/task.response';
import { TaskStatusType } from '../repositories/Tasks/task.constants';

import * as moment from 'moment';
import { UpdateTaskRequest } from './dto/request/update-task.request';
import { ChangeTaskStatusRequest } from './dto/request/change-task-status.request';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  const createTaskRequest: CreateTaskRequest = {
    title: 'Test Task',
    description: 'This is a test task',
  };

  const createTaskResponse: GetTaskResponse = {
    message: 'Task created Successfully',
    data: {
      id: 1,
      userId: 17,
      title: 'Task One',
      description: 'This one has a description',
      status: TaskStatusType.notStarted,
      createdAt: moment('2024-05-17T08:43:53.142Z').toDate(),
      updatedAt: moment('2024-05-17T08:43:53.142Z').toDate(),
      startedAt: null,
      completedAt: null,
    },
  };

  const getTaskResponse: GetTaskResponse = {
    message: 'Task retrieved successfully',
    data: {
      id: 9,
      userId: 17,
      title: 'Task One',
      description: 'This one has a description',
      status: TaskStatusType.notStarted,
      createdAt: moment('2024-05-17T08:43:53.142Z').toDate(),
      updatedAt: moment('2024-05-17T08:43:53.142Z').toDate(),
      startedAt: null,
      completedAt: null,
    },
  };

  const getTasksResponse: GetTasksResponse = {
    message: 'User Tasks retrieved',
    data: [
      {
        id: 9,
        userId: 17,
        title: 'This title is now updated',
        description: 'This description is also now updated',
        status: TaskStatusType.notStarted,
        createdAt: moment('2024-05-17T08:43:53.142Z').toDate(),
        updatedAt: moment('2024-05-17T08:43:53.142Z').toDate(),
        startedAt: null,
        completedAt: null,
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: {
            createTask: jest.fn(),
            getTask: jest.fn(),
            getTasks: jest.fn(),
            updateTask: jest.fn(),
            changeTaskStatus: jest.fn(),
            deleteTask: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  describe('createTask', () => {
    it('should call taskService.createTask with the correct body and user id', async () => {
      const userId = 1;

      jest.spyOn(service, 'createTask').mockResolvedValue(createTaskResponse);

      const result = await controller.createTask(createTaskRequest, { user: { id: userId } });

      expect(service.createTask).toHaveBeenCalledWith(createTaskRequest, userId);
      expect(result).toEqual(createTaskResponse);
    });
  });

  describe('getTask', () => {
    it('should call taskService.getTask with the correct parameter', async () => {
      const userId = 1;
      const id = 1;

      jest.spyOn(service, 'getTask').mockResolvedValue(getTaskResponse);

      const result = await controller.getTask(id, { user: { id: userId } });

      expect(service.getTask).toHaveBeenCalledWith(id, userId);
      expect(result).toEqual(getTaskResponse);
    });
  });

  describe('getTasks', () => {
    it('should call taskService.getTasks with the correct user id', async () => {
      const userId = 1;

      jest.spyOn(service, 'getTasks').mockResolvedValue(getTasksResponse);

      const result = await controller.getTasks({ user: { id: userId } });

      expect(service.getTasks).toHaveBeenCalledWith(userId);
      expect(result).toEqual(getTasksResponse);
    });
  });

  describe('updateTask', () => {
    it('should call taskService.updateTask with the correct parameters', async () => {
      const userId = 1;
      const taskId = 1;
      const updateTaskRequest: UpdateTaskRequest = {
        title: 'Updated Task',
        description: 'This is an updated test task',
      };
      const updateTaskResponse: GetTaskResponse = {
        message: 'Task updated successfully',
        data: {
          ...getTaskResponse.data,
          ...updateTaskRequest,
        },
      };

      jest.spyOn(service, 'updateTask').mockResolvedValue(updateTaskResponse);

      const result = await controller.updateTask(updateTaskRequest, taskId, { user: { id: userId } });

      expect(service.updateTask).toHaveBeenCalledWith(taskId, userId, updateTaskRequest);
      expect(result).toEqual(updateTaskResponse);
    });

    describe('changeStatus', () => {
      it('should call taskService.changeTaskStatus with the correct parameters', async () => {
        const userId = 1;
        const taskId = 1;
        const changeTaskStatusRequest: ChangeTaskStatusRequest = {
          status: TaskStatusType.inProgress,
        };
        const changeStatusResponse: GetTaskResponse = {
          message: 'Task status updated successfully',
          data: {
            ...getTaskResponse.data,
            status: TaskStatusType.inProgress,
          },
        };

        jest.spyOn(service, 'changeTaskStatus').mockResolvedValue(changeStatusResponse);

        const result = await controller.changeStatus(changeTaskStatusRequest, taskId, { user: { id: userId } });

        expect(service.changeTaskStatus).toHaveBeenCalledWith(taskId, userId, changeTaskStatusRequest);
        expect(result).toEqual(changeStatusResponse);
      });
    });

    describe('deleteTask', () => {
      it('should call taskService.deleteTask with the correct parameters', async () => {
        const userId = 1;
        const taskId = 1;
        const deleteTaskResponse: GetTaskResponse = {
          message: 'Task deleted successfully',
          data: getTaskResponse.data,
        };

        jest.spyOn(service, 'deleteTask').mockResolvedValue(deleteTaskResponse);

        const result = await controller.deleteTask(taskId, { user: { id: userId } });

        expect(service.deleteTask).toHaveBeenCalledWith(taskId, userId);
        expect(result).toEqual(deleteTaskResponse);
      });
    });
  });
});
