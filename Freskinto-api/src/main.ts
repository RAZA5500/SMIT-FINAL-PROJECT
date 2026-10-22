import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';
import {
  NodeEnvironment,
  type EnvironmentVariables,
} from './config/env.validation';

async function bootstrap(): Promise<void> {
  // rawBody: payment webhook ka signature raw body par verify hota hai
  const app = await NestFactory.create(AppModule, { rawBody: true });
  configureApp(app);
  app.enableShutdownHooks();

  const config: ConfigService<EnvironmentVariables, true> =
    app.get(ConfigService);
  const prefix = config.get('URL_PREFIX', { infer: true });

  // Swagger sirf non-production mein (FLOW-MD 10 §3)
  if (config.get('NODE_ENV', { infer: true }) !== NodeEnvironment.Production) {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('OnlineMart API')
        .setVersion('1.0')
        .addBearerAuth()
        .addSecurityRequirements('bearer')
        .build(),
    );
    SwaggerModule.setup(`${prefix}/docs`, app, document);
  }

  await app.listen(config.get('PORT', { infer: true }));
}

void bootstrap();
