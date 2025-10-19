// src/app.module.ts

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { SpendingCategoriesModule } from './spending_categories/spending_categories.module';
import { SpendingCategory } from './spending_categories/entities/spending_category.entity';
import { TransactionsModule } from './transactions/transactions.module';
import { ReceiptScannerModule } from './receipt-scanner/receipt-scanner.module';
import { AuthMiddleware } from './common/middleware/auth.middleware';

@Module({
  imports: [
    // 1. Load the .env file
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigService available throughout the app
    }),

    // 2. Configure the database connection using the environment variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, SpendingCategory], // Auto-detects entities
        synchronize: true, // BE CAREFUL: Automatically creates DB schema. Good for dev, but use migrations for production.
      }),
    }),

    UsersModule,
    SpendingCategoriesModule,
    TransactionsModule,
    ReceiptScannerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('*'); // Apply to all routes
  }
}