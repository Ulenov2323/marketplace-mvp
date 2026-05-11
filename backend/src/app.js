import cors from "cors";
import express from "express";
import helmet from "helmet";
import { adminRouter } from "./modules/admin/admin.routes.js";
import { adsRouter } from "./modules/ads/ads.routes.js";
import { ordersRouter } from "./modules/orders/orders.routes.js";
import { paymentRouter } from "./modules/payments/payment.routes.js";
import { reviewsRouter } from "./modules/reviews/reviews.routes.js";
import { servicesRouter } from "./modules/services/services.routes.js";
import { telegramRouter } from "./modules/telegram/telegram.routes.js";
import { usersRouter } from "./modules/users/users.routes.js";
import { errorHandler } from "./shared/error-handler.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "hybrid-marketplace-api" });
  });

  app.use("/api/services", servicesRouter);
  app.use("/api/ad-posts", adsRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/reviews", reviewsRouter);
  app.use("/api/payments", paymentRouter);
  app.use("/api/telegram", telegramRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/admin", adminRouter);
  app.use(errorHandler);

  return app;
}
