import { Module } from '@nestjs/common';
import { SpendingCategoriesService } from './spending_categories.service';
import { SpendingCategoriesController } from './spending_categories.controller';

@Module({
  controllers: [SpendingCategoriesController],
  providers: [SpendingCategoriesService],
})
export class SpendingCategoriesModule {}
