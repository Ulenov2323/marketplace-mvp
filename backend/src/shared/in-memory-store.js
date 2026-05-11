export const store = {
  users: [
    { id: "u1", name: "ViralDesk", email: "viral@example.com", rating: 4.9, verified: true },
    { id: "u2", name: "ChannelVault", email: "vault@example.com", rating: 4.7, verified: true }
  ],
  services: [
    {
      id: "s1",
      title: "TikTok growth launch pack",
      description: "Audience research, hooks, seeding, and engagement boost plan.",
      category: "TikTok promotion",
      price: 3490,
      ownerId: "u1",
      status: "approved"
    },
    {
      id: "s2",
      title: "YouTube Shorts retention boost",
      description: "Shorts title testing, thumbnail system, and distribution strategy.",
      category: "YouTube promotion",
      price: 5900,
      ownerId: "u2",
      status: "pending"
    }
  ],
  orders: [],
  reviews: [{ id: "r1", serviceId: "s1", rating: 5, text: "Fast delivery and clean report." }],
  adPosts: [
    { id: "p1", content: "Открыли 3 слота на TikTok пакет.", price: 200, active: true, ownerId: "u1" }
  ],
  bannerAds: [
    { id: "a1", title: "Creator launch week", price: 2500, active: true, durationHours: 48 }
  ]
};
