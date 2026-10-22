import { execFileSync } from 'child_process';
import { join } from 'path';
import { TEST_DATABASE_URL } from './test-env';

/**
 * Test database par saari migrations apply karta hai (`migrate deploy` idempotent hai).
 * Data har suite se pehle truncate hota hai — dekhein `helpers/test-app.ts`.
 */
export default function globalSetup(): void {
  execFileSync(
    process.execPath,
    [require.resolve('prisma/build/index.js'), 'migrate', 'deploy'],
    {
      cwd: join(__dirname, '..'),
      env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
      stdio: 'inherit',
    },
  );
}
