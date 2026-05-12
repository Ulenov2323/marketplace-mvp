import { delay, mockStore } from "./mockStore";

export const marketplaceApi = {
  async bootstrap() {
    return delay({
      services: mockStore.services,
      posts: mockStore.posts,
      ads: mockStore.ads,
      sellers: mockStore.sellers,
      testimonials: mockStore.testimonials
    });
  },

  async createPost(currentUser) {
    const post = {
      id: crypto.randomUUID(),
      author: currentUser?.name ?? "Новый продавец",
      content: "Запускаю пакет продвижения с ручной аналитикой и отчетом по удержанию аудитории.",
      price: 200,
      active: true,
      createdAt: "только что"
    };

    mockStore.posts.unshift(post);
    return delay(post);
  },

  async deletePost(id) {
    mockStore.posts = mockStore.posts.filter((post) => post.id !== id);
    return delay({ ok: true });
  },

  async toggleAd(id) {
    mockStore.ads = mockStore.ads.map((ad) => (ad.id === id ? { ...ad, active: !ad.active } : ad));
    return delay(mockStore.ads.find((ad) => ad.id === id));
  }
};
