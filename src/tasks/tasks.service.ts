import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';
import isNonemptyArray from 'src/helpers/isNonemptyArray/isNonemptyArray';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const tasks = await this.taskRepository.getTasks(filterDto, user);

    if (!isNonemptyArray(tasks)) throw new NotFoundException("User doesn't register tasks");

    return tasks;
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id, userId: user.id } });
    if (!found) throw new NotFoundException(`Task with ID: '${id}' not found`);
    return found;
  }

  async deleteTask(id: number, user: User): Promise<{ message: string }> {
    const result = await this.taskRepository.delete({ id, userId: user.id });
    if (!result.affected) throw new NotFoundException(`Task with ID: '${id}' not found`);
    return { message: `Task with ID: ${id} deleted` };
  }

  async updateTaskStatus(args: { id: number; status: TaskStatus; user: User }): Promise<Task> {
    const { id, status, user } = args;
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }
}
