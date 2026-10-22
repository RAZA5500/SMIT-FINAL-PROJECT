import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateInventoryDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(0)
  qtyOnHand: number;

  /** Default 10 */
  @IsOptional()
  @IsInt()
  @Min(0)
  lowStockThreshold?: number;
}
