export const marketplaceSeed = {
  services: [
    {
      id: "s1",
      title: "Стартовый пакет продвижения TikTok",
      description: "Анализ аудитории, идеи для хуков, посев у авторов и план вовлечения на 7 дней.",
      category: "Продвижение TikTok",
      price: 3490,
      ownerId: "u1",
      ownerName: "ViralDesk",
      ownerRating: 4.9,
      orders: 184,
      delivery: "2-3 дня",
      badges: ["Проверен", "Топ"],
      status: "approved",
      reviews: [{ rating: 5, text: "Быстрое выполнение и понятный отчет по аналитике." }]
    },
    {
      id: "s2",
      title: "Монетизированный YouTube-канал",
      description: "Проверенный нишевый канал с чистой историей, чек-листом передачи и поддержкой после сделки.",
      category: "Продажа YouTube-аккаунтов",
      price: 42000,
      ownerId: "u2",
      ownerName: "ChannelVault",
      ownerRating: 4.7,
      orders: 63,
      delivery: "1 день",
      badges: ["Проверен"],
      status: "approved",
      reviews: [{ rating: 5, text: "Передача аккаунта прошла прозрачно и спокойно." }]
    },
    {
      id: "s3",
      title: "Буст Instagram-профиля",
      description: "Аудит профиля, упаковка Reels, теплый трафик и короткий отчет по результатам.",
      category: "Продвижение Instagram",
      price: 2800,
      ownerId: "u3",
      ownerName: "ReelPilot",
      ownerRating: 4.8,
      orders: 119,
      delivery: "24 часа",
      badges: ["Новое", "Проверен"],
      status: "approved",
      reviews: [{ rating: 4, text: "Хороший результат для короткой кампании." }]
    },
    {
      id: "s4",
      title: "Удержание для YouTube Shorts",
      description: "Тестирование заголовков, система обложек и стратегия дистрибуции для 10 роликов.",
      category: "Продвижение YouTube",
      price: 5900,
      ownerId: "u4",
      ownerName: "ShortsLab",
      ownerRating: 5,
      orders: 42,
      delivery: "3 дня",
      badges: ["Топ"],
      status: "pending",
      reviews: []
    }
  ],
  posts: [
    {
      id: "p1",
      author: "ViralDesk",
      content: "Открыли 3 слота на TikTok-пакет: аудит ниши, гипотезы по хукам и отчет по удержанию.",
      price: 200,
      active: true,
      createdAt: "12 минут назад"
    },
    {
      id: "p2",
      author: "ChannelVault",
      content: "Есть два YouTube-канала под англоязычную tech-нишу. Передача через безопасный чек-лист.",
      price: 200,
      active: true,
      createdAt: "1 час назад"
    }
  ],
  ads: [
    {
      id: "a1",
      title: "Неделя запуска авторов",
      copy: "Премиальное размещение на главной странице и усиленная видимость внутри маркетплейса.",
      active: true,
      price: 2500
    },
    {
      id: "a2",
      title: "Проверенная продажа канала",
      copy: "Рекламный баннер для продавцов YouTube-аккаунтов с горячей аудиторией покупателей.",
      active: true,
      price: 2500
    }
  ],
  sellers: [
    { id: "u1", name: "ViralDesk", role: "TikTok продвижение", rating: 4.9, orders: 184, verified: true },
    { id: "u2", name: "ChannelVault", role: "YouTube аккаунты", rating: 4.7, orders: 63, verified: true },
    { id: "u3", name: "ReelPilot", role: "Instagram Reels", rating: 4.8, orders: 119, verified: true }
  ],
  testimonials: [
    {
      id: "t1",
      name: "Артем",
      text: "Удобный формат: сразу видно продавца, рейтинг, цену и условия. Для MVP выглядит убедительно.",
      rating: 5
    },
    {
      id: "t2",
      name: "Марина",
      text: "Нравится, что услуги проходят модерацию, а поддержка вынесена в Telegram.",
      rating: 5
    },
    {
      id: "t3",
      name: "Илья",
      text: "Похоже на настоящий marketplace: есть категории, объявления, реклама и админка.",
      rating: 4
    }
  ]
};
