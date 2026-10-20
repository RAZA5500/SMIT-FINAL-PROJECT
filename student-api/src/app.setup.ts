import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import type { EnvironmentVariables } from './config/env.validation';

/**
 * Global HTTP setup — main.ts aur e2e tests dono yahi use karte hain taa ke
 * tests bilkul production jaisi app par chalein.
 */
export function configureApp(app: INestApplication): void {
  const config: ConfigService<EnvironmentVariables, true> =
    app.get(ConfigService);

  app.setGlobalPrefix(config.get('URL_PREFIX', { infer: true }));
  app.use(helmet());
  app.enableCors({
    origin: config
      .get('CORS_ORIGINS', { infer: true })
      .split(',')
      .map((origin) => origin.trim()),
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  // whitelist + forbidNonWhitelisted: DTO se bahar ka field → 400 (mass assignment block)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
}
