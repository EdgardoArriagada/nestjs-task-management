import { PipeTransform, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../task.model';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];
  transform(value: any) {
    const upperCaseValue = value?.toUpperCase?.();

    if (!this.isStatusValid(upperCaseValue))
      throw new BadRequestException(`'${value}' is not a valid status`);

    return upperCaseValue;
  }

  private isStatusValid = (status: any): boolean =>
    this.allowedStatuses.indexOf(status) !== -1;
}
