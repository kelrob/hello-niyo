import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TaskStatusType } from '../task.constants';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: TaskStatusType })
  status: TaskStatusType;

  @Column({ name: 'started_at' })
  startedAt: Date;

  @Column({ name: 'completed_at' })
  completedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
