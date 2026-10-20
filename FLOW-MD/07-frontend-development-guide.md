# 07 — Frontend Development Guide

Stack same rakhein jo original `web-app` mein hai [VERIFIED `web-app/package.json`]:

| Concern | Library |
|---|---|
| Framework | Next.js 16 App Router (RSC default, `"use client"` per file) |
| Server state | `@tanstack/react-query` v5 |
| Forms | `react-hook-form` + `@hookform/resolvers/zod`, `mode: "onChange"` |
| Validation | `zod` v4 |
| Client state | `zustand` (persist) |
| UI primitives | shadcn/ui pattern (`components/ui/`, cva variants) |
| Styling | Tailwind CSS v4 + custom design tokens (`app/globals.css`) |
| Icons / toasts | `lucide-react`, `sonner` |
| Package manager | `bun` |

## 1. Folder structure (original convention)

```text
src/
├── app/
│   ├── (auth)/login/page.tsx + components/LoginForm.tsx
│   ├── admin/<module>/page.tsx            # page sirf compose karta hai
│   │   └── (components)/                  # us page ke components (parens route se chhupate hain)
│   ├── shop/ cart-summary/ checkout/ profile/
│   └── providers/providers.tsx
├── components/ui/          # Button, Input, Dialog, Select, Badge, Skeleton, Table...
├── components/shared/      # InputField, TextAreaField, SelectField, SearchInput, Pagination,
│                           # EmptyState, ErrorState, DeleteDialog, AppModal, StatusBadge, AuthGuard
├── components/admin/       # AdminDataTable, AdminFilterDropdown, AppNavbar, AppSidebar...
├── components/customer/    # SiteHeader, CartPanel, CheckoutForm, ProductListing...
├── services/<domain>/{index.ts,types.ts,queries.ts,mutations.ts}
├── modules/zod/<x>.model.ts
├── hooks/  stores/  constants/  lib/
```

## 2. Responsibility separation

| Layer | Example (original) | Rule |
|---|---|---|
| Page / layout | `app/admin/products/page.tsx` → `<ProductsView />` | Sirf compose; data fetching hooks view component mein |
| Feature component | `ProductsView`, `ProductFilters`, `ProductTable`, `ProductViewModal` | Ek component ek kaam |
| Reusable UI | `Pagination`, `EmptyState`, `InputField` | Typed props, koi API call nahi |
| Form + schema | `modules/zod/product.model.ts` + `ProductFormFrame` | Schema alag file |
| API + hooks | `services/products/index.ts` + `queries.ts` + `mutations.ts` | Components `fetch` kabhi direct na karein |
| Types | `services/products/types.ts` | Backend response types |
| State | `stores/shop-store.ts` (cart UI), `auth-store.ts` | Server data Zustand mein copy na karein (cart exception — optimistic UI) |

Page ek file mein poora feature implement **na kare**. `ProductsView` (171 lines) filters, table aur modal ko compose karta hai — achha example.

## 3. shadcn/ui aur reusable components

- `components/ui/*` = primitives (shadcn generate karta hai: `bunx shadcn add button dialog select ...`). Inhein khud design system ke mutabiq customize karein (`button-variants.ts` mein `cta`, `destructive`, `signin` variants — original).
- `components/shared/*` = in primitives par bane project components:

| Component | Props (typed) | Kahan |
|---|---|---|
| `InputField` | `label, error, leftIcon, rightIcon, hint, ...input props` | Har form |
| `Pagination` | `currentPage, totalPages, total, limit, onPageChange, itemLabel` | Har table |
| `EmptyState` / `ErrorState` | `title?, message?` | List states |
| `DeleteDialog` / destructive modal | `open, onConfirm, title, description` | Deletes / cancel |
| `StatusBadge` | `status` → color map | Orders, stock status |
| `SearchInput` | debounced value | Filters |

Naya component banane se pehle check: kya `components/shared` ya `components/ui` mein pehle se hai? Bahut generic "super component" na banayein jise samajhna mushkil ho.

