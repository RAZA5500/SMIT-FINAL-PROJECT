import {
  Apple,
  Beef,
  Carrot,
  Cookie,
  Croissant,
  CupSoda,
  Drumstick,
  Fish,
  Milk,
  ShoppingBasket,
  Snowflake,
  SprayCan,
  Wheat,
  type LucideIcon,
} from "lucide-react";

/**
 * Visual merchandising layer. The API has no product images, so the storefront
 * pairs products with demo packshots by keyword and gives every category an icon
 * and an "aura" colour. Packshots are served as background-free cutouts
 * (public/images/cutouts, made from public/images/products) so products can float
 * over their glow. Purely presentational — nothing here changes data or prices.
 * When nothing matches, the UI shows an icon instead of a photo that could
 * misrepresent the product.
 */

const CUTOUT_DIR = "/images/cutouts";

/** Most specific patterns first — the first match wins */
const PRODUCT_PACKSHOTS: { pattern: RegExp; image: string }[] = [
  { pattern: /\bnuggets?\b/, image: "frozen-chicken-nuggets" },
  { pattern: /\bwings?\b/, image: "chicken-wings" },
  { pattern: /\bthighs?\b/, image: "chicken-thigh-fillets" },
  { pattern: /\bchicken\b.*\b(strips?|tenders?|goujons?)\b/, image: "tender-chicken-breast-strips" },
  { pattern: /\bbreasts?\b/, image: "fresh-chicken-breast" },
  { pattern: /\b(chicken|poultry)\b/, image: "premium-chicken-fillets" },
  { pattern: /\b(burgers?|patty|patties)\b/, image: "classic-beef-burgers" },
  { pattern: /\b(mince|minced)\b/, image: "lean-beef-mince" },
  { pattern: /\b(steaks?|sirloin|ribeye|beef)\b/, image: "premium-sirloin-steak" },
  { pattern: /\bpizzas?\b/, image: "four-cheese-frozen-pizza" },
  { pattern: /\bcrackers?\b/, image: "cheese-crackers" },
  { pattern: /\b(mozzarella|burrata)\b/, image: "classic-mozzarella-cheese" },
  { pattern: /\bchees\w*\b.*\bslices?\b|\bslices?\b.*\bchees/, image: "creamy-cheddar-slices" },
  { pattern: /\b(cheddar|cheeses?)\b/, image: "mature-cheddar-cheese" },
  { pattern: /\b(low[- ]fat|skimmed|semi[- ]skimmed)\b.*\bmilk\b/, image: "low-fat-fresh-milk" },
  { pattern: /\b(full[- ]cream|whole)\b.*\bmilk\b/, image: "full-cream-fresh-milk" },
  { pattern: /(?<!(coconut|almond|oat|soy|soya|chocolate) )\bmilk\b(?! chocolate)/, image: "fresh-whole-milk-1l" },
  { pattern: /(?<!ice )\bcream\b|\byog(h)?urts?\b/, image: "pure-dairy-cream" },
  { pattern: /\bapples?\b/, image: "royal-gala-apples" },
  { pattern: /\bbananas?\b/, image: "premium-bananas" },
  { pattern: /(?<!(black|white|chilli) )\b(peppers?|capsicums?)\b/, image: "fresh-bell-peppers" },
  { pattern: /\b(lettuce|romaine)\b/, image: "crisp-romaine-lettuce" },
  { pattern: /\bbaby spinach\b/, image: "organic-baby-spinach" },
  { pattern: /\b(spinach|kale)\b/, image: "fresh-spinach" },
  { pattern: /\b(broccoli|vegetable mix|mixed veg\w*)\b/, image: "garden-vegetable-mix" },
  { pattern: /\bsamosas?\b/, image: "frozen-vegetable-samosas" },
  { pattern: /\b(crisps?|potato chips|tortilla chips)\b/, image: "classic-potato-chips" },
  { pattern: /\b(fries|chips|wedges)\b/, image: "frozen-french-fries" },
  { pattern: /\b(peanuts?|cashews?|almonds?|mixed nuts)\b/, image: "roasted-salted-peanuts" },
  { pattern: /\b(multigrain|seeded|sandwich)\b.*\bbread\b|\bsliced bread\b/, image: "multigrain-sandwich-bread" },
  { pattern: /\b(bread|loaf|sourdough|bloomer)\b/, image: "whole-wheat-bread-loaf" },
];

/**
 * Aura = the soft glow a product floats on, taken from the food's own colour (apples glow red,
 * spinach green, dairy a cool sky blue). Hex values feed a CSS custom property (`--aura`).
 */
const AURA = {
  red: "#ff5a4f",
  pepper: "#ff6b3d",
  orange: "#ff9a3d",
  gold: "#ffc53d",
  green: "#36d67f",
  peach: "#ff9f86",
  crust: "#e9a15d",
  sky: "#5fb9ff",
  ice: "#6fd3f5",
  lilac: "#a78bfa",
  grain: "#d8a86b",
} as const;

