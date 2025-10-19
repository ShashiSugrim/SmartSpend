import { Injectable, NotFoundException, BadRequestException, Inject, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { UsersService } from '../users/users.service';
import { SpendingCategoriesService } from '../spending_categories/spending_categories.service';
import { REQUEST } from '@nestjs/core';
import type { UserRequest } from '../common/middleware/auth.middleware';

@Injectable({ scope: Scope.REQUEST })
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly usersService: UsersService,
    private readonly categoriesService: SpendingCategoriesService,
    @Inject(REQUEST) private readonly request: UserRequest,
  ) {}

  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const userId = this.request.user_id; // Get userId from request
    const { categoryId, itemPurchased, cost, plaidCategory } = createTransactionDto;

    // Ensure user exists
    try {
      await this.usersService.findOne(userId);
    } catch (e) {
      throw new BadRequestException('User does not exist');
    }

    let category: any = undefined;
    if (categoryId) {
      try {
        category = await this.categoriesService.findOne(categoryId);
      } catch (e) {
        throw new BadRequestException('Category does not exist');
      }
    }

    const tx = this.transactionRepository.create({
      user: { userId } as any,
      category: category ? ({ categoryId: category.categoryId } as any) : undefined,
      itemPurchased,
      cost,
      plaidCategory,
    });

    return this.transactionRepository.save(tx);
  }

  async findAll(): Promise<Transaction[]> {
    const user_id = this.request.user_id;
    return this.transactionRepository.find({ 
      where: { user: { userId: user_id } },
      relations: ['user', 'category'] 
    });
  }

  async findOne(id: number): Promise<Transaction> {
    const user_id = this.request.user_id;
    const tx = await this.transactionRepository.findOne({ 
      where: { transactionId: id, user: { userId: user_id } }, 
      relations: ['user', 'category'] 
    });
    if (!tx) throw new NotFoundException(`Transaction with id ${id} not found or you don't have access to it`);
    return tx;
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    const tx = await this.findOne(id); // findOne already checks user ownership

    if (updateTransactionDto.categoryId !== undefined) {
      if (updateTransactionDto.categoryId === null) {
        tx.category = null;
      } else {
        try {
          const found = await this.categoriesService.findOne(updateTransactionDto.categoryId);
          tx.category = { categoryId: found.categoryId } as any;
        } catch (e) {
          throw new BadRequestException('Category does not exist');
        }
      }
    }

    if (updateTransactionDto.itemPurchased !== undefined) tx.itemPurchased = updateTransactionDto.itemPurchased;
    if (updateTransactionDto.cost !== undefined) tx.cost = updateTransactionDto.cost;
    if (updateTransactionDto.plaidCategory !== undefined) tx.plaidCategory = updateTransactionDto.plaidCategory;

    await this.transactionRepository.save(tx);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const tx = await this.findOne(id);
    await this.transactionRepository.remove(tx);
  }
}
