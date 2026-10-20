import * as z from "zod";

/** Register aur baaki password forms mein reuse — 8 se 72 (bcrypt limit) */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password cannot exceed 72 characters");
