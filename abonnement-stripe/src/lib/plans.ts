// Les priceId viennent du Dashboard Stripe
export const plans = [
  {
    name: "Basic",
    price: 10,
    level: 1,
    priceId: process.env.NEXT_PUBLIC_PRICE_BASIC ?? "",
    features: ["Basic Feature 1", "Basic Feature 2"],
  },
  {
    name: "Premium",
    price: 25,
    level: 2,
    priceId: process.env.NEXT_PUBLIC_PRICE_PREMIUM ?? "",
    features: ["Premium Feature 1", "Premium Feature 2"],
  },
  {
    name: "Pro",
    price: 50,
    level: 3,
    priceId: process.env.NEXT_PUBLIC_PRICE_PRO ?? "",
    features: ["Pro Feature 1", "Pro Feature 2"],
  },
];

export const findPlan = (priceId?: string | null) =>
  plans.find((p) => p.priceId && p.priceId === priceId);
