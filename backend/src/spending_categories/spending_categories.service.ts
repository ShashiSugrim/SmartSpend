import { Injectable } from '@nestjs/common';
import { CreateSpendingCategoryDto } from './dto/create-spending_category.dto';
import { UpdateSpendingCategoryDto } from './dto/update-spending_category.dto';

@Injectable()
export class SpendingCategoriesService {
  create(createSpendingCategoryDto: CreateSpendingCategoryDto) {
    return 'This action adds a new spendingCategory';
  }

  findAll() {
    return `This action returns all spendingCategories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} spendingCategory`;
  }

  update(id: number, updateSpendingCategoryDto: UpdateSpendingCategoryDto) {
    return `This action updates a #${id} spendingCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} spendingCategory`;
  }
}
