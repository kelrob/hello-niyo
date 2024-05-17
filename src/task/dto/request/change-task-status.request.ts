import { IsDate, IsEnum, IsOptional } from 'class-validator';
import { TaskStatusType } from '../../../repositories/Tasks/task.constants';

export class ChangeTaskStatusRequest {
  @IsEnum(TaskStatusType)
  status: TaskStatusType;

  @IsOptional()
  @IsDate()
  startedAt?: Date;

  @IsOptional()
  @IsDate()
  completedAt?: Date;
}
