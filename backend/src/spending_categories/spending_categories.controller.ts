import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { SpendingCategoriesService } from './spending_categories.service';
import { CreateSpendingCategoryDto } from './dto/create-spending_category.dto';
import { UpdateSpendingCategoryDto } from './dto/update-spending_category.dto';

@Controller('spending-categories')
export class SpendingCategoriesController {
  constructor(private readonly spendingCategoriesService: SpendingCategoriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body(ValidationPipe) createSpendingCategoryDto: CreateSpendingCategoryDto) {
    return this.spendingCategoriesService.create(createSpendingCategoryDto);
  }

  @Get()
  findAll() {
    return this.spendingCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.spendingCategoriesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updateSpendingCategoryDto: UpdateSpendingCategoryDto) {
    return this.spendingCategoriesService.update(id, updateSpendingCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.spendingCategoriesService.remove(id);
  }
}
