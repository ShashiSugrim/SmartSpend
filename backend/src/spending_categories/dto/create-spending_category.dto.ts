import { IsInt, IsNotEmpty, IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateSpendingCategoryDto {
	@IsInt()
	userId: number;

	@IsString()
	@IsNotEmpty()
	name: string;

	@IsOptional()
	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(0)
	@Max(100)
	@Transform(({ value }) => value === undefined || value === null ? undefined : parseFloat(value))
	totalBudgetPercent?: number;

	@IsOptional()
	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(0)
	@Transform(({ value }) => value === undefined || value === null ? undefined : parseFloat(value))
	totalBudgetNumber?: number;
}
