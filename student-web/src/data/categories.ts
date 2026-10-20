export type CategoryType = "Main Category" | "Sub Category" | "Leaf Category";

export interface AdminCategory {
  name: string;
  description: string;
  type: CategoryType;
  image: string;
  status: "ACTIVE" | "INACTIVE";
}

const CDN = "/media/categories";

export const ADMIN_CATEGORIES: AdminCategory[] = [
  {
    name: "Snacks",
    description: "Tasty snacks and quick bites for any time of the day.",
    type: "Main Category",
    image: `${CDN}/cb31f224.jpg`,
    status: "ACTIVE",
  },
  {
    name: "Frozen Foods",
    description: "Convenient frozen food options that are quick and easy to prepare.",
    type: "Main Category",
    image: `${CDN}/0f956e83.jpg`,
    status: "ACTIVE",
  },
  {
    name: "Bakery",
    description: "Freshly baked bread, cakes, and pastries for every occasion.",
    type: "Main Category",
    image: `${CDN}/84de47f9.jpg`,
    status: "ACTIVE",
  },
  {
    name: "Cakes & Pastries",
    description: "Delicious cakes and pastries for celebrations and sweet treats.",
    type: "Leaf Category",
    image: `${CDN}/e67ff9e0.jpg`,
    status: "ACTIVE",
  },
  {
    name: "Bread",
    description: "Fresh bread varieties for breakfast and everyday meals.",
    type: "Sub Category",
    image: `${CDN}/f29aba0f.jpg`,
    status: "ACTIVE",
  },
  {
    name: "Whole Wheat Bread",
    description: "Wholesome whole wheat bread with a rich, hearty texture.",
    type: "Leaf Category",
    image: `${CDN}/5482a86c.jpg`,
    status: "ACTIVE",
  },
  {
    name: "Meat & Poultry",
    description: "Quality meat and poultry cuts for delicious homemade meals.",
    type: "Main Category",
    image: `${CDN}/72aedb48.jpg`,
    status: "ACTIVE",
  },
  {
    name: "Beef",
    description: "Fresh beef cuts for steaks, burgers, and homemade dishes.",
    type: "Sub Category",
    image: `${CDN}/9664e3fa.jpg`,
    status: "ACTIVE",
  },
  {
    name: "Minced Beef & Steaks",
    description: "Versatile minced beef and quality steaks for hearty meals.",
    type: "Leaf Category",
    image: `${CDN}/503e4858.jpg`,
    status: "ACTIVE",
  },
  {
    name: "Chicken",
    description: "Fresh chicken cuts suitable for a variety of recipes.",
    type: "Leaf Category",
    image: `${CDN}/ef3ac14b.jpg`,
    status: "ACTIVE",
  },
  {
    name: "Dairy & Eggs",
    description: "Fresh dairy products and eggs for everyday cooking and breakfast.",
    type: "Main Category",
    image: `${CDN}/dcf14d04.jpg`,
    status: "ACTIVE",
  },
  {
    name: "Cheese",
    description: "A selection of delicious cheeses for meals and snacks.",
    type: "Sub Category",
    image: `${CDN}/dfa91b48.jpg`,
    status: "ACTIVE",
  },
  {
    name: "Cheddar & Mozzarella",
    description: "Popular cheeses perfect for sandwiches, pizza, and cooking.",
    type: "Leaf Category",
    image: `${CDN}/0033c5ef.jpg`,
    status: "ACTIVE",
  },
  {
    name: "Milk & Cream",
    description: "Fresh milk and cream for drinks, cooking, and baking.",
    type: "Sub Category",
    image: `${CDN}/c6f141f6.jpg`,
    status: "ACTIVE",
  },
  {
    name: "Fresh Milk",
    description: "Smooth and creamy milk suitable for daily consumption.",
    type: "Leaf Category",
    image: `${CDN}/9a6547a2.jpg`,
    status: "ACTIVE",
  },
  {
    name: "Fresh Produce",
    description: "Fresh fruits and vegetables for healthy everyday meals.",
    type: "Main Category",
    image: `${CDN}/03ea0643.jpg`,
    status: "ACTIVE",
  },
  {
    name: "Vegetables",
    description: "Fresh vegetables for salads, cooking, and healthy recipes.",
    type: "Leaf Category",
    image: `${CDN}/f69f8d9f.jpg`,
    status: "ACTIVE",
  },
  {
    name: "Fruits",
    description: "Fresh and naturally sweet fruits for snacks and meals.",
    type: "Leaf Category",
    image: `${CDN}/ac6c0027.jpg`,
    status: "ACTIVE",
  },
];
