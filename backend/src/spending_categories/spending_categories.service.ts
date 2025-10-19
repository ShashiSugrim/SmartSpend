import { Injectable, NotFoundException, BadRequestException, Inject, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSpendingCategoryDto } from './dto/create-spending_category.dto';
import { UpdateSpendingCategoryDto } from './dto/update-spending_category.dto';
import { SpendingCategory } from './entities/spending_category.entity';
import { UsersService } from '../users/users.service';
import { REQUEST } from '@nestjs/core';
import type { UserRequest } from '../common/middleware/auth.middleware';

@Injectable({ scope: Scope.REQUEST })
export class SpendingCategoriesService {
  constructor(
    @InjectRepository(SpendingCategory)
    private readonly categoryRepository: Repository<SpendingCategory>,
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

  async findAll(): Promise<SpendingCategory[]> {
    const user_id = this.request.user_id;
    return this.categoryRepository.find({ 
      where: { user: { userId: user_id } },
      relations: ['user'] 
    });
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
