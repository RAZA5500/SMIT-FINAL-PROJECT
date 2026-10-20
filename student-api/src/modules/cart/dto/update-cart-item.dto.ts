import { IsInt, Min } from 'class-validator';

export class UpdateCartItemDto {
  /** Absolute quantity (dobara bhejna safe); 0 = item remove */
  @IsInt()
  @Min(0)
  quantity: number;
}
