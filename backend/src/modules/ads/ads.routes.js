import { Router } from "express";
import { z } from "zod";
import { store } from "../../shared/in-memory-store.js";

export const adsRouter = Router();

const adPostSchema = z.object({
  content: z.string().min(5),
  ownerId: z.string().min(1)
});

adsRouter.get("/", (_req, res) => {
  res.json({ data: store.adPosts.filter((post) => post.active) });
});

adsRouter.post("/", (req, res) => {
  const payload = adPostSchema.parse(req.body);
  const post = {
    id: crypto.randomUUID(),
    ...payload,
    price: 200,
    active: true
  };

  store.adPosts.unshift(post);
  res.status(201).json({ data: post });
});

adsRouter.get("/banners/active", (_req, res) => {
  res.json({ data: store.bannerAds.filter((ad) => ad.active) });
});
