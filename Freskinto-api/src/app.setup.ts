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
  const rawOrigins = config.get('CORS_ORIGINS', { infer: true });
  const allowedOrigins = rawOrigins
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Requests without Origin header (curl, mobile apps, server-to-server, health checks)
      if (!origin) {
        return callback(null, true);
      }
      const isAllowed =
        allowedOrigins.includes('*') ||
        allowedOrigins.includes(origin) ||
        allowedOrigins.some((allowed) => {
          if (allowed.startsWith('https://*.') || allowed.startsWith('http://*.')) {
            const expectedProtocol = allowed.startsWith('https://')
              ? 'https:'
              : 'http:';
            const rootDomain = allowed.replace(/^https?:\/\/\*\./, '');
            try {
              const originUrl = new URL(origin);
              return (
                originUrl.protocol === expectedProtocol &&
                (originUrl.hostname === rootDomain ||
                  originUrl.hostname.endsWith(`.${rootDomain}`))
              );
            } catch {
              return false;
            }
          }
          return false;
        });

      if (isAllowed) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
      'traceparent',
      'baggage',
      'sentry-trace',
      'Cache-Control',
      'Pragma',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
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
