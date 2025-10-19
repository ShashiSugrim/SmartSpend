import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpendingCategory } from '../spending_categories/entities/spending_category.entity';

type SafeUser = Omit<User, 'password'>;

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(SpendingCategory)
    private readonly categoryRepository: Repository<SpendingCategory>,
  ) {}

  // SIGN UP (public) - returns SafeUser only
  @Post()
  create(@Body() body: CreateUserDto): Promise<SafeUser> {
    return this.usersService.create(body);
  }

  // SIGN UP + SEED CATEGORIES (public) - returns token + SafeUser
  @Post('signup-seed')
  async signupAndSeed(
    @Body()
    body: {
      user: CreateUserDto;
      categories: Array<{
        name: string;
        totalBudgetNumber?: any;   // can be "$ 233" – your DTO transform will clean
        totalBudgetPercent?: any;  // idem
      }>;
    },
  ): Promise<{ access_token: string; user: SafeUser }> {
    // 1) Create user
    const user = await this.usersService.create(body.user);

    // 2) Sign token
    const access_token = jwt.sign(
      { sub: user.userId, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' },
    );

    // 3) Seed categories for this user
    if (body.categories && body.categories.length > 0) {
      const categories = body.categories.map((c) => {
        const category = new SpendingCategory();
        category.user = { userId: user.userId } as User;
        category.name = c.name;
        
        // Transform string values to numbers
        if (c.totalBudgetNumber) {
          const cleaned = String(c.totalBudgetNumber).replace(/[^0-9.\-]/g, '');
          const num = Number(cleaned);
          category.totalBudgetNumber = Number.isFinite(num) ? num : undefined;
        }
        
        if (c.totalBudgetPercent) {
          const cleaned = String(c.totalBudgetPercent).replace(/[^0-9.\-]/g, '');
          const num = Number(cleaned);
          category.totalBudgetPercent = Number.isFinite(num) ? num : undefined;
        }
        
        return category;
      });
      
      await this.categoryRepository.save(categories);
    }

    // 4) Return token + user
    return { access_token, user };
  }

  // LOGIN (public)
  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
  ): Promise<{ access_token: string; user: SafeUser }> {
    const user = await this.usersService.validatePassword(
      body.email,
      body.password,
    );
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const access_token = jwt.sign(
      { sub: user.userId, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' },
    );

    return { access_token, user };
  }

  // LIST (protected)
  @Get()
  findAll(): Promise<SafeUser[]> {
    return this.usersService.findAll();
  }

  // GET ONE (protected)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<SafeUser> {
    return this.usersService.findOne(id);
  }

  // UPDATE (protected)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ): Promise<SafeUser> {
    return this.usersService.update(id, body);
  }

  // DELETE (protected)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
