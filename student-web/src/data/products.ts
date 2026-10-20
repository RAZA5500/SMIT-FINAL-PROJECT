export interface Product {
  id: string;
  name: string;
  /** Leaf category the product is filed under, matching the shop sidebar tree. */
  category: string;
  price: number;
  image?: string;
  description?: string;
  saleTag?: string;
  inStock: boolean;
}

const CDN = "/media/products";

export const PRODUCTS: Product[] = [
  {
    id: "low-fat-fresh-milk",
    name: "Low Fat Fresh Milk",
    category: "Fresh Milk",
    price: 2.0,
    description: "Light and refreshing low-fat milk for everyday family consumption.",
    image: `${CDN}/fresh-milk-low-fat-fresh-milk/b1c1a538.jpg`,
    saleTag: "Sale 50%",
    inStock: true,
  },
  {
    id: "milk-pack",
    name: "Milk Pack",
    category: "Fresh Milk",
    price: 5.0,
    image: `${CDN}/fresh-milk-milk-pack/785c43e3.jpg`,
    inStock: true,
  },
  {
    id: "fresh-bell-peppers",
    name: "Fresh Bell Peppers",
    category: "Vegetables",
    price: 4.0,
    description:
      "Colorful and crunchy bell peppers ideal for salads, stir-fries, and cooking. Colorful and crunchy bell peppers ideal for salads, stir-fries, and cooking. Colorful and crunchy bell peppers ideal for salads, stir-fries, and cooking.",
    image: `${CDN}/vegetables-fresh-bell-peppers/50272e20.jpg`,
    inStock: false,
  },
  {
    id: "full-cream-fresh-milk",
    name: "Full Cream Fresh Milk",
    category: "Fresh Milk",
    price: 3.0,
    description: "Smooth and creamy fresh milk suitable for drinking, cooking, and baking.",
    image: `${CDN}/fresh-milk-full-cream-fresh-milk/3c7147cd.jpg`,
    inStock: false,
  },
  {
    id: "chicken-wings",
    name: "Chicken Wings",
    category: "Chicken",
    price: 7.0,
    description: "Fresh chicken wings ideal for roasting, grilling, or flavorful marinades.",
    image: `${CDN}/chicken-chicken-wings/27218394.jpg`,
    inStock: true,
  },
  {
    id: "chicken-thigh-fillets",
    name: "Chicken Thigh Fillets",
    category: "Chicken",
    price: 4.0,
    description: "Juicy boneless chicken thigh fillets perfect for curries and grilling.",
    image: `${CDN}/chicken-chicken-thigh-fillets/57f126e5.jpg`,
    inStock: true,
  },
  {
    id: "frozen-vegetable-samosas",
    name: "Frozen Vegetable Samosas",
    category: "Frozen Foods",
    price: 18.0,
    description: "Crispy pastry filled with seasoned vegetables, ready to bake or fry.",
    image: `${CDN}/frozen-foods-frozen-vegetable-samosas/67db05e9.jpg`,
    inStock: false,
  },
  {
    id: "frozen-french-fries",
    name: "Frozen French Fries",
    category: "Frozen Foods",
    price: 20.0,
    description:
      "Golden-cut frozen fries that are perfect for quick meals and sides. Golden-cut frozen fries that are perfect for quick meals and sides.",
    image: `${CDN}/frozen-foods-frozen-french-fries/3119430b.jpg`,
    inStock: true,
  },
  {
    id: "frozen-chicken-nuggets",
    name: "Frozen Chicken Nuggets",
    category: "Frozen Foods",
    price: 15.0,
    description: "Crispy coated chicken nuggets that are quick and easy to prepare.",
    image: `${CDN}/frozen-foods-frozen-chicken-nuggets/f2326a67.jpg`,
    inStock: false,
  },
  {
    id: "cheese-crackers",
    name: "Cheese Crackers",
    category: "Snacks",
    price: 8.0,
    description: "Crisp golden crackers with a rich cheese flavor for everyday snacking.",
    image: `${CDN}/snacks-cheese-crackers/21ed67d4.jpg`,
    inStock: false,
  },
  {
    id: "roasted-salted-peanuts",
    name: "Roasted Salted Peanuts",
    category: "Snacks",
    price: 6.0,
    description: "Crunchy roasted peanuts with a lightly salted flavor, perfect for snacking.",
    image: `${CDN}/snacks-roasted-salted-peanuts/23249df6.jpg`,
    inStock: false,
  },
  {
    id: "classic-potato-chips",
    name: "Classic Potato Chips",
    category: "Snacks",
    price: 5.0,
    description: "Crispy and lightly salted potato chips for a quick and tasty snack.",
    image: `${CDN}/snacks-classic-potato-chips/3c3d2e40.jpg`,
    inStock: true,
  },
  {
    id: "garden-vegetable-mix",
    name: "Garden Vegetable Mix",
    category: "Frozen Foods",
    price: 4.0,
    description: "A colorful blend of frozen vegetables for rice, soups, and everyday cooking.",
    image: `${CDN}/frozen-foods-garden-vegetable-mix/b5479886.jpg`,
    inStock: false,
  },
  {
    id: "four-cheese-frozen-pizza",
    name: "Four Cheese Frozen Pizza",
    category: "Whole Wheat Bread",
    price: 4.0,
    description: "Creamy four-cheese pizza that can be prepared quickly at home.",
    image: `${CDN}/whole-wheat-bread-four-cheese-frozen-pizza/781e4017.jpg`,
    inStock: false,
  },
  {
    id: "multigrain-sandwich-bread",
    name: "Multigrain Sandwich Bread",
    category: "Whole Wheat Bread",
    price: 3.0,
    description: "Soft multigrain bread packed with wholesome grains for sandwiches and toast.",
    image: `${CDN}/whole-wheat-bread-multigrain-sandwich-bread/cd2a3e2e.jpg`,
    inStock: false,
  },
  {
    id: "whole-wheat-bread-loaf",
    name: "Whole Wheat Bread Loaf",
    category: "Whole Wheat Bread",
    price: 2.0,
    description: "Fresh whole wheat bread with a hearty texture for healthy everyday meals.",
    image: `${CDN}/whole-wheat-bread-whole-wheat-bread-loaf/c5bf5256.jpg`,
    inStock: false,
  },
  {
    id: "classic-beef-burgers",
    name: "Classic Beef Burgers",
    category: "Frozen Foods",
    price: 11.0,
    description: "Juicy beef burger patties made for quick and satisfying homemade meals.",
    image: `${CDN}/frozen-foods-classic-beef-burgers/af8b25e9.jpg`,
    inStock: false,
  },
  {
    id: "premium-sirloin-steak",
    name: "Premium Sirloin Steak",
    category: "Frozen Foods",
    price: 15.0,
    description: "Tender and flavorful sirloin steak perfect for grilling or pan cooking.",
    image: `${CDN}/frozen-foods-premium-sirloin-steak/bd293cd6.jpg`,
    inStock: false,
  },
  {
    id: "lean-beef-mince",
    name: "Lean Beef Mince",
    category: "Frozen Foods",
    price: 10.0,
    description: "Quality minced beef ideal for burgers, meatballs, pasta, and homemade dishes.",
    image: `${CDN}/frozen-foods-lean-beef-mince/93b94ec1.jpg`,
    inStock: false,
  },
  {
    id: "tender-chicken-breast-strips",
    name: "Tender Chicken Breast Strips",
    category: "Chicken",
    price: 8.0,
    description: "Convenient chicken breast strips perfect for stir-fries, wraps, and salads.",
    image: `${CDN}/chicken-tender-chicken-breast-strips/8cd160ce.jpg`,
    inStock: false,
  },
  {
    id: "premium-chicken-fillets",
    name: "Premium Chicken Fillets",
    category: "Chicken",
    price: 5.0,
    description: "Boneless chicken fillets prepared for quick and delicious everyday meals.",
    image: `${CDN}/chicken-premium-chicken-fillets/25cca8cb.jpg`,
    inStock: false,
  },
  {
    id: "fresh-chicken-breast",
    name: "Fresh Chicken Breast",
    category: "Chicken",
    price: 10.0,
    description: "Lean and tender chicken breast suitable for grilling, baking, and healthy meals.",
    image: `${CDN}/chicken-fresh-chicken-breast/b439dc5f.jpg`,
    inStock: false,
  },
  {
    id: "creamy-cheddar-slices",
    name: "Creamy Cheddar Slices",
    category: "Cheddar & Mozzarella",
    price: 4.0,
    description: "Convenient sliced cheddar cheese for burgers, sandwiches, and quick snacks.",
    image: `${CDN}/fresh-milk-creamy-cheddar-slices/e5f3fea3.jpg`,
    inStock: false,
  },
  {
    id: "classic-mozzarella-cheese",
    name: "Classic Mozzarella Cheese",
    category: "Cheddar & Mozzarella",
    price: 5.0,
    description: "Smooth and mild mozzarella that melts perfectly on pizzas and pasta.",
    image: `${CDN}/fresh-milk-classic-mozzarella-cheese/cc1f20a4.jpg`,
    inStock: false,
  },
  {
    id: "mature-cheddar-cheese",
    name: "Mature Cheddar Cheese",
    category: "Cheddar & Mozzarella",
    price: 2.0,
    description: "Rich and flavorful mature cheddar cheese, great for sandwiches and cooking.",
    image: `${CDN}/fresh-milk-mature-cheddar-cheese/3f061f19.jpg`,
    inStock: false,
  },
  {
    id: "pure-dairy-cream",
    name: "Pure Dairy Cream",
    category: "Milk & Cream",
    price: 3.0,
    description: "Rich dairy cream perfect for desserts, sauces, soups, and baking.",
    image: `${CDN}/fresh-milk-pure-dairy-cream/1d8f88ef.jpg`,
    inStock: true,
  },
  {
    id: "farm-fresh-low-fat-milk",
    name: "Farm Fresh Low-Fat Milk",
    category: "Fresh Milk",
    price: 2.0,
    description: "Light and refreshing low-fat milk for everyday family consumption.",
    image: `${CDN}/fresh-milk-farm-fresh-low-fat-milk/88d2cc11.jpg`,
    inStock: false,
  },
  {
    id: "fresh-whole-milk-1l",
    name: "Fresh Whole Milk 1L",
    category: "Fresh Milk",
    price: 2.0,
    description: "Smooth and creamy whole milk suitable for drinking, cooking, and baking.",
    image: `${CDN}/fresh-milk-fresh-whole-milk-1l/4c9e1158.jpg`,
    inStock: false,
  },
  {
    id: "crisp-romaine-lettuce",
    name: "Crisp Romaine Lettuce",
    category: "Vegetables",
    price: 1.0,
    description: "Fresh and crunchy romaine lettuce for salads, burgers, and sandwiches.",
    image: `${CDN}/vegetables-crisp-romaine-lettuce/1e975137.jpg`,
    inStock: true,
  },
  {
    id: "organic-baby-spinach",
    name: "Organic Baby Spinach",
    category: "Vegetables",
    price: 2.0,
    description: "Tender baby spinach leaves ideal for healthy salads, wraps, and smoothies.",
    image: `${CDN}/vegetables-organic-baby-spinach/40b59610.jpg`,
    inStock: false,
  },
  {
    id: "fresh-spinach",
    name: "Fresh Spinach",
    category: "Vegetables",
    price: 5.0,
    description: "Fresh leafy spinach packed with flavor, perfect for salads and cooked meals.",
    image: `${CDN}/vegetables-fresh-spinach/f96cd3b0.jpg`,
    inStock: false,
  },
  {
    id: "premium-bananas",
    name: "Premium Bananas",
    category: "Fruits",
    price: 5.0,
    description: "Naturally sweet and creamy bananas, ideal for breakfast, smoothies, or snacks.",
    image: `${CDN}/fruits-premium-bananas/0471e436.jpg`,
    inStock: true,
  },
  {
    id: "royal-gala-apples",
    name: "Royal Gala Apples",
    category: "Fruits",
    price: 2.0,
    description: "Crisp and naturally sweet apples, perfect for snacking or fresh fruit salads.",
    image: `${CDN}/fruits-royal-gala-apples/2479d6b5.jpg`,
    inStock: true,
  },
];

