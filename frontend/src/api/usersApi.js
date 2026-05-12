import { delay, mockStore } from "./mockStore";

export const usersApi = {
  async listSellers() {
    return delay(mockStore.sellers);
  },

  async profile(id) {
    const user = mockStore.users.find((item) => item.id === id);
    const services = mockStore.services.filter((service) => service.ownerId === id);
    return delay({ ...user, services });
  }
};
