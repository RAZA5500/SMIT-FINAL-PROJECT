"use client";

import { Container } from "@/components/ui/container";
import { HomeAisles } from "@/components/customer/home/HomeAisles";
import { HomeHero } from "@/components/customer/home/HomeHero";
import { HomeHowItWorks } from "@/components/customer/home/HomeHowItWorks";
import { HomeJoinBanner } from "@/components/customer/home/HomeJoinBanner";
import { HomeMarketBox } from "@/components/customer/home/HomeMarketBox";
import { HomeShelves } from "@/components/customer/home/HomeShelves";
import { HomeTestimonials } from "@/components/customer/home/HomeTestimonials";

export function HomeView() {
  return (
    <Container className="flex flex-col gap-16 py-6 sm:gap-24 sm:py-8">
      <HomeHero />
      <HomeShelves />
      <HomeAisles />
      <HomeMarketBox />
      <HomeHowItWorks />
      <HomeTestimonials />
      <HomeJoinBanner />
    </Container>
  );
}
