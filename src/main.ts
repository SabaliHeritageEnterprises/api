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
    contentSecurityPolicy: false, // Allow WebSocket connections
  }));
  app.use(cookieParser());

  // CORS for both HTTP and WebSocket
  app.enableCors({
    origin: [
      'https://apps-frontend-tau.vercel.app',
      'https://apex1.up.railway.app',
      'http://localhost:3000',
      'http://localhost:4000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  });

  // Global validation
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
  
  // Bind to all interfaces for Railway
  await app.listen(port, '0.0.0.0');
  
  logger.log(`🚀 API ready at http://0.0.0.0:${port}/${prefix}`);
  logger.log(`🔌 WebSocket ready at ws://0.0.0.0:${port}/socket.io`);
}

bootstrap();