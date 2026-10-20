import { Prisma } from '@prisma/client';

/**
 * Prisma error codes check karne ke helpers. Kaunsa field unique tha yeh
 * call site khud decide karti hai — `meta.target` parse nahi karte (FLOW-MD 09 §3.2).
 */
export function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  );
}

export function isForeignKeyViolation(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2003'
  );
}
