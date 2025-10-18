import { IsInt, IsNotEmpty, IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTransactionDto {
	@IsInt()
	userId: number;

	@IsOptional()
	@IsInt()
	categoryId?: number;

	@IsString()
	@IsNotEmpty()
	itemPurchased: string;

	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(0)
	@Transform(({ value }) => parseFloat(value))
	cost: number;

	@IsOptional()
	@IsString()
	plaidCategory?: string;
}
