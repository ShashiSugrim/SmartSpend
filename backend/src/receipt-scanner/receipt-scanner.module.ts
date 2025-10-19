import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceiptScannerController } from './receipt-scanner.controller';
import { ReceiptScannerService } from './receipt-scanner.service';
import { SpendingCategory } from '../spending_categories/entities/spending_category.entity';
import { Transaction } from '../transactions/entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpendingCategory, Transaction])
  ],
  controllers: [ReceiptScannerController],
  providers: [ReceiptScannerService],
  exports: [ReceiptScannerService],
})
export class ReceiptScannerModule {}
