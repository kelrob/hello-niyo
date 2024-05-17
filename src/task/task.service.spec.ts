import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { TaskRepositoryService } from '../repositories/Tasks/task-respository.service';
import { HelpersService } from '../helpers/helpers.service';
import { CreateTaskRequest } from './dto/request/create-task.request';
import { GetTaskResponse, GetTasksResponse } from './dto/response/task.response';
import { UpdateTaskRequest } from './dto/request/update-task.request';
import { ChangeTaskStatusRequest } from './dto/request/change-task-status.request';
import { TaskStatusType } from '../repositories/Tasks/task.constants';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as moment from 'moment';
import { plainToInstance } from 'class-transformer';
import { TaskGateway } from './task.gateway';

describe('TaskService', () => {
  let service: TaskService;
  let taskRepositoryService: jest.Mocked<TaskRepositoryService>;
  let helpersService: jest.Mocked<HelpersService>;

  const newTask = {
    id: 1,
    userId: 17,
    title: 'Test Task',
    description: 'This is a test description',
    status: TaskStatusType.notStarted,
    createdAt: moment('2024-05-17T08:43:53.142Z').toDate(),
    updatedAt: moment('2024-05-17T08:43:53.142Z').toDate(),
    startedAt: null,
    completedAt: null,
    deletedAt: null,
  };

  const newTaskUpdated = {
    id: 9,
    userId: 17,
    title: 'Updated Task',
    description: 'This is an updated task description',
    status: TaskStatusType.notStarted,
    createdAt: moment('2024-05-17T08:43:53.142Z').toDate(),
    updatedAt: moment('2024-05-17T08:43:53.142Z').toDate(),
    startedAt: null,
    completedAt: null,
    deletedAt: null,
  };

  const newTaskUpdatedOnStatus = {
    id: 9,
    userId: 17,
    title: 'Updated Task',
    description: 'This is an updated task description',
    status: TaskStatusType.inProgress,
    startedAt: moment().toDate(),
    createdAt: moment('2024-05-17T08:43:53.142Z').toDate(),
    updatedAt: moment('2024-05-17T08:43:53.142Z').toDate(),
    completedAt: null,
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: TaskRepositoryService,
          useValue: {
            findTaskByUserIdAndTitle: jest.fn(),
            createTask: jest.fn(),
            findTaskByIdAndUserId: jest.fn(),
            findTaskByUserId: jest.fn(),
            updateTask: jest.fn(),
            deleteTask: jest.fn(),
          },
        },
        {
          provide: HelpersService,
          useValue: {
            isObjectEmpty: jest.fn(),
          },
        },
        {
          provide: TaskGateway,
          useValue: {
            afterInit: jest.fn(),
            handleConnection: jest.fn(),
            handleDisconnect: jest.fn(),
            handleTaskCreated: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepositoryService = module.get(TaskRepositoryService);
    helpersService = module.get(HelpersService);
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const createTaskRequest: CreateTaskRequest = {
        title: 'Test Task',
        description: 'This is a test description',
      };

      const createTaskResponse: GetTaskResponse = {
        message: 'Task created Successfully',
        data: newTask,
      };

      jest.spyOn(taskRepositoryService, 'findTaskByUserIdAndTitle').mockResolvedValue(null);
      jest.spyOn(taskRepositoryService, 'createTask').mockResolvedValue(newTask);

      const result = await service.createTask(createTaskRequest, 17);

      expect(taskRepositoryService.findTaskByUserIdAndTitle).toHaveBeenCalledWith(17, 'Test Task');
      expect(taskRepositoryService.createTask).toHaveBeenCalledWith(createTaskRequest);
      expect(result).toEqual(plainToInstance(GetTaskResponse, createTaskResponse));
    });

    it('should throw ConflictException if task with title already exists', async () => {
      const createTaskRequest: CreateTaskRequest = {
        title: 'Test Task',
        description: 'This is a test task',
      };

      jest.spyOn(taskRepositoryService, 'findTaskByUserIdAndTitle').mockResolvedValue(newTask);
      await expect(service.createTask(createTaskRequest, 17)).rejects.toThrow(ConflictException);
    });
  });

  describe('getTask', () => {
    it('should get a task successfully', async () => {
      const getTaskResponse: GetTaskResponse = {
        message: 'Task retrieved successfully',
        data: newTask,
      };

      jest.spyOn(taskRepositoryService, 'findTaskByIdAndUserId').mockResolvedValue(newTask);

      const result = await service.getTask(9, 17);

      expect(taskRepositoryService.findTaskByIdAndUserId).toHaveBeenCalledWith(9, 17);
      expect(result).toEqual(plainToInstance(GetTaskResponse, getTaskResponse));
    });

    it('should throw NotFoundException if task not found', async () => {
      jest.spyOn(taskRepositoryService, 'findTaskByIdAndUserId').mockResolvedValue(null);

      await expect(service.getTask(9, 17)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTasks', () => {
    it('should get all tasks successfully', async () => {
      const getTasksResponse: GetTasksResponse = {
        message: 'User Tasks retrieved',
        data: [newTask],
      };

      jest.spyOn(taskRepositoryService, 'findTaskByUserId').mockResolvedValue([newTask]);

      const result = await service.getTasks(17);

      expect(taskRepositoryService.findTaskByUserId).toHaveBeenCalledWith(17);
      expect(result).toEqual(plainToInstance(GetTasksResponse, getTasksResponse));
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const updateTaskRequest: UpdateTaskRequest = {
        title: 'Updated Task',
        description: 'This is an updated task description',
      };

      const updatedTaskResponse: GetTaskResponse = {
        message: 'Task Updated successfully',
        data: newTaskUpdated,
      };

      jest.spyOn(helpersService, 'isObjectEmpty').mockReturnValue(false);
      jest.spyOn(taskRepositoryService, 'findTaskByIdAndUserId').mockResolvedValue(newTaskUpdated);
      jest.spyOn(taskRepositoryService, 'updateTask').mockResolvedValue(newTaskUpdated);

      const result = await service.updateTask(9, 17, updateTaskRequest);

      expect(helpersService.isObjectEmpty).toHaveBeenCalledWith(updateTaskRequest);
      expect(taskRepositoryService.findTaskByIdAndUserId).toHaveBeenCalledWith(9, 17);
      expect(taskRepositoryService.updateTask).toHaveBeenCalledWith(updatedTaskResponse.data, updateTaskRequest);
      expect(result).toEqual(plainToInstance(GetTaskResponse, updatedTaskResponse));
    });

    it('should throw BadRequestException if update body is empty', async () => {
      const updateTaskRequest: UpdateTaskRequest = {};

      jest.spyOn(helpersService, 'isObjectEmpty').mockReturnValue(true);

      await expect(service.updateTask(9, 17, updateTaskRequest)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if task not found', async () => {
      const updateTaskRequest: UpdateTaskRequest = {
        title: 'Updated Task',
        description: 'This is an updated task description',
      };

      jest.spyOn(helpersService, 'isObjectEmpty').mockReturnValue(false);
      jest.spyOn(taskRepositoryService, 'findTaskByIdAndUserId').mockResolvedValue(null);

      await expect(service.updateTask(9, 17, updateTaskRequest)).rejects.toThrow(NotFoundException);
    });
  });

  describe('changeTaskStatus', () => {
    it('should change the task status successfully', async () => {
      const changeTaskStatusRequest: ChangeTaskStatusRequest = {
        status: TaskStatusType.inProgress,
      };

      const updatedTaskResponse: GetTaskResponse = {
        message: 'Task Updated successfully',
        data: newTaskUpdatedOnStatus,
      };

      jest.spyOn(taskRepositoryService, 'findTaskByIdAndUserId').mockResolvedValue(newTask);
      jest.spyOn(taskRepositoryService, 'updateTask').mockResolvedValue(newTaskUpdatedOnStatus);

      const result = await service.changeTaskStatus(9, 17, changeTaskStatusRequest);

      expect(taskRepositoryService.findTaskByIdAndUserId).toHaveBeenCalledWith(9, 17);
      expect(taskRepositoryService.updateTask).toHaveBeenCalledWith(newTask, changeTaskStatusRequest);
      expect(result).toEqual(plainToInstance(GetTaskResponse, updatedTaskResponse));
    });

    it('should throw ConflictException if task is already in the status', async () => {
      const changeTaskStatusRequest: ChangeTaskStatusRequest = {
        status: TaskStatusType.inProgress,
      };

      jest.spyOn(taskRepositoryService, 'findTaskByIdAndUserId').mockResolvedValue(newTaskUpdatedOnStatus);

      await expect(service.changeTaskStatus(9, 17, changeTaskStatusRequest)).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if task not found', async () => {
      const changeTaskStatusRequest: ChangeTaskStatusRequest = {
        status: TaskStatusType.inProgress,
      };

      jest.spyOn(taskRepositoryService, 'findTaskByIdAndUserId').mockResolvedValue(null);

      await expect(service.changeTaskStatus(9, 17, changeTaskStatusRequest)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      jest.spyOn(taskRepositoryService, 'findTaskByIdAndUserId').mockResolvedValue(newTask);
      jest.spyOn(taskRepositoryService, 'deleteTask').mockResolvedValue(true);

      const result = await service.deleteTask(9, 17);

      expect(taskRepositoryService.findTaskByIdAndUserId).toHaveBeenCalledWith(9, 17);
      expect(taskRepositoryService.deleteTask).toHaveBeenCalledWith(9, 17);
      expect(result).toEqual(
        plainToInstance(GetTaskResponse, {
          message: 'Task Deleted Successfully',
          data: {
            id: 9,
            userId: 17,
          },
        }),
      );
    });

    it('should throw NotFoundException if task not found', async () => {
      taskRepositoryService.findTaskByIdAndUserId.mockResolvedValue(null);

      await expect(service.deleteTask(9, 17)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException if unable to delete task', async () => {
      jest.spyOn(taskRepositoryService, 'findTaskByIdAndUserId').mockResolvedValue(newTask);
      jest.spyOn(taskRepositoryService, 'deleteTask').mockResolvedValue(false);

      await expect(service.deleteTask(9, 17)).rejects.toThrow(InternalServerErrorException);
    });
  });
});
