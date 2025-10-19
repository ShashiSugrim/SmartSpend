import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transaction.entity';
import { UsersModule } from '../users/users.module';
import { SpendingCategoriesModule } from '../spending_categories/spending_categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    UsersModule,                    // <-- gives you UsersService
    SpendingCategoriesModule,       // only if TransactionsService injects SpendingCategoriesService
  ],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
