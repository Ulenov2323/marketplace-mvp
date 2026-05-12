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
  ]
};
