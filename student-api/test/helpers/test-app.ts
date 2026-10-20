import { INestApplication } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test } from '@nestjs/testing';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppModule } from '../../src/app.module';
import { configureApp } from '../../src/app.setup';
import { DatabaseService } from '../../src/database/database.service';

interface ITestAppOptions {
  /** Default false — tests bahut se logins karte hain; rate limit test isay true karta hai */
  throttle?: boolean;
}

/** Bilkul production jaisi app (same global prefix, pipes, filter) — sirf test DB par */
export async function createTestApp(
  options: ITestAppOptions = {},
): Promise<INestApplication> {
  let builder = Test.createTestingModule({ imports: [AppModule] });
  if (!options.throttle) {
    builder = builder
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true });
  }
  const moduleRef = await builder.compile();

  const app = moduleRef.createNestApplication({ rawBody: true });
  configureApp(app);
  await app.init();
  // Crons background mein na chalein — tests unhein khud call karte hain (deterministic)
  app
    .get(SchedulerRegistry)
    .getCronJobs()
    .forEach((job) => void job.stop());
  return app;
}

/** Saari tables khali (migrations wali table ke ilawa) */
export async function resetDatabase(app: INestApplication): Promise<void> {
  const db = app.get(DatabaseService);
  await db.$executeRaw`TRUNCATE TABLE
    "inventory_transactions", "payments", "order_addresses", "order_items",
    "orders", "cart_items", "carts", "inventory", "products", "categories",
    "addresses", "users"
    RESTART IDENTITY CASCADE`;
}
