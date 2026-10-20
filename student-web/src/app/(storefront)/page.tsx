import HeroSection from "@/components/customer/HeroSection";
import CategorySection from "@/components/customer/CategorySection";
import FreeDeliveryBanner from "@/components/customer/FreeDeliveryBanner";
import FreshDealsSection from "@/components/customer/FreshDealsSection";
import PromotionsSection from "@/components/customer/PromotionsSection";
import ReviewsSection from "@/components/customer/ReviewsSection";

export default function Home() {
  return (
    <>
      <HeroSection />

      <div className="space-y-10 sm:space-y-20 py-10">
        <CategorySection />
        <FreeDeliveryBanner />
        <FreshDealsSection />
        <PromotionsSection />
        <ReviewsSection />
      </div>
    </>
  );
}
