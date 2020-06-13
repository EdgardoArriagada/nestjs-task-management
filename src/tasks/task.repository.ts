import { Task } from './task.entity';
import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');
  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.where('task.status = :status', { status });
    }

    if (search) {
      query.orWhere('task.title LIKE :search or task.description LIKE :search ', { search: `%${search}%` });
    }

    const tasks = await this.getManyTasks(query, user.username, filterDto);
    return tasks;
  }

  async createTask({ title, description }: CreateTaskDto, user: User): Promise<Task> {
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;

    await task.save();

    delete task.user;

    return task;
  }

  private async getManyTasks(
    query: SelectQueryBuilder<Task>,
    username: string,
    dto: GetTasksFilterDto,
  ): Promise<Task[]> {
    try {
      return await query.getMany();
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${username}", Filters: "${JSON.stringify(dto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