/** Packshot → aura (every file in public/images/cutouts) */
const PACKSHOT_AURAS: Record<string, string> = {
  "royal-gala-apples": AURA.red,
  "premium-bananas": AURA.gold,
  "fresh-bell-peppers": AURA.pepper,
  "crisp-romaine-lettuce": AURA.green,
  "organic-baby-spinach": AURA.green,
  "fresh-spinach": AURA.green,
  "garden-vegetable-mix": AURA.green,
  "fresh-chicken-breast": AURA.peach,
  "premium-chicken-fillets": AURA.peach,
  "tender-chicken-breast-strips": AURA.peach,
  "chicken-thigh-fillets": AURA.peach,
  "chicken-wings": AURA.peach,
  "classic-beef-burgers": AURA.red,
  "lean-beef-mince": AURA.red,
  "premium-sirloin-steak": AURA.red,
  "four-cheese-frozen-pizza": AURA.orange,
  "frozen-chicken-nuggets": AURA.orange,
  "frozen-vegetable-samosas": AURA.orange,
  "frozen-french-fries": AURA.gold,
  "cheese-crackers": AURA.gold,
  "classic-potato-chips": AURA.gold,
  "roasted-salted-peanuts": AURA.orange,
  "classic-mozzarella-cheese": AURA.sky,
  "creamy-cheddar-slices": AURA.gold,
  "mature-cheddar-cheese": AURA.gold,
  "fresh-whole-milk-1l": AURA.sky,
  "full-cream-fresh-milk": AURA.sky,
  "low-fat-fresh-milk": AURA.sky,
  "farm-fresh-low-fat-milk": AURA.sky,
  "pure-dairy-cream": AURA.sky,
  "multigrain-sandwich-bread": AURA.crust,
  "whole-wheat-bread-loaf": AURA.crust,
};

export interface CategoryTheme {
  icon: LucideIcon;
  /** Glow colour for the aisle (hex) */
  aura: string;
  /** Representative packshot for category tiles */
  image?: string;
}

const CATEGORY_THEMES: { pattern: RegExp; theme: CategoryTheme }[] = [
  { pattern: /frozen|ice/, theme: { icon: Snowflake, image: "frozen-french-fries", aura: AURA.ice } },
  { pattern: /fruit|berr|citrus|orchard/, theme: { icon: Apple, image: "royal-gala-apples", aura: AURA.red } },
  { pattern: /veg|salad|greens|produce/, theme: { icon: Carrot, image: "fresh-bell-peppers", aura: AURA.green } },
  { pattern: /poultry|chicken|turkey|duck/, theme: { icon: Drumstick, image: "fresh-chicken-breast", aura: AURA.peach } },
  { pattern: /meat|beef|lamb|pork|butcher|steak/, theme: { icon: Beef, image: "premium-sirloin-steak", aura: AURA.red } },
  { pattern: /fish|seafood|salmon|prawn/, theme: { icon: Fish, aura: AURA.sky } },
  { pattern: /chees/, theme: { icon: Milk, image: "mature-cheddar-cheese", aura: AURA.gold } },
  { pattern: /dairy|milk|egg|yog|butter/, theme: { icon: Milk, image: "fresh-whole-milk-1l", aura: AURA.sky } },
  { pattern: /bak|bread|pastr|loaf|cake/, theme: { icon: Croissant, image: "whole-wheat-bread-loaf", aura: AURA.crust } },
  { pattern: /snack|crisp|chip|sweet|confection|biscuit|nut/, theme: { icon: Cookie, image: "classic-potato-chips", aura: AURA.gold } },
  { pattern: /drink|beverage|juice|water|soda|coffee|tea/, theme: { icon: CupSoda, aura: AURA.ice } },
  { pattern: /household|clean|laundry|home/, theme: { icon: SprayCan, aura: AURA.lilac } },
  { pattern: /pantry|rice|pasta|grain|flour|cereal|tin/, theme: { icon: Wheat, aura: AURA.grain } },
];

const DEFAULT_THEME: CategoryTheme = { icon: ShoppingBasket, aura: AURA.green };

export function packshotUrl(image: string): string {
  return `${CUTOUT_DIR}/${image}.webp`;
}

export function categoryTheme(categoryName: string | undefined): CategoryTheme {
  const name = categoryName?.toLowerCase() ?? "";
  return CATEGORY_THEMES.find(({ pattern }) => pattern.test(name))?.theme ?? DEFAULT_THEME;
}

function packshotFor(productName: string): string | null {
  const name = productName.toLowerCase();
  return PRODUCT_PACKSHOTS.find(({ pattern }) => pattern.test(name))?.image ?? null;
}

/** Background-free packshot for a product name, or null when no demo photo fits */
export function productPackshot(productName: string): string | null {
  const image = packshotFor(productName);
  return image ? packshotUrl(image) : null;
}

/** Itne din tak product "New" badge ke saath (createdAt se — asli data) */
const NEW_FOR_DAYS = 14;

export function isNewProduct(createdAt: string, now = Date.now()): boolean {
  return now - new Date(createdAt).getTime() < NEW_FOR_DAYS * 24 * 60 * 60 * 1000;
}

export interface ProductVisual {
  image: string | null;
  theme: CategoryTheme;
  /** Glow colour — the photo's own colour, else the aisle's */
  aura: string;
}

export function productVisual(productName: string, categoryName?: string): ProductVisual {
  const image = packshotFor(productName);
  const theme = categoryTheme(categoryName ?? productName);
  return {
    image: image ? packshotUrl(image) : null,
    theme,
    aura: (image && PACKSHOT_AURAS[image]) || theme.aura,
  };
}
