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
 * pairs products with demo packshots (public/images/products) by keyword and
 * gives every category a tint + icon. Purely presentational — nothing here
 * changes data or prices. When nothing matches, the UI shows an icon tile
 * instead of a photo that could misrepresent the product.
 */

const PACKSHOT_DIR = "/images/products";

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

const TONES = ["green", "red", "sky", "amber", "rose", "orange", "cyan", "yellow", "teal", "violet", "stone"] as const;
export type Tone = (typeof TONES)[number];

interface ToneClasses {
  tile: string;
  icon: string;
  chip: string;
}

/** Aisle tile tokens (globals.css) — har tone ek warm well par: sage, butter, clay, sky, rose, stone */
const TILES = {
  sage: { tile: "bg-tile-sage", icon: "text-brand-green-dark", chip: "bg-tile-sage text-brand-green-dark" },
  butter: { tile: "bg-tile-butter", icon: "text-saffron-ink", chip: "bg-tile-butter text-saffron-ink" },
  clay: { tile: "bg-tile-clay", icon: "text-brand-orange", chip: "bg-tile-clay text-brand-orange" },
  sky: { tile: "bg-tile-sky", icon: "text-info-ink", chip: "bg-tile-sky text-info-ink" },
  rose: { tile: "bg-tile-rose", icon: "text-tomato-ink", chip: "bg-tile-rose text-tomato-ink" },
  stone: { tile: "bg-tile-stone", icon: "text-neutral-ink", chip: "bg-tile-stone text-neutral-ink" },
} satisfies Record<string, ToneClasses>;

/** Tone naam category data mein rehte hain; yahan har tone ka tile tay hota hai */
export const TONE_CLASSES: Record<Tone, ToneClasses> = {
  green: TILES.sage,
  teal: TILES.sage,
  amber: TILES.butter,
  yellow: TILES.butter,
  orange: TILES.clay,
  sky: TILES.sky,
  cyan: TILES.sky,
  red: TILES.rose,
  rose: TILES.rose,
  violet: TILES.stone,
  stone: TILES.stone,
};

export interface CategoryTheme {
  tone: Tone;
  icon: LucideIcon;
  /** Representative packshot for category tiles */
  image?: string;
}

const CATEGORY_THEMES: { pattern: RegExp; theme: CategoryTheme }[] = [
  { pattern: /frozen|ice/, theme: { tone: "cyan", icon: Snowflake, image: "frozen-french-fries" } },
  { pattern: /fruit|berr|citrus|orchard/, theme: { tone: "red", icon: Apple, image: "royal-gala-apples" } },
  { pattern: /veg|salad|greens|produce/, theme: { tone: "green", icon: Carrot, image: "fresh-bell-peppers" } },
  { pattern: /poultry|chicken|turkey|duck/, theme: { tone: "orange", icon: Drumstick, image: "fresh-chicken-breast" } },
  { pattern: /meat|beef|lamb|pork|butcher|steak/, theme: { tone: "rose", icon: Beef, image: "premium-sirloin-steak" } },
  { pattern: /fish|seafood|salmon|prawn/, theme: { tone: "sky", icon: Fish } },
  { pattern: /chees/, theme: { tone: "amber", icon: Milk, image: "mature-cheddar-cheese" } },
  { pattern: /dairy|milk|egg|yog|butter/, theme: { tone: "sky", icon: Milk, image: "fresh-whole-milk-1l" } },
  { pattern: /bak|bread|pastr|loaf|cake/, theme: { tone: "amber", icon: Croissant, image: "whole-wheat-bread-loaf" } },
  { pattern: /snack|crisp|chip|sweet|confection|biscuit|nut/, theme: { tone: "yellow", icon: Cookie, image: "classic-potato-chips" } },
  { pattern: /drink|beverage|juice|water|soda|coffee|tea/, theme: { tone: "teal", icon: CupSoda } },
  { pattern: /household|clean|laundry|home/, theme: { tone: "violet", icon: SprayCan } },
  { pattern: /pantry|rice|pasta|grain|flour|cereal|tin/, theme: { tone: "stone", icon: Wheat } },
];

const DEFAULT_THEME: CategoryTheme = { tone: "green", icon: ShoppingBasket };

export function packshotUrl(image: string): string {
  return `${PACKSHOT_DIR}/${image}.webp`;
}

export function categoryTheme(categoryName: string | undefined): CategoryTheme {
  const name = categoryName?.toLowerCase() ?? "";
  return CATEGORY_THEMES.find(({ pattern }) => pattern.test(name))?.theme ?? DEFAULT_THEME;
}

/** Packshot for a product name, or null when no demo photo fits */
export function productPackshot(productName: string): string | null {
  const name = productName.toLowerCase();
  const match = PRODUCT_PACKSHOTS.find(({ pattern }) => pattern.test(name));
  return match ? packshotUrl(match.image) : null;
}

/** Itne din tak product "New" badge ke saath (createdAt se — asli data) */
const NEW_FOR_DAYS = 14;

export function isNewProduct(createdAt: string, now = Date.now()): boolean {
  return now - new Date(createdAt).getTime() < NEW_FOR_DAYS * 24 * 60 * 60 * 1000;
}

export interface ProductVisual {
  image: string | null;
  theme: CategoryTheme;
}

export function productVisual(productName: string, categoryName?: string): ProductVisual {
  return { image: productPackshot(productName), theme: categoryTheme(categoryName ?? productName) };
}
