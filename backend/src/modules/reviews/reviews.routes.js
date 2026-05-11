import { Router } from "express";
import { z } from "zod";
import { store } from "../../shared/in-memory-store.js";

export const reviewsRouter = Router();

const reviewSchema = z.object({
  serviceId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(3).max(600)
});

reviewsRouter.get("/service/:serviceId", (req, res) => {
  res.json({ data: store.reviews.filter((review) => review.serviceId === req.params.serviceId) });
});

reviewsRouter.post("/", (req, res) => {
  const payload = reviewSchema.parse(req.body);
  const review = { id: crypto.randomUUID(), ...payload };
  store.reviews.unshift(review);
  res.status(201).json({ data: review });
});
