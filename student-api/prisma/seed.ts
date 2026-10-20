/**
 * Admin seed script — project ka EK hi admin yahin se banta hai (FLOW-MD 06 §5).
 * Koi API endpoint admin nahi banata. Admin pehle se ho to kuch nahi karta.
 *
 * Env: DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
 * Run: bun run db:seed
 */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';
import { BCRYPT_COST } from '../src/common/constants';
import { isUniqueViolation } from '../src/database/prisma-errors';

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

async function main(): Promise<void> {
  const email = requiredEnv('ADMIN_EMAIL').toLowerCase();
  const password = requiredEnv('ADMIN_PASSWORD');
  const name = requiredEnv('ADMIN_NAME');

  if (password.length < 8 || password.length > 72) {
    throw new Error('ADMIN_PASSWORD must be 8-72 characters long');
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: requiredEnv('DATABASE_URL') }),
  });

  try {
    const existingAdmin = await prisma.user.findFirst({
      where: { role: UserRole.ADMIN },
      select: { email: true },
    });
    if (existingAdmin) {
      console.log(`Admin already exists (${existingAdmin.email}) — skipping.`);
      return;
    }

    await prisma.user.create({
      data: {
        email,
        name,
        passwordHash: await hash(password, BCRYPT_COST),
        role: UserRole.ADMIN,
      },
    });
    console.log(`Admin created: ${email}`);
  } catch (error) {
    // Do parallel seeds: users_single_admin index doosre ko rok deta hai
    if (isUniqueViolation(error)) {
      console.log('Admin already exists — skipping.');
      return;
    }
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
