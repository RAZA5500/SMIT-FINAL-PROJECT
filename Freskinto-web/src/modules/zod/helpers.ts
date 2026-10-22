/**
 * Number inputs string dete hain — khali string → undefined (taa ke "required" message
 * aaye), baaki Number() (FLOW-MD 09 §1.2: `z.preprocess(toNum, z.number(...))`).
 */
export function toNum(value: unknown): unknown {
  if (value === "" || value === null || value === undefined) return undefined;
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  return value;
}

/** Optional text fields: khali string → undefined (API ko "" na jaye) */
export function emptyToUndefined(value: unknown): unknown {
  return typeof value === "string" && value.trim() === "" ? undefined : value;
}
