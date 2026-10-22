import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateAddressDto } from './create-address.dto';

/** Default badalna sirf `PATCH /addresses/:id/default` se (ek hi jagah transaction logic) */
export class UpdateAddressDto extends PartialType(
  OmitType(CreateAddressDto, ['isDefault'] as const),
) {}
