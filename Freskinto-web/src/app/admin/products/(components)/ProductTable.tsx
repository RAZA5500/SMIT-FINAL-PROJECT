import { ExternalLink, Eye, EyeOff, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RowActionsMenu } from "@/components/admin/RowActionsMenu";
import { ProductImage } from "@/components/shared/ProductImage";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { adminRoutes, publicRoutes } from "@/lib/routes/routes";
import { cn, formatMoney } from "@/lib/utils";
import type { IAdminProduct } from "@/services/products/types";

export interface ProductTableProps {
  products: IAdminProduct[];
  isUpdating: boolean;
  onToggleStatus: (product: IAdminProduct) => void;
  onViewProduct: (product: IAdminProduct) => void;
}

export function ProductTable({
  products,
  isUpdating,
  onToggleStatus,
  onViewProduct,
}: ProductTableProps) {
  const router = useRouter();

  return (
    <Table className={cn("min-w-225")}>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className={cn("text-right")}>Price</TableHead>
          <TableHead className={cn("text-right")}>Order limits</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className={cn("w-12")}>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id} className={cn(!product.isActive && "text-muted-foreground")}>
            <TableCell className={cn("max-w-72")}>
              <div className="flex items-center gap-3">
                <div className="size-10 shrink-0 overflow-hidden rounded-xl border bg-muted">
                  <ProductImage name={product.name} categoryName={product.category.name} />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => onViewProduct(product)}
                    className="text-left font-semibold truncate hover:underline hover:text-brand-green transition-colors cursor-pointer"
                  >
                    {product.name}
                  </button>
                  <span className="font-mono text-fs-12 text-muted-foreground truncate">
                    {product.sku}
                  </span>
                </div>
              </div>
            </TableCell>
            <TableCell>{product.category.name}</TableCell>
            <TableCell className={cn("text-right font-semibold tabular-nums")}>
              {formatMoney(product.price)}
            </TableCell>
            <TableCell className={cn("text-right text-muted-foreground tabular-nums")}>
              {product.minimumOrderQuantity}–{product.maximumOrderQuantity}
            </TableCell>
            <TableCell>
              {product.inventoryId ? (
                <div className="flex items-center gap-2">
                  <span className="w-8 font-semibold tabular-nums">
                    {product.qtyOnHand}
                  </span>
                  <StatusBadge status={product.stockStatus} />
                </div>
              ) : (
                <span className="text-fs-12 text-muted-foreground">
                  No inventory yet
                </span>
              )}
            </TableCell>
            <TableCell>
              <StatusBadge status={product.isActive ? "ACTIVE" : "INACTIVE"} />
            </TableCell>
            <TableCell>
              <RowActionsMenu
                label={product.name}
                actions={[
                  {
                    label: "Quick view",
                    icon: Eye,
                    onSelect: () => onViewProduct(product),
                  },
                  {
                    label: "Edit",
                    icon: Pencil,
                    onSelect: () => router.push(adminRoutes.productEdit(product.id)),
                  },
                  ...(product.isActive
                    ? [
                        {
                          label: "View in shop",
                          icon: ExternalLink,
                          onSelect: () => router.push(publicRoutes.product(product.id)),
                        },
                      ]
                    : []),
                  {
                    label: product.isActive ? "Deactivate" : "Activate",
                    icon: product.isActive ? EyeOff : Eye,
                    disabled: isUpdating,
                    onSelect: () => onToggleStatus(product),
                  },
                ]}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
