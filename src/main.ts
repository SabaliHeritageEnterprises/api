import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: false });
  const config = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Security middleware
  app.use(helmet({ 
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  }));
  app.use(cookieParser());

  // ✅ FIXED CORS CONFIGURATION
  app.enableCors({
    origin: [
      'https://apps-frontend-tau.vercel.app',
      'https://apex1.up.railway.app',
      'http://localhost:3000',
      'http://localhost:4000',
      'https://apps-frontend-tau.vercel.app:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Cookie',
      'X-Requested-With',
      'Accept'
    ],
    exposedHeaders: ['Set-Cookie'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const prefix = config.get<string>('globalPrefix') ?? 'api/v1';
  app.setGlobalPrefix(prefix);

  const port = config.get<number>('port') ?? 4000;
  
  await app.listen(port, '0.0.0.0');
  
  logger.log(`🚀 API ready at http://0.0.0.0:${port}/${prefix}`);
  logger.log(`✅ CORS enabled for: https://apps-frontend-tau.vercel.app`);
}

bootstrap();