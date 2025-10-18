import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties not defined in DTOs
      forbidNonWhitelisted: true, // Throw error for non-whitelisted properties
      transform: true, // Transform incoming data to DTO types
      transformOptions: {
        enableImplicitConversion: true, // Convert strings to numbers automatically
      },
    })
  );

  // Enable CORS for development
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
