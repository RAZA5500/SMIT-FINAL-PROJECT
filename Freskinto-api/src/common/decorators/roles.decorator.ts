import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '@prisma/client';

export const ROLES_KEY = 'roles';

/** Route (ya controller) sirf in roles ke liye — RolesGuard check karta hai. */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
