import { PackageCheck, Store, Truck } from "lucide-react";

/** Sirf asli features: shipping hamesha 0, pickup slot, order timeline */
const MESSAGES = [
  { icon: Truck, text: "Free delivery on every order" },
  { icon: Store, text: "Click & collect at a time that suits you" },
  { icon: PackageCheck, text: "Track every order from basket to doorstep" },
];

function Message({ icon: Icon, text }: (typeof MESSAGES)[number]) {
  return (
    <span className="inline-flex shrink-0 items-center gap-2">
      <Icon className="size-3.5 text-brand" aria-hidden="true" />
      {text}
    </span>
  );
}

export function AnnouncementBar() {
  return (
    <div className="border-b bg-muted text-xs font-medium text-foreground/80">
      <div className="container-page hidden h-9 items-center justify-center gap-10 md:flex">
        {MESSAGES.map((message) => (
          <Message key={message.text} {...message} />
        ))}
      </div>
      {/* Phone: ek line ka marquee — doosri copy sirf seamless loop ke liye */}
      <div className="flex h-8 items-center overflow-hidden md:hidden">
        <div className="flex w-max animate-marquee gap-10 pr-10">
          {MESSAGES.map((message) => (
            <Message key={message.text} {...message} />
          ))}
          <div className="flex gap-10" aria-hidden="true">
            {MESSAGES.map((message) => (
              <Message key={message.text} {...message} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
