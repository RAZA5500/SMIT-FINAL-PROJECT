import type { TransformFnParams } from 'class-transformer';

/** String ho to trim, warna jaisa hai waisa (validator baad mein type check karega) */
export const trim = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

/** Email: trim + lowercase */
export const normalizeEmail = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

/**
 * Query string boolean: 'true' → true, 'false' → false. Koi aur value waisi hi
 * rehti hai taa ke `@IsBoolean()` 400 de sake.
 */
export const toBoolean = ({ value }: TransformFnParams): unknown => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
};
