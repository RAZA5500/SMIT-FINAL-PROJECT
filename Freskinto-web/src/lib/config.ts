/**
 * `process.env` sirf yahan parha jata hai (FLOW-MD 07 §8).
 * `NEXT_PUBLIC_` values browser bundle mein jati hain — in mein kabhi secret nahi.
 */
export const config = {
  apiBaseUrl: (() => {
    const raw = (
      process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:4000/v1"
    )
      .trim()
      .replace(/\/+$/, "");
    if (!/\/v\d+$/i.test(raw)) {
      return `${raw}/v1`;
    }
    return raw;
  })(),
} as const;
