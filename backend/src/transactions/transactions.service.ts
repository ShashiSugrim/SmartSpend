import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { User } from '../users/entities/user.entity';
import { SpendingCategory } from '../spending_categories/entities/spending_category.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    // HACKATHON MODE: Use a default user ID (1) for all transactions
    const defaultUserId = 1;
    const { categoryId, itemPurchased, cost, plaidCategory } = createTransactionDto;

    const transaction = new Transaction();
    transaction.user = { userId: defaultUserId } as User;
    transaction.category = { categoryId } as SpendingCategory;
    transaction.itemPurchased = itemPurchased;
    transaction.cost = cost;
    transaction.plaidCategory = plaidCategory;

    return this.transactionRepository.save(transaction);
  }

  async findAll(): Promise<Transaction[]> {
    // HACKATHON MODE: Return all transactions for default user (1)
    const defaultUserId = 1;
    return this.transactionRepository.find({
      where: { user: { userId: defaultUserId } },
      relations: ['category', 'user'],
    });
  }

  async findOne(id: number): Promise<Transaction> {
    const defaultUserId = 1;
    const transaction = await this.transactionRepository.findOne({
      where: { transactionId: id, user: { userId: defaultUserId } },
      relations: ['category', 'user'],
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
    return transaction;
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    const transaction = await this.findOne(id);

    if (updateTransactionDto.categoryId !== undefined) {
      transaction.category = { categoryId: updateTransactionDto.categoryId } as SpendingCategory;
    }
    if (updateTransactionDto.itemPurchased !== undefined) {
      transaction.itemPurchased = updateTransactionDto.itemPurchased;
    }
    if (updateTransactionDto.cost !== undefined) {
      transaction.cost = updateTransactionDto.cost;
    }
    if (updateTransactionDto.plaidCategory !== undefined) {
      transaction.plaidCategory = updateTransactionDto.plaidCategory;
    }

    await this.transactionRepository.save(transaction);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const transaction = await this.findOne(id);
    await this.transactionRepository.remove(transaction);
  }
}