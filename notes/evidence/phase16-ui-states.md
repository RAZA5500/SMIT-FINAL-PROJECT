# Phase 16 — Loading, error, empty, success states (FLOW-MD 07 §7, 13)

Run date: 20 Oct 2026, Chrome against `next dev` (http://localhost:3000).

## Backend switched off

The API process was stopped and these pages were opened (signed in as the admin, so both the storefront and
the admin guard paths were exercised):

| Page | What rendered |
|---|---|
| `/shop` | Categories card: "Couldn't load categories. Try again"; product grid: ErrorState "Couldn't load products — Unable to reach the server…" with **Try again**; cart panel still renders |
| `/` (home) | Popular Products: ErrorState "Couldn't load products" with **Try again**; static sections unaffected |
| `/admin/products` | AuthGuard ErrorState "We couldn't verify your session — Unable to reach the server…" with **Try again** (network error does **not** log the user out; only 401/403 do) |

No page went blank or crashed. After restarting the API, "Try again" reloads the data.

## How each state is implemented

| State | Pattern |
|---|---|
| Loading | Skeletons: `TableSkeleton`, `ProductGridSkeleton`, card skeletons, `PageLoader` while the session hydrates |
| Background refetch | `placeholderData: keepPreviousData` on paginated lists + faded table/grid while `isFetching` |
| Error | `ErrorState` with retry (lists/details), `toastError(title, message)` for mutations; 404 detail pages say "not found" |
| Empty | `EmptyState` with a next step (e.g. "Browse products", "Add address") and filter-aware messages |
| Success | `toastSuccess(...)` in mutation `onSuccess` (`{ silent: true }` when the caller toasts itself) |
| Pending buttons | `LoadingButton` (spinner + disabled) on every submit |

Automated: `src/components/customer/FreshDealsSection.test.tsx` (skeleton → data, MSW 500 → ErrorState, empty
array → EmptyState).
