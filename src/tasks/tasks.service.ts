import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto);
  }

  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
    if (!found) throw new NotFoundException(`Task with ID: '${id}' not found`);
    return found;
  }

  async deleteTask(id: number): Promise<{ message: string }> {
    const result = await this.taskRepository.delete(id);
    if (!result.affected) throw new NotFoundException(`Task with ID: '${id}' not found`);
    return { message: `Task with ID: ${id} deleted` };
  }
  async updateTaskStatus(args: { id: number; status: TaskStatus }): Promise<Task> {
    const { id, status } = args;
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();

    return task;
  }
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }
}
