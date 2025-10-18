import { PartialType } from '@nestjs/mapped-types';
import { CreateSpendingCategoryDto } from './create-spending_category.dto';

export class UpdateSpendingCategoryDto extends PartialType(CreateSpendingCategoryDto) {}
