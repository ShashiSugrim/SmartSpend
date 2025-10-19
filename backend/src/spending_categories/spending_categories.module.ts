import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpendingCategoriesService } from './spending_categories.service';
import { SpendingCategoriesController } from './spending_categories.controller';
import { SpendingCategory } from './entities/spending_category.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([SpendingCategory, Transaction]), UsersModule],
  controllers: [SpendingCategoriesController],
  providers: [
    {
      provide: SpendingCategoriesService,
      useClass: SpendingCategoriesService,
      scope: 2, // REQUEST scope
    },
  ],
  exports: [SpendingCategoriesService],
})
export class SpendingCategoriesModule {}
