import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { CreateSpendingCategoryDto } from './dto/create-spending_category.dto';
import { UpdateSpendingCategoryDto } from './dto/update-spending_category.dto';
import { SpendingCategory } from './entities/spending_category.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SpendingCategoriesService {
  constructor(
    @InjectRepository(SpendingCategory)
    private readonly categoryRepository: Repository<SpendingCategory>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(createSpendingCategoryDto: CreateSpendingCategoryDto): Promise<SpendingCategory> {
    // HACKATHON MODE: Use a default user ID (1) for all categories
    const defaultUserId = 1;

    const category = new SpendingCategory();
    category.user = { userId: defaultUserId } as User;
    category.name = createSpendingCategoryDto.name;
    category.totalBudgetPercent = createSpendingCategoryDto.totalBudgetPercent ?? undefined;
    category.totalBudgetNumber = createSpendingCategoryDto.totalBudgetNumber ?? undefined;

    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<any[]> {
    // HACKATHON MODE: Return all categories for default user (1)
    const defaultUserId = 1;
    const categories = await this.categoryRepository.find({ 
      where: { user: { userId: defaultUserId } },
      relations: ['user'] 
    });

    // For each category, calculate the current_total from transactions
    const categoriesWithTotals = await Promise.all(
      categories.map(async (category) => {
        const currentTotal = await this.calculateCategoryTotal(category.categoryId, defaultUserId);
        return {
          ...category,
          current_total: currentTotal,
        };
      })
    );

    return categoriesWithTotals;
  }

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
    const defaultUserId = 1;
    const category = await this.categoryRepository.findOne({ 
      where: { categoryId: id, user: { userId: defaultUserId } }, 
      relations: ['user'] 
    });
    if (!category) {
      throw new NotFoundException(`Spending category with id ${id} not found`);
    }
    return category;
  }

  async update(id: number, updateSpendingCategoryDto: UpdateSpendingCategoryDto): Promise<SpendingCategory> {
    const category = await this.findOne(id);

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