/** The first twelve are what the storefront surfaces as "Popular Products". */
export const POPULAR_PRODUCTS = PRODUCTS.slice(0, 12);

/** Category tree used by the shop sidebar, mirroring production. */
export interface CategoryNode {
  name: string;
  children?: CategoryNode[];
}

export const CATEGORY_TREE: CategoryNode[] = [
  { name: "Snacks" },
  { name: "Frozen Foods" },
  {
    name: "Bakery",
    children: [{ name: "Cakes & Pastries" }, { name: "Bread", children: [{ name: "Whole Wheat Bread" }] }],
  },
  {
    name: "Meat & Poultry",
    children: [{ name: "Beef", children: [{ name: "Minced Beef & Steaks" }] }, { name: "Chicken" }],
  },
  {
    name: "Dairy & Eggs",
    children: [
      { name: "Cheese", children: [{ name: "Cheddar & Mozzarella" }] },
      { name: "Milk & Cream", children: [{ name: "Fresh Milk" }] },
    ],
  },
  { name: "Fresh Produce", children: [{ name: "Vegetables" }, { name: "Fruits" }] },
];

export const formatPrice = (value: number) => value.toFixed(2);

/* ------------------------------------------------------------------ */
/* Admin catalogue metadata                                            */
/* ------------------------------------------------------------------ */

