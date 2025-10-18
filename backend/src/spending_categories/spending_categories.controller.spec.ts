import { Test, TestingModule } from '@nestjs/testing';
import { SpendingCategoriesController } from './spending_categories.controller';
import { SpendingCategoriesService } from './spending_categories.service';

describe('SpendingCategoriesController', () => {
  let controller: SpendingCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpendingCategoriesController],
      providers: [SpendingCategoriesService],
    }).compile();

    controller = module.get<SpendingCategoriesController>(SpendingCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
