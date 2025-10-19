import { Injectable, NotFoundException, BadRequestException, Inject, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSpendingCategoryDto } from './dto/create-spending_category.dto';
import { UpdateSpendingCategoryDto } from './dto/update-spending_category.dto';
import { SpendingCategory } from './entities/spending_category.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { UsersService } from '../users/users.service';
import { REQUEST } from '@nestjs/core';
import type { UserRequest } from '../common/middleware/auth.middleware';

@Injectable({ scope: Scope.REQUEST })
export class SpendingCategoriesService {
  constructor(
    @InjectRepository(SpendingCategory)
    private readonly categoryRepository: Repository<SpendingCategory>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly usersService: UsersService,
    @Inject(REQUEST) private readonly request: UserRequest,
  ) {}

  async create(createSpendingCategoryDto: CreateSpendingCategoryDto): Promise<SpendingCategory> {
    const userId = this.request.user_id; // Get userId from request
    const { name, totalBudgetPercent, totalBudgetNumber } = createSpendingCategoryDto;

    // Ensure user exists
    try {
      await this.usersService.findOne(userId);
    } catch (e) {
      throw new BadRequestException('User does not exist');
    }

    const category = this.categoryRepository.create({
      user: { userId } as any,
      name,
      totalBudgetPercent,
      totalBudgetNumber,
    });

    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<any[]> {
    const user_id = this.request.user_id;
    const categories = await this.categoryRepository.find({ 
      where: { user: { userId: user_id } },
      relations: ['user'] 
    });

    // For each category, calculate the current_total from transactions
    const categoriesWithTotals = await Promise.all(
      categories.map(async (category) => {
        const currentTotal = await this.calculateCategoryTotal(category.categoryId, user_id);
        return {
          ...category,
          current_total: currentTotal,
        };
      })
    );

    return categoriesWithTotals;
  }

  /**
   * Get all transactions for a specific category and user
   */
  async getAllTransactionsByCategory(categoryId: number): Promise<Transaction[]> {
    const user_id = this.request.user_id;
    return this.transactionRepository.find({
      where: {
        category: { categoryId },
        user: { userId: user_id },
      },
    });
  }

  /**
   * Calculate the total amount spent on a category
   */
  private async calculateCategoryTotal(categoryId: number, userId: number): Promise<number> {
    const transactions = await this.transactionRepository.find({
      where: {
        category: { categoryId },
        user: { userId },
      },
    });

    // Sum up all the costs
    const total = transactions.reduce((sum, transaction) => {
      return sum + Number(transaction.cost);
    }, 0);

    // Round to 2 decimal places
    return Math.round(total * 100) / 100;
  }

  async findOne(id: number): Promise<SpendingCategory> {
    const user_id = this.request.user_id;
    const category = await this.categoryRepository.findOne({ 
      where: { categoryId: id, user: { userId: user_id } }, 
      relations: ['user'] 
    });
    if (!category) {
      throw new NotFoundException(`Spending category with id ${id} not found or you don't have access to it`);
    }
    return category;
  }

  async update(id: number, updateSpendingCategoryDto: UpdateSpendingCategoryDto): Promise<SpendingCategory> {
    const category = await this.findOne(id); // findOne already checks user ownership

    if (updateSpendingCategoryDto.name !== undefined) category.name = updateSpendingCategoryDto.name;
    if (updateSpendingCategoryDto.totalBudgetPercent !== undefined) category.totalBudgetPercent = updateSpendingCategoryDto.totalBudgetPercent;
    if (updateSpendingCategoryDto.totalBudgetNumber !== undefined) category.totalBudgetNumber = updateSpendingCategoryDto.totalBudgetNumber;

    await this.categoryRepository.save(category);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }
}
