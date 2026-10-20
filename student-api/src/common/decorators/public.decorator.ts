import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Global JwtAuthGuard ko skip karta hai — sirf catalog, auth, health aur webhook routes par. */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
