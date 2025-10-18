import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpendingCategoriesService } from './spending_categories.service';
import { SpendingCategoriesController } from './spending_categories.controller';
import { SpendingCategory } from './entities/spending_category.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([SpendingCategory]), UsersModule],
  controllers: [SpendingCategoriesController],
  providers: [SpendingCategoriesService],
  exports: [SpendingCategoriesService],
})
export class SpendingCategoriesModule {}
