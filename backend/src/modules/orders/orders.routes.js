import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../../shared/async-handler.js";
import { HttpError } from "../../shared/http-error.js";
import { store } from "../../shared/in-memory-store.js";
import { telegramNotifier } from "../telegram/telegram.service.js";

export const ordersRouter = Router();

const orderSchema = z.object({
  serviceId: z.string().min(1),
  buyerId: z.string().min(1)
});

ordersRouter.get("/", (_req, res) => {
  res.json({ data: store.orders });
});

ordersRouter.post("/", asyncHandler(async (req, res) => {
  const payload = orderSchema.parse(req.body);
  const service = store.services.find((item) => item.id === payload.serviceId);
  if (!service || service.status !== "approved") {
    throw new HttpError(422, "Only approved services can be ordered");
  }

  const order = {
    id: crypto.randomUUID(),
    ...payload,
    status: "created"
  };

  store.orders.unshift(order);
  await telegramNotifier.orderCreated(order);
  res.status(201).json({ data: order });
}));
