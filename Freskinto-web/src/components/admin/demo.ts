import { toast } from "sonner";
import type { StatusTone } from "@/components/shared/StatusBadge";
import type { CampaignStatus } from "@/data/admin";

/** Static mock screens par action buttons — sach batao ke yeh preview hai */
export function demoAction(action = "This action", description = "This screen is a design preview with sample data."): void {
  toast.info(`${action} isn't connected yet`, { description });
}

/** Coupons aur promotions dono ka status rang */
export const CAMPAIGN_TONES: Record<CampaignStatus, StatusTone> = {
  Active: "success",
  Scheduled: "info",
  Expired: "neutral",
};
