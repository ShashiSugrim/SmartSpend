import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SpendingCategoriesService } from './spending_categories.service';
import { CreateSpendingCategoryDto } from './dto/create-spending_category.dto';
import { UpdateSpendingCategoryDto } from './dto/update-spending_category.dto';

@Controller('spending-categories')
export class SpendingCategoriesController {
  constructor(private readonly spendingCategoriesService: SpendingCategoriesService) {}

  @Post()
  create(@Body() createSpendingCategoryDto: CreateSpendingCategoryDto) {
    return this.spendingCategoriesService.create(createSpendingCategoryDto);
  }

  @Get()
  findAll() {
    return this.spendingCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.spendingCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSpendingCategoryDto: UpdateSpendingCategoryDto) {
    return this.spendingCategoriesService.update(+id, updateSpendingCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.spendingCategoriesService.remove(+id);
  }
}
