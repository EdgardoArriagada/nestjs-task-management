import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters({ status, search }: GetTasksFilterDto): Task[] {
    const tasks = this.getAllTasks()
      .filter(task => task.status === status)
      .filter(
        task =>
          task.title.includes(search) || task.description.includes(search),
      );

    return tasks;
  }

  getTaskById(id: string): Task {
    const found = this.tasks.find(task => task.id === id);

    if (!found) throw new NotFoundException(`Task with ID: '${id}' not found`);

    return found;
  }

  deleteTask(id: string): string {
    this.tasks = this.tasks.filter(task => task.id !== id);
    return 'task deleted!';
  }

  updateTaskStatus(args: { id: string; status: TaskStatus }): Task {
    const { id, status } = args;

    const task = this.getTaskById(id);
    task.status = status;

    return task;
  }

  createTask({ title, description }: CreateTaskDto): Task {
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }
}
