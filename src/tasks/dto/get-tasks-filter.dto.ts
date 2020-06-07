import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

const { DONE, IN_PROGRESS, OPEN } = TaskStatus;

export class GetTasksFilterDto {
  @IsOptional()
  @IsIn([DONE, IN_PROGRESS, OPEN])
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
