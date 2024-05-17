import { IsOptional, IsString } from 'class-validator';

export class UpdateTaskRequest {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
