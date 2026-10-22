import { AisleDirectory } from "@/components/customer/home/AisleDirectory";
import { AisleShelves } from "@/components/customer/home/AisleShelves";
import { FulfilmentTabs } from "@/components/customer/home/FulfilmentTabs";
import { HeroSection } from "@/components/customer/home/HeroSection";
import { HowItWorks } from "@/components/customer/home/HowItWorks";
import { JoinCta } from "@/components/customer/home/JoinCta";
import { NeighbourNotes } from "@/components/customer/home/NeighbourNotes";
import { NewArrivals } from "@/components/customer/home/NewArrivals";
import { Stack } from "@/components/ui/flex";
import { cn } from "@/lib/utils";

/**
 * Home: hero → aisle directory → newest products → delivery vs collection →
 * aisle shelves → how it works → neighbour notes → account CTA.
 */
export default function Home() {
  return (
    <Stack gap="16" className={cn("pb-16 sm:gap-24 sm:pb-24")}>
      <HeroSection />
      <AisleDirectory />
      <NewArrivals />
      <FulfilmentTabs />
      <AisleShelves />
      <HowItWorks />
      <NeighbourNotes />
      <JoinCta />
    </Stack>
  );
}
