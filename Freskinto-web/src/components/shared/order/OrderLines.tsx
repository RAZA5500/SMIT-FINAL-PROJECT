import { cn, formatMoney } from "@/lib/utils";
import { ProductImage } from "../ProductImage";

export interface OrderLine {
  id: string;
  name: string;
  sku?: string;
  quantity: number;
  /** Unit price (API money string) */
  price: string;
  subtotal: string;
}

/** Receipt-style item list — order ke waqt ka name/price snapshot */
export function OrderLines({ lines, className }: { lines: OrderLine[]; className?: string }) {
  return (
    <ul className={cn("flex flex-col divide-y divide-dashed divide-border", className)}>
      {lines.map((line) => (
        <li key={line.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <ProductImage name={line.name} sizes="56px" className="size-14 shrink-0 rounded-xl" imageClassName="p-1.5" />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="line-clamp-1 text-sm font-semibold text-foreground">{line.name}</p>
            <p className="text-fs-13 text-muted-foreground">
              <span className="numeric">
                {line.quantity} × {formatMoney(line.price)}
              </span>
              {line.sku && (
                <>
                  {" · "}
                  <span className="font-mono text-fs-12">{line.sku}</span>
                </>
              )}
            </p>
          </div>
          <p className="numeric shrink-0 text-sm font-semibold text-foreground">{formatMoney(line.subtotal)}</p>
        </li>
      ))}
    </ul>
  );
}
