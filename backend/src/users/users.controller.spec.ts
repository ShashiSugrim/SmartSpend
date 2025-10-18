import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const expectedUsers: User[] = [
        {
          userId: 1,
          email: 'test@example.com',
          name: 'Test User',
          password: 'hashedPassword',
          income: 50000,
          totalBudget: 3000,
          currentTotal: 1500,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockUsersService.findAll.mockResolvedValue(expectedUsers);

      const result = await controller.findAll();

      expect(result).toEqual(expectedUsers);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const expectedUser: User = {
        userId: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
        income: 50000,
        totalBudget: 3000,
        currentTotal: 1500,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.findOne.mockResolvedValue(expectedUser);

      const result = await controller.findOne(1);

      expect(result).toEqual(expectedUser);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });
});
