/** Backend money hamesha string ("12.50") bhejta hai — UI sirf format karti hai, hisaab nahi */
export function formatMoney(amount: string | number): string {
  const value = typeof amount === "number" ? amount : Number(amount);
  return `£${Number.isFinite(value) ? value.toFixed(2) : "0.00"}`;
}

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return "—";
  return dateTimeFormatter.format(new Date(value));
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  return dateFormatter.format(new Date(value));
}
