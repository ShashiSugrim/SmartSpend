// src/spending_categories/spending_categories.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpendingCategory } from './entities/spending_category.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { SpendingCategoriesService } from './spending_categories.service';
import { SpendingCategoriesController } from './spending_categories.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpendingCategory, Transaction]),
    // Avoid circular deps when UsersModule also imports this module
    forwardRef(() => UsersModule),
  ],
  controllers: [SpendingCategoriesController],
  providers: [SpendingCategoriesService],
  exports: [SpendingCategoriesService],
})
export class SpendingCategoriesModule {}
