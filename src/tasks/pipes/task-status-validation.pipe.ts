import { PipeTransform, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

const { OPEN, IN_PROGRESS, DONE } = TaskStatus;

// Pipes works for single Body(x) or Pipe(x) arg
export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [OPEN, IN_PROGRESS, DONE];

  transform(value: any) {
    const upperCaseValue = value?.toUpperCase?.();

    if (!this.isStatusValid(upperCaseValue))
      throw new BadRequestException(`'${value}' is not a valid status`);

    return upperCaseValue;
  }

  private isStatusValid = (status: any): boolean => this.allowedStatuses.indexOf(status) !== -1;
}
