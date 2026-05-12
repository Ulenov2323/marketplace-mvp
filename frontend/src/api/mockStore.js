import { marketplaceSeed } from "../data/seed";

export const mockStore = {
  services: structuredClone(marketplaceSeed.services),
  posts: structuredClone(marketplaceSeed.posts),
  ads: structuredClone(marketplaceSeed.ads),
  sellers: structuredClone(marketplaceSeed.sellers),
  testimonials: structuredClone(marketplaceSeed.testimonials),
  users: [
    {
      id: "guest",
      name: "Гость",
      email: "",
      role: "guest",
      rating: 0,
      verified: false
    },
    {
      id: "u-seller",
      name: "Demo Seller",
      email: "seller@pulse.local",
      role: "seller",
      rating: 4.8,
      verified: true
    },
    {
      id: "u-admin",
      name: "Demo Admin",
      email: "admin@pulse.local",
      role: "admin",
      rating: 5,
      verified: true
    }
  ],
  session: null
};

export function delay(data, timeout = 180) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(structuredClone(data)), timeout);
  });
}
