import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSpendingCategoryDto } from './dto/create-spending_category.dto';
import { UpdateSpendingCategoryDto } from './dto/update-spending_category.dto';
import { SpendingCategory } from './entities/spending_category.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class SpendingCategoriesService {
  constructor(
    @InjectRepository(SpendingCategory)
    private readonly categoryRepository: Repository<SpendingCategory>,
    private readonly usersService: UsersService,
  ) {}

  async create(createSpendingCategoryDto: CreateSpendingCategoryDto): Promise<SpendingCategory> {
    const { userId, name, totalBudgetPercent, totalBudgetNumber } = createSpendingCategoryDto;

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
    return this.categoryRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<SpendingCategory> {
    const category = await this.categoryRepository.findOne({ where: { categoryId: id }, relations: ['user'] });
    if (!category) {
      throw new NotFoundException(`Spending category with id ${id} not found`);
    }
    return category;
  }

  async update(id: number, updateSpendingCategoryDto: UpdateSpendingCategoryDto): Promise<SpendingCategory> {
    const category = await this.findOne(id);

    if (updateSpendingCategoryDto.userId && updateSpendingCategoryDto.userId !== category.user.userId) {
      // Ensure new user exists
      try {
        await this.usersService.findOne(updateSpendingCategoryDto.userId);
      } catch (e) {
        throw new BadRequestException('User does not exist');
      }
      category.user = { userId: updateSpendingCategoryDto.userId } as any;
    }

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
