import { Test, TestingModule } from '@nestjs/testing';
import { TaskGateway } from './task.gateway';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { TaskResponse } from './dto/response/task.response';
import { TaskStatusType } from '../repositories/Tasks/task.constants';
import * as moment from 'moment';

describe('TaskGateway', () => {
  let gateway: TaskGateway;
  let serverMock: Partial<Server>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskGateway,
        {
          provide: 'Logger',
          useClass: Logger,
        },
      ],
    }).compile();

    gateway = module.get<TaskGateway>(TaskGateway);
    serverMock = {
      emit: jest.fn(),
    };
    gateway.io = serverMock as Server;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should emit taskCreated event', () => {
    const task: TaskResponse = {
      completedAt: null,
      createdAt: moment().toDate(),
      description: 'Description 1',
      id: 1,
      startedAt: null,
      status: TaskStatusType.notStarted,
      title: 'Task 1',
      updatedAt: moment().toDate(),
      userId: 0,
    };
    gateway.handleTaskCreated(task);
    expect(serverMock.emit).toHaveBeenCalledWith('taskCreated', task);
  });
});
