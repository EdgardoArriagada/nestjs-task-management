import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';

const mockUser = { username: 'Test User' };

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
});

describe('TaskService', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TaskRepository,
          useFactory: mockTaskRepository,
        },
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('throw error when repository is empty', async () => {
      expect.assertions(3);

      expect(await taskRepository.getTasks).not.toHaveBeenCalled();

      const filters: GetTasksFilterDto = { status: TaskStatus.IN_PROGRESS, search: 'Some search query' };

      // less strict way
      // await expect(tasksService.getTasks(filters, mockUser)).rejects.toThrow();

      await expect(tasksService.getTasks(filters, mockUser)).rejects.toEqual(
        new Error("User doesn't register tasks"),
      );

      expect(await taskRepository.getTasks).toHaveBeenCalled();
    });
    it('get a task', async () => {
      expect.assertions(1);

      const someNonemptyArray = [1, 2, 3];
      taskRepository.getTasks.mockResolvedValue(someNonemptyArray);

      const filters: GetTasksFilterDto = { status: TaskStatus.IN_PROGRESS, search: 'Some search query' };

      const result = await tasksService.getTasks(filters, mockUser);
      expect(result).toEqual(someNonemptyArray);
    });
  });
});
