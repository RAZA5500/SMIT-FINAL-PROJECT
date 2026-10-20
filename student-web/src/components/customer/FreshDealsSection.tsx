"use client";

import Link from "next/link";
import { useState } from "react";
import { POPULAR_PRODUCTS } from "@/data/products";
import { useCart } from "@/context/CartContext";
import ProductCard from "./ProductCard";

export default function FreshDealsSection() {
  const { cart, addToCart, removeFromCart } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleQuantityChange = (id: string, delta: number) => {
    setQuantities((prev) => {
      const next = Math.max(1, (prev[id] || 1) + delta);
      return { ...prev, [id]: next };
    });
    if (delta < 0 && cart[id]) removeFromCart(id);
  };

  const handleAddToCart = (id: string) => {
    const qty = quantities[id] || 1;
    for (let i = 0; i < qty; i++) addToCart(id);
  };

  return (
    <section>
      <div className="product-container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="section-heading">Popular Products</h2>
          <Link
            className="inline-flex items-center gap-3 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 text-brand-green transition-opacity"
            href="/shop"
          >
            <span className="text-sm md:text-base leading-none">View All</span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-2 md:w-4 h-2 md:h-4"
            >
              <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M13 5L20 12L13 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {POPULAR_PRODUCTS.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              quantity={quantities[p.id] || 1}
              onQuantityChange={handleQuantityChange}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
