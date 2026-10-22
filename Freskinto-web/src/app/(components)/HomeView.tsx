"use client";

import { Container } from "@/components/ui/container";
import { HomeAisles } from "@/components/customer/home/HomeAisles";
import { HomeHero } from "@/components/customer/home/HomeHero";
import { HomeShelves } from "@/components/customer/home/HomeShelves";

/** Home: hero → aisles → popular products. Kam sections, zyada saans. */
export function HomeView() {
  return (
    <Container className="flex flex-col gap-20 py-10 sm:gap-24 sm:py-16">
      <HomeHero />
      <HomeAisles />
      <HomeShelves />
    </Container>
  );
}
