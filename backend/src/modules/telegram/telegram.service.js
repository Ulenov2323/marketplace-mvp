import { env } from "../../config/env.js";

export const telegramNotifier = {
  supportLink() {
    return env.telegramSupportUrl;
  },

  async orderCreated(order) {
    if (!env.telegramBotToken) {
      return { skipped: true, reason: "TELEGRAM_BOT_TOKEN is not configured", orderId: order.id };
    }

    return {
      queued: true,
      type: "order.created",
      orderId: order.id
    };
  },

  async moderationRequired(service) {
    if (!env.telegramBotToken) {
      return { skipped: true, reason: "TELEGRAM_BOT_TOKEN is not configured", serviceId: service.id };
    }

    return {
      queued: true,
      type: "service.moderation_required",
      serviceId: service.id
    };
  }
};
