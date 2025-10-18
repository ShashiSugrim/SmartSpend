import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction } from './entities/transaction.entity';
import { UsersModule } from '../users/users.module';
import { SpendingCategoriesModule } from '../spending_categories/spending_categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), UsersModule, SpendingCategoriesModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
