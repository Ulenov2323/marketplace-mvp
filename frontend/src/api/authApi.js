import { delay, mockStore } from "./mockStore";

const roleByEmail = {
  "admin@pulse.local": "admin",
  "seller@pulse.local": "seller"
};

export const authApi = {
  async getSession() {
    return delay(mockStore.session);
  },

  async login({ email }) {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = mockStore.users.find((user) => user.email === normalizedEmail);
    const user =
      existingUser ??
      {
        id: crypto.randomUUID(),
        name: normalizedEmail.split("@")[0] || "Пользователь",
        email: normalizedEmail,
        role: roleByEmail[normalizedEmail] ?? "user",
        rating: 4.6,
        verified: false
      };

    if (!existingUser) {
      mockStore.users.push(user);
    }

    mockStore.session = { user };
    return delay(mockStore.session);
  },

  async register({ name, email, role = "user" }) {
    const user = {
      id: crypto.randomUUID(),
      name: name.trim() || "Новый пользователь",
      email: email.trim().toLowerCase(),
      role,
      rating: 4.6,
      verified: role === "seller"
    };

    mockStore.users.push(user);
    mockStore.session = { user };
    return delay(mockStore.session);
  },

  async logout() {
    mockStore.session = null;
    return delay({ ok: true });
  }
};
