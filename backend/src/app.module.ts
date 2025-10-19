import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SpendingCategoriesModule } from './spending_categories/spending_categories.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [join(__dirname, '..', '.env'), '.env', '.env.local'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const url = cfg.get<string>('DATABASE_URL');
        if (!url || !url.startsWith('postgres')) {
          throw new Error('DATABASE_URL missing/invalid');
        }
        return {
          type: 'postgres',
          url,
          autoLoadEntities: true,
          synchronize: false,
          ssl: { rejectUnauthorized: false }, // dev-friendly; use CA for prod
        };
      },
    }),
    UsersModule,
    SpendingCategoriesModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // DISABLED FOR HACKATHON - NO AUTH REQUIRED
    // consumer
    //   .apply(AuthMiddleware)
    //   .exclude(
    //     { path: '/', method: RequestMethod.GET },

    //     // PUBLIC endpoints
    //     { path: 'users', method: RequestMethod.POST },          // signup
    //     { path: 'users/login', method: RequestMethod.POST },    // login
    //     { path: 'users/signup-seed', method: RequestMethod.POST } // signup + seed categories
    //   )
    //   .forRoutes('*');
  }
}
