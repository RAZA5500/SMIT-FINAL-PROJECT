import { IsInt, IsUUID, Min } from 'class-validator';

export class AddCartItemDto {
  @IsUUID()
  productId: string;

  /** Same product pehle se ho to quantity increment hoti hai */
  @IsInt()
  @Min(1)
  quantity: number;
}