export type StorageType = "Ambient" | "Chilled" | "Frozen";

export interface AdminProductMeta {
  sku: string;
  storage: StorageType;
  batchTracked: boolean;
  brand?: string;
  status: "ACTIVE" | "INACTIVE";
}

export const ADMIN_PRODUCT_META: Record<string, AdminProductMeta> = {
  "low-fat-fresh-milk": { sku: "FRE-000030", storage: "Chilled", batchTracked: false, status: "ACTIVE" },
  "milk-pack": { sku: "FRE-000033", storage: "Chilled", batchTracked: true, brand: "nestle", status: "ACTIVE" },
  "fresh-bell-peppers": { sku: "VEG-000032", storage: "Ambient", batchTracked: true, status: "ACTIVE" },
  "full-cream-fresh-milk": { sku: "FRE-000031", storage: "Chilled", batchTracked: true, status: "ACTIVE" },
  "chicken-wings": { sku: "CHI-000029", storage: "Ambient", batchTracked: false, status: "ACTIVE" },
  "chicken-thigh-fillets": { sku: "CHI-000028", storage: "Ambient", batchTracked: true, status: "ACTIVE" },
  "frozen-vegetable-samosas": { sku: "FRO-000027", storage: "Frozen", batchTracked: true, status: "ACTIVE" },
  "frozen-french-fries": { sku: "FRO-000026", storage: "Frozen", batchTracked: false, status: "ACTIVE" },
  "frozen-chicken-nuggets": { sku: "FRO-000025", storage: "Frozen", batchTracked: false, status: "ACTIVE" },
  "cheese-crackers": { sku: "SNA-000024", storage: "Ambient", batchTracked: false, status: "ACTIVE" },
  "roasted-salted-peanuts": { sku: "SNA-000023", storage: "Ambient", batchTracked: false, status: "ACTIVE" },
  "classic-potato-chips": { sku: "SNA-000022", storage: "Ambient", batchTracked: false, status: "ACTIVE" },
  "garden-vegetable-mix": { sku: "FRO-000021", storage: "Frozen", batchTracked: false, status: "ACTIVE" },
  "four-cheese-frozen-pizza": { sku: "WHO-000020", storage: "Ambient", batchTracked: false, status: "ACTIVE" },
  "multigrain-sandwich-bread": { sku: "WHO-000019", storage: "Ambient", batchTracked: false, status: "ACTIVE" },
  "whole-wheat-bread-loaf": { sku: "WHO-000018", storage: "Ambient", batchTracked: true, status: "ACTIVE" },
  "classic-beef-burgers": { sku: "FRO-000017", storage: "Frozen", batchTracked: true, status: "ACTIVE" },
  "premium-sirloin-steak": { sku: "FRO-000016", storage: "Frozen", batchTracked: true, status: "ACTIVE" },
  "lean-beef-mince": { sku: "FRO-000015", storage: "Frozen", batchTracked: true, status: "ACTIVE" },
  "tender-chicken-breast-strips": { sku: "CHI-000014", storage: "Frozen", batchTracked: true, status: "ACTIVE" },
  "premium-chicken-fillets": { sku: "CHI-000013", storage: "Frozen", batchTracked: false, status: "ACTIVE" },
  "fresh-chicken-breast": { sku: "CHI-000012", storage: "Frozen", batchTracked: true, status: "ACTIVE" },
  "creamy-cheddar-slices": { sku: "FRE-000011", storage: "Chilled", batchTracked: true, status: "ACTIVE" },
  "classic-mozzarella-cheese": { sku: "FRE-000010", storage: "Frozen", batchTracked: true, status: "ACTIVE" },
  "mature-cheddar-cheese": { sku: "FRE-000009", storage: "Frozen", batchTracked: true, status: "ACTIVE" },
  "pure-dairy-cream": { sku: "FRE-000008", storage: "Chilled", batchTracked: false, status: "ACTIVE" },
  "farm-fresh-low-fat-milk": { sku: "FRE-000007", storage: "Ambient", batchTracked: true, status: "ACTIVE" },
  "fresh-whole-milk-1l": { sku: "FRE-000006", storage: "Chilled", batchTracked: true, status: "ACTIVE" },
  "crisp-romaine-lettuce": { sku: "VEG-000005", storage: "Chilled", batchTracked: true, status: "ACTIVE" },
  "organic-baby-spinach": { sku: "VEG-000004", storage: "Ambient", batchTracked: true, status: "ACTIVE" },
  "fresh-spinach": { sku: "VEG-000003", storage: "Ambient", batchTracked: true, status: "ACTIVE" },
  "premium-bananas": { sku: "FRU-000002", storage: "Chilled", batchTracked: true, status: "ACTIVE" },
  "royal-gala-apples": { sku: "FRU-000001", storage: "Ambient", batchTracked: true, status: "ACTIVE" },
};
