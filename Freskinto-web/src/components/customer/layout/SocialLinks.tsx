import Link from "next/link";
import { Box } from "@/components/ui/box";
import { FacebookIcon, InstagramIcon, TikTokIcon, XIcon } from "@/components/ui/brand-icons";
import { Button } from "@/components/ui/button";
import { Flex } from "@/components/ui/flex";
import { STORE } from "@/constants/store";

const NETWORKS = [
  { label: "Instagram", href: STORE.social.instagram, Icon: InstagramIcon },
  { label: "Facebook", href: STORE.social.facebook, Icon: FacebookIcon },
  { label: "X", href: STORE.social.x, Icon: XIcon },
  { label: "TikTok", href: STORE.social.tiktok, Icon: TikTokIcon },
];

/** Dark footer ke liye gol glass icon buttons — har link nayi tab mein khulta hai */
export function SocialLinks({ className }: { className?: string }) {
  return (
    <Flex as="ul" align="center" gap="2" aria-label={`${STORE.name} on social media`} className={className}>
      {NETWORKS.map(({ label, href, Icon }) => (
        <Box as="li" key={label}>
          <Button
            variant="outline"
            size="icon"
            nativeButton={false}
            render={<Link href={href} target="_blank" rel="noopener noreferrer" aria-label={`${STORE.name} on ${label}`} />}
            className="rounded-full border-white/15 bg-white/5 text-white/60 hover:border-fresh/50 hover:bg-white/10 hover:text-white"
          >
            <Icon className="size-4" />
          </Button>
        </Box>
      ))}
    </Flex>
  );
}
