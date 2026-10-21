import { CategoryRails } from "@/components/customer/home/CategoryRails";
import { CategoryShowcase } from "@/components/customer/home/CategoryShowcase";
import { EditorialCollections } from "@/components/customer/home/EditorialCollections";
import { HeroSection } from "@/components/customer/home/HeroSection";
import { HowItWorks } from "@/components/customer/home/HowItWorks";
import { JoinCta } from "@/components/customer/home/JoinCta";
import { NewArrivals } from "@/components/customer/home/NewArrivals";
import { PromoBand } from "@/components/customer/home/PromoBand";
import { ReviewsSection } from "@/components/customer/home/ReviewsSection";

/**
 * Home: hero → aisles → newest products → delivery promise → aisle shelves →
 * collections → how it works → reviews → account CTA.
 */
export default function Home() {
  return (
    <div className="flex flex-col gap-14 pb-16 sm:gap-20 sm:pb-24">
      <HeroSection />
      <CategoryShowcase />
      <NewArrivals />
      <PromoBand />
      <CategoryRails />
      <EditorialCollections />
      <HowItWorks />
      <ReviewsSection />
      <JoinCta />
    </div>
  );
}
