import { delay, mockStore } from "./mockStore";

export const servicesApi = {
  async list({ status = "all", category } = {}) {
    const services = mockStore.services.filter((service) => {
      const statusMatch = status === "all" || service.status === status;
      const categoryMatch = !category || category === "Все" || service.category === category;
      return statusMatch && categoryMatch;
    });

    return delay(services);
  },

  async create(payload, currentUser) {
    const service = {
      id: crypto.randomUUID(),
      ...payload,
      ownerId: currentUser?.id ?? "guest",
      ownerName: currentUser?.name ?? "Новый продавец",
      ownerRating: currentUser?.rating ?? 4.8,
      orders: 0,
      delivery: "по договоренности",
      badges: ["Новое"],
      status: "pending",
      reviews: []
    };

    mockStore.services.unshift(service);
    return delay(service);
  },

  async approve(id) {
    mockStore.services = mockStore.services.map((service) =>
      service.id === id ? { ...service, status: "approved" } : service
    );
    return delay(mockStore.services.find((service) => service.id === id));
  },

  async reject(id) {
    mockStore.services = mockStore.services.map((service) =>
      service.id === id ? { ...service, status: "rejected" } : service
    );
    return delay(mockStore.services.find((service) => service.id === id));
  }
};