Original ke do modal patterns [VERIFIED CLAUDE.md]: simple `DeleteDialog`, aur standard destructive modal (entity summary card + "cannot be undone" badge + confirm checkbox + destructive button).

## 4. Tailwind rules

- **Arbitrary spacing mat likho:** `p-[20px]`, `gap-[13px]` ❌ → `p-5`, `gap-3` ✅.
- Design tokens `globals.css` mein (`--brand-green`, `rounded-15`, `bg-modal-footer`, `text-fs-20`); components mein semantic classes (`bg-brand-green`) use karein, hex code nahi.
- Conditional classes `cn()` se, template literals se nahi.
- Responsive: mobile-first (`md:`, `xl:`).
- Original mein ab bhi ~15 jagah arbitrary px values hain (e.g. `w-[400px]` style) — students in se seekhein ke inhein token/scale se kaise replace karna hai. Exception zaroori ho to comment mein reason likhein.

## 5. File size

Koi file 1000 lines se zyada nahi. Original mein `components/ui/sidebar.tsx` (681, shadcn generated), `components/customer/ProductListing.tsx` (544), `components/admin/AppSidebar.tsx` (503) sab se bade hain. 300+ lines ho jayein aur file mein multiple responsibilities hon to split: sub-components, `useXxx` hook, `constants.ts`, `types.ts` (original CLAUDE.md: "Big components live in a local folder").

## 6. Forms pattern [VERIFIED]

```tsx
const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
  mode: "onChange",
  defaultValues: { email: "", password: "", rememberMe: false },
});

<form onSubmit={handleSubmit(onSubmit, () => scrollToFirstError("login-form"))} id="login-form">
  <InputField id="email" label="Email" error={errors.email?.message} {...register("email")} />
  <Button type="submit" disabled={isSubmitting}>Sign in</Button>
</form>
```

Multi-step form: `TAB_FIELDS` map + `trigger(TAB_FIELDS[tab])` — tab click current tab validation bypass na kare.

## 7. Loading / error / empty / success states

| State | Original pattern |
|---|---|
| Loading | Skeleton component prop ke taur par (`ProductTableSkeleton`) — "Loading..." text nahi |
| Background refetch | `isFetching` par halka indicator; `placeholderData: keepPreviousData` table ko blank nahi hone deta |
| Error | `ErrorState` ya toast `toastError(title, err.message)` |
| Empty | `EmptyState title message` |
| Success | `toastSuccess(...)` mutation `onSuccess` mein; `{ silent: true }` option jab caller khud toast kare |
| Button loading | `<LoaderCircle className="w-4 h-4 mr-2 animate-spin" />` + `disabled` |

## 8. Routes aur endpoints ka rule

- Saare client paths `lib/routes/routes.ts` (`publicRoutes`, `customerRoutes`, `adminRoutes`) — hard-coded `"/admin/orders"` nahi.
- Saare API URLs `lib/api.ts` (`API_ENDPOINTS`, `ADMIN_API_ENDPOINTS`).
- `process.env` sirf `lib/config.ts` / `lib/api.ts` mein.

## 9. Student web — suggested pages

| Area | Pages |
|---|---|
| Auth | `/login`, `/register` |
| Customer | `/shop` (list + filters + search), `/cart`, `/checkout`, `/checkout/payment`, `/orders`, `/orders/[id]`, `/addresses` |
| Admin | `/admin/categories`, `/admin/products` (+ new / edit), `/admin/inventory`, `/admin/orders` (+ detail), `/admin/customers` |

Har page: `page.tsx` + `(components)/` folder + `services/<domain>` hooks.

## 10. Accessibility

- `InputField` `aria-invalid` set karta hai; error message input ke neeche.
- Buttons par visible text ya `aria-label` (icon buttons).
- `Label htmlFor` = input `id`.
- Dialog focus trap (shadcn Dialog/base-ui handle karta hai).
- **[INFERRED]** Original mein koi automated accessibility test nahi.
