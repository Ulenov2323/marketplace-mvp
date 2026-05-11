import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../../shared/async-handler.js";
import { HttpError } from "../../shared/http-error.js";
import { store } from "../../shared/in-memory-store.js";
import { telegramNotifier } from "../telegram/telegram.service.js";

export const servicesRouter = Router();

const createServiceSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.enum(["TikTok promotion", "YouTube promotion", "Instagram promotion", "YouTube account sales"]),
  price: z.number().positive(),
  ownerId: z.string().min(1)
});

servicesRouter.get("/", (req, res) => {
  const status = req.query.status ?? "approved";
  const category = req.query.category;
  const services = store.services.filter((service) => {
    const statusMatch = status === "all" || service.status === status;
    const categoryMatch = !category || service.category === category;
    return statusMatch && categoryMatch;
  });

  res.json({ data: services });
});

servicesRouter.post("/", asyncHandler(async (req, res) => {
  const payload = createServiceSchema.parse(req.body);
  const service = {
    id: crypto.randomUUID(),
    ...payload,
    status: "pending",
    placementFee: 250
  };

  store.services.unshift(service);
  await telegramNotifier.moderationRequired(service);
  res.status(201).json({ data: service });
}));

servicesRouter.get("/:id", (req, res) => {
  const service = store.services.find((item) => item.id === req.params.id);
  if (!service) throw new HttpError(404, "Service not found");
  res.json({ data: service });
});
