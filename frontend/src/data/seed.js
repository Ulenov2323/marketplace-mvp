export const marketplaceSeed = {
  services: [
    {
      id: "s1",
      title: "TikTok growth launch pack",
      description: "Audience research, content hooks, creator seeding, and a 7-day engagement boost plan.",
      category: "TikTok promotion",
      price: 3490,
      ownerId: "u1",
      ownerName: "ViralDesk",
      ownerRating: 4.9,
      status: "approved",
      reviews: [{ rating: 5, text: "Fast delivery and clean analytics report." }]
    },
    {
      id: "s2",
      title: "Monetized YouTube channel",
      description: "Verified niche channel with stable history, clean handover checklist, and onboarding support.",
      category: "YouTube account sales",
      price: 42000,
      ownerId: "u2",
      ownerName: "ChannelVault",
      ownerRating: 4.7,
      status: "approved",
      reviews: [{ rating: 5, text: "Account transfer was transparent and organized." }]
    },
    {
      id: "s3",
      title: "Instagram creator boost",
      description: "Profile audit, reel packaging, warm traffic placement, and performance snapshot.",
      category: "Instagram promotion",
      price: 2800,
      ownerId: "u3",
      ownerName: "ReelPilot",
      ownerRating: 4.8,
      status: "approved",
      reviews: [{ rating: 4, text: "Good results for a short campaign." }]
    },
    {
      id: "s4",
      title: "YouTube Shorts retention boost",
      description: "Shorts title testing, thumbnail system, and distribution strategy for 10 clips.",
      category: "YouTube promotion",
      price: 5900,
      ownerId: "u4",
      ownerName: "ShortsLab",
      ownerRating: 5,
      status: "pending",
      reviews: []
    }
  ],
  posts: [
    {
      id: "p1",
      author: "ViralDesk",
      content: "Открыли 3 слота на TikTok пакет: аудит ниши, гипотезы по хукам и отчет по удержанию.",
      price: 200,
      active: true,
      createdAt: "12 min ago"
    },
    {
      id: "p2",
      author: "ChannelVault",
      content: "Есть два YouTube канала под англоязычный tech-ниша. Передача через безопасный чеклист.",
      price: 200,
      active: true,
      createdAt: "1 h ago"
    }
  ],
  ads: [
    {
      id: "a1",
      title: "Creator launch week",
      copy: "Featured creators receive top homepage placement and boosted marketplace discovery.",
      active: true,
      price: 2500
    },
    {
      id: "a2",
      title: "Trusted channel sale",
      copy: "Promoted banner for verified YouTube account sellers with high-intent buyer traffic.",
      active: true,
      price: 2500
    }
  ]
};
