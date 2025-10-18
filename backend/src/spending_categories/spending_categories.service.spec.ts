import { Test, TestingModule } from '@nestjs/testing';
import { SpendingCategoriesService } from './spending_categories.service';

describe('SpendingCategoriesService', () => {
  let service: SpendingCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpendingCategoriesService],
    }).compile();

    service = module.get<SpendingCategoriesService>(SpendingCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
