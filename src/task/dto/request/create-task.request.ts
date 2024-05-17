import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { TaskStatusType } from '../../../repositories/Tasks/task.constants';

export class CreateTaskRequest {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsEnum(TaskStatusType)
  status?: TaskStatusType = TaskStatusType.notStarted;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}
