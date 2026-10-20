# 09 — Validation aur Error Handling

> Frontend validation = achha user experience. Backend validation = **trust**. Backend kabhi frontend validation par bharosa nahi karta — har request ko khud validate karta hai.

## 1. Frontend — Zod

### 1.1 Schema location aur type inference [VERIFIED]

Schemas `web-app/src/modules/zod/<x>.model.ts` mein; type `z.infer` se:

```ts
import * as z from "zod";
import { passwordSchema } from "./password.model";        // reuse

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    password: passwordSchema,                               // z.string().min(8, ...)
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.boolean().refine((v) => v === true, { message: "You must agree to the Terms of Service and Privacy Policy" }),
  })
  .refine((d) => d.password === d.confirmPassword, {        // cross-field
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
```

### 1.2 Zod features jo students ko aane chahiye

| Feature | Example |
|---|---|
| Required + trim | `z.string().trim().min(1, "Required")` |
| Length limits | `.max(100, "Cannot exceed 100 characters")` (product name) |
| Number constraints | `z.number().int().positive()`, `.min(0)` |
| Email | `z.string().email()` |
| Enum | `z.enum(["DELIVERY", "PICKUP"], { error: "Delivery type is required" })` |
| Input string → number | `z.preprocess(toNum, z.number(...))` (product price input — empty string → undefined) |
| Optional / nullable / default | `.optional()`, `.nullable()`, `.default(1)` |
| Nested object / array | `z.object({ address: addressSchema })`, `z.array(itemSchema).min(1)` |
| Cross-field | `.refine` / `.superRefine` (password = confirmPassword; max qty ≥ min qty) |
| Reuse | `passwordSchema` register aur change-password dono mein |

### 1.3 Student example — checkout

```ts
export const addressSchema = z.object({
  addressLine: z.string().trim().min(1, "Address is required").max(100),
  city: z.string().trim().min(1, "City is required").max(30),
  county: z.string().trim().min(1, "County is required").max(30),
  postcode: z.string().trim().min(1, "Postcode is required").max(20),
});

export const checkoutSchema = z
  .object({
    deliveryType: z.enum(["DELIVERY", "PICKUP"]),
    addressId: z.string().uuid().optional(),
    shippingAddress: addressSchema.optional(),
    pickupScheduledAt: z.string().optional(),
    customerNotes: z.string().max(500).optional(),
  })
  .superRefine((d, ctx) => {
    if (d.deliveryType === "DELIVERY" && !d.addressId && !d.shippingAddress)
      ctx.addIssue({ code: "custom", path: ["addressId"], message: "Select or enter a delivery address" });
    if (d.deliveryType === "PICKUP" && !d.pickupScheduledAt)
      ctx.addIssue({ code: "custom", path: ["pickupScheduledAt"], message: "Choose a pickup time" });
  });
export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
```

Yeh rules backend ke `OrderCreationService` mein **dobara** check hote hain.

### 1.4 React Hook Form integration

`useForm({ resolver: zodResolver(schema), mode: "onChange", defaultValues })`, `InputField error={errors.x?.message}`, invalid submit par `scrollToFirstError(formId)` (`[aria-invalid='true']` target).

### 1.5 Schema share karein ya nahi?

Frontend Zod aur backend class-validator **alag** rakhein (original bhi alag rakhta hai). Wajah: backend ke transformations (`@Transform` email lowercase, query string → number), DB-dependent rules, aur alag frameworks. Shared monorepo package tabhi jab dono side same library aur same rules hon.

## 2. Backend — class-validator DTOs

```ts
export class CreateProductDto {
  @IsString() @IsNotEmpty() @MaxLength(100)
  name: string;

  @IsUUID()
  categoryId: string;

  @IsNumber({ maxDecimalPlaces: 2 }) @Min(0.01)
  price: number;

  @IsInt() @Min(1)
  minimumOrderQuantity: number;

  @IsInt() @Min(1)
  maximumOrderQuantity: number;

  @IsOptional() @IsEnum(UnitOfMeasure)
  unitOfMeasure?: UnitOfMeasure;
}
```

Global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })`:
- Unknown property → 400 (mass assignment block).
- `transform` DTO class instance banata hai.
- Validation error → 400 `{ message: ["price must not be less than 0.01"] }`.

### Validation ki teen sateh

| Level | Kahan | Example |
|---|---|---|
| Shape | DTO | `quantity` int ≥1 |
| Business / cross-field | Service | DELIVERY par address; `max >= min` order qty; product sirf leaf category mein |
| Invariant | Database | unique, FK, CHECK `qtyOnHand >= 0`, single-admin partial index |

## 3. Error handling

### 3.1 Global filter [VERIFIED `api/src/filters/errors.exception.filter.ts`]

| Exception | Response |
|---|---|
| `HttpException` (BadRequest, NotFound, ...) | Uska apna body |
| Prisma `P2002` | 409 `Unique constraint violation` |
| Prisma `P2003` | 400 `Invalid foreign key reference` |
| Prisma `P2025` | 404 `Record not found` |
| Prisma validation error | 400 `Invalid data provided` |
| Baaki sab | 500 `Internal Server Error` (stack sirf logs mein) |

### 3.2 Db service mein specific mapping

Generic filter se behtar message ke liye db service khud map kare:

```ts
try {
  return await this.db.product.create({ data });
} catch (e) {
  if (isUniqueViolation(e)) throw new ConflictException('A product with this name already exists in this category');
  this.logger.error(`Failed to create product: ${(e as Error).message}`);
  throw new InternalServerErrorException('Failed to create product');
}
```

Original rule (`.claude/error.md`): Prisma error ke `meta.target` / driver internals parse karke field guess **mat** karein — har call site jaanti hai kaunsa field unique hai.

### 3.3 Error message guidelines

- User ko samajh aaye aur action bataye: `Only 5 units available`, `Cart is empty`, `Order cannot be cancelled once it is in Processing status. Please contact support.`
- Internal details (SQL, table names, stack) kabhi nahi.
- Same category ke errors same status: business rule = 400, conflict/race = 409.

### 3.4 Frontend error display

`ApiError.message` toast description mein. Field-level server errors (e.g. 409 email exists) ko `setError("email", { message })` se form field par dikhayein.

## 4. Student checklist

- [ ] Har form ka Zod schema + `z.infer` type.
- [ ] Har endpoint ka DTO (body, query, params) — koi `any` body nahi.
- [ ] Har business rule service mein + unit test.
- [ ] Critical invariants DB constraint ke saath.
- [ ] 500 response mein koi internal detail nahi (test karein).
