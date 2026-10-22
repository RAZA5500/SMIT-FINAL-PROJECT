import { ExternalLink, Eye, EyeOff, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Flex, Stack } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
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
            <Text as="span" className="sr-only">
              Actions
            </Text>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id} className={cn(!product.isActive && "text-muted-foreground")}>
            <TableCell className={cn("max-w-72")}>
              <Flex align="center" gap="3">
                <ProductImage
                  name={product.name}
                  categoryName={product.category.name}
                  sizes="40px"
                  className="size-10 shrink-0 rounded-xl border"
                  imageClassName="p-1"
                />
                <Stack gap="0.5" className="min-w-0">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => onViewProduct(product)}
                    className="h-auto justify-start truncate p-0 font-semibold text-foreground hover:text-primary"
                  >
                    {product.name}
                  </Button>
                  <Text as="span" tone="muted" family="mono" className="truncate text-fs-12">
                    {product.sku}
                  </Text>
                </Stack>
              </Flex>
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
                <Flex align="center" gap="2">
                  <Text as="span" weight="semibold" numeric className="w-8">
                    {product.qtyOnHand}
                  </Text>
                  <StatusBadge status={product.stockStatus} />
                </Flex>
              ) : (
                <Text as="span" tone="muted" className="text-fs-12">
                  No inventory yet
                </Text>
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
