import { Exclude, Expose, Type } from 'class-transformer';
import { TaskStatusType } from '../../../repositories/Tasks/task.constants';

@Exclude()
export class TaskResponse {
  @Expose()
  id: number;

  @Expose()
  userId: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  status: TaskStatusType;

  @Expose()
  startedAt: Date;

  @Expose()
  completedAt: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

@Exclude()
export class GetTaskResponse {
  @Expose()
  message: string;

  @Expose()
  @Type(() => TaskResponse)
  data: TaskResponse;
}

export class GetTasksResponse {
  @Expose()
  message: string;

  @Expose()
  @Type(() => TaskResponse)
  data: TaskResponse[];
}
