// src/users/users.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SpendingCategoriesModule } from '../spending_categories/spending_categories.module';
import { SpendingCategory } from '../spending_categories/entities/spending_category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, SpendingCategory]),
    forwardRef(() => SpendingCategoriesModule), // needed for signup-seed flow
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
