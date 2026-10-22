import type { Prisma } from '@prisma/client';

/**
 * Transaction ke andar chalne wala client. Db service methods yeh accept karte
 * hain taa ke ek transaction kai modules mein share ho sake (FLOW-MD 04 §5).
 */
export type TransactionClient = Prisma.TransactionClient;
