import { CreditCard, PackageCheck, Search, ShoppingBasket } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Text } from "@/components/ui/typography";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { STORE } from "@/constants/store";
import { cn } from "@/lib/utils";

/** Store ka asli flow (FLOW-MD 01) — basket → checkout → pay → track */
const STEPS = [
  { icon: Search, title: "Find it", text: "Search or wander the aisles — prices are the shelf prices you pay.", tone: "bg-lime text-lime-foreground" },
  { icon: ShoppingBasket, title: "Fill your basket", text: "Your basket is saved to your account, on every device.", tone: "bg-tangerine text-tangerine-foreground" },
  { icon: CreditCard, title: "Pay in minutes", text: `Your order is confirmed the moment you pay — within ${STORE.paymentWindowMinutes} minutes.`, tone: "bg-primary text-primary-foreground" },
  { icon: PackageCheck, title: "Delivered or collected", text: "Free delivery to your door, or pick a click & collect slot.", tone: "bg-night text-night-foreground" },
];

const FAQS = [
  {
    q: "Is delivery really free?",
    a: "Yes — delivery costs nothing on every order, and there's no minimum spend.",
  },
  {
    q: "How does click & collect work?",
    a: `Choose a collection day and hour at checkout (${STORE.pickup.openHour}am–${STORE.pickup.closeHour - 12}pm). We'll have it packed and waiting at the counter.`,
  },
  {
    q: "When is my order confirmed?",
    a: `As soon as your payment goes through. Unpaid orders are released after ${STORE.paymentWindowMinutes} minutes so the stock goes back on the shelf.`,
  },
  {
    q: "Can I cancel an order?",
    a: "Yes, any time before we start packing it — straight from your order page.",
  },
];

/** "How it works" — 4 numbered steps + FAQ accordion (sab asli store rules) */
export function HomeHowItWorks() {
  return (
    <Stack as="section" aria-labelledby="how-heading" gap="8">
      <SectionHeading
        id="how-heading"
        eyebrow="The Freskinto way"
        title="Better Groceries. Better Planet. Better Price."
        description="Four steps from shelf to table — and answers to what people ask most."
      />
      <Grid gap="6" className="lg:grid-cols-12">
        <Grid gap="4" className="sm:grid-cols-2 lg:col-span-7">
          {STEPS.map(({ icon: Icon, title, text, tone }, index) => (
            <Card key={title} className="pop-hover gap-3 rounded-3xl border-2 shadow-none">
              <CardHeader>
                <Flex align="center" justify="between">
                  <Flex
                    align="center"
                    justify="center"
                    className={cn("size-12 rounded-2xl transition-transform group-hover/card:-rotate-6", tone)}
                  >
                    <Icon aria-hidden="true" className="size-6" />
                  </Flex>
                  <Text as="span" family="heading" weight="extrabold" tone="muted" className="text-4xl opacity-30">
                    0{index + 1}
                  </Text>
                </Flex>
              </CardHeader>
              <CardContent className="flex flex-col gap-1.5">
                <CardTitle className="text-xl font-bold">{title}</CardTitle>
                <CardDescription>{text}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </Grid>
        <Card className="rounded-3xl border-2 shadow-none lg:col-span-5">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Good to know</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion defaultValue={[FAQS[0].q]}>
              {FAQS.map((faq) => (
                <AccordionItem key={faq.q} value={faq.q}>
                  <AccordionTrigger className="py-4 text-base font-semibold hover:no-underline">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </Grid>
    </Stack>
  );
}
