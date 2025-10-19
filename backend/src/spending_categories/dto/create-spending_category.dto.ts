import { IsNotEmpty, IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

function moneyToNumber(v: any) {
  if (v === null || v === undefined || v === '') return undefined;
  const cleaned = String(v).replace(/[^0-9.\-]/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : undefined;
}

export class CreateSpendingCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @Transform(({ value }) => moneyToNumber(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  totalBudgetPercent?: number;

  @IsOptional()
  @Transform(({ value }) => moneyToNumber(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalBudgetNumber?: number;
}
