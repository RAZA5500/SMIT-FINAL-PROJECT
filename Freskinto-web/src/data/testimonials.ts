/**
 * Customer testimonials (static content — user decision). Featured ones appear in
 * the home page "Loved locally" reviews section; the admin Testimonials screen previews
 * how they would be managed.
 */
export interface Testimonial {
  id: string;
  customer: string;
  photo: string;
  rating: number;
  text: string;
  source: "Email" | "Survey" | "In person";
  date: string;
  /** Shown in the home page "Loved locally" reviews section */
  featured: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
  { id: "t1", customer: "Charlotte D.", photo: "/images/avatars/charlotte.webp", rating: 5, text: "Absolutely brilliant. The bakery items were fresh and delicious — I'll definitely order again.", source: "Email", date: "01 Sep 2026", featured: true },
  { id: "t2", customer: "Jack H.", photo: "/images/avatars/jack.webp", rating: 4, text: "Plenty of choice and very convenient. The order arrived well chilled and nicely packed.", source: "Survey", date: "02 Sep 2026", featured: true },
  { id: "t3", customer: "Sophie W.", photo: "/images/avatars/sophie.webp", rating: 5, text: "Everything was packed carefully and arrived in perfect condition. Really happy with the quality.", source: "Survey", date: "05 Sep 2026", featured: true },
  { id: "t4", customer: "Oliver B.", photo: "/images/avatars/oliver.webp", rating: 5, text: "A great range and a very easy ordering process. Delivery was quick too.", source: "Email", date: "09 Sep 2026", featured: true },
  { id: "t5", customer: "Emily T.", photo: "/images/avatars/emily.webp", rating: 5, text: "The fresh produce was lovely and lasted really well. Excellent service.", source: "In person", date: "12 Sep 2026", featured: true },
  { id: "t6", customer: "James W.", photo: "/images/avatars/james.webp", rating: 5, text: "Really pleased with my order. Everything arrived fresh, well packaged and right on time.", source: "Email", date: "18 Sep 2026", featured: true },
  { id: "t7", customer: "Harry J.", photo: "/images/avatars/harry.webp", rating: 3, text: "Good products; my delivery was a little later than expected.", source: "Survey", date: "20 Sep 2026", featured: false },
];
