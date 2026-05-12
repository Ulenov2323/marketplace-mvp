import { delay, mockStore } from "./mockStore";

export const reviewsApi = {
  async listByService(serviceId) {
    const service = mockStore.services.find((item) => item.id === serviceId);
    return delay(service?.reviews ?? []);
  },

  async create(serviceId, payload) {
    const service = mockStore.services.find((item) => item.id === serviceId);
    const review = {
      id: crypto.randomUUID(),
      serviceId,
      rating: payload.rating,
      text: payload.text
    };

    if (service) {
      service.reviews.unshift(review);
    }

    return delay(review);
  }
};
