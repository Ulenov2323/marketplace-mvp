import { Router } from "express";
import { HttpError } from "../../shared/http-error.js";
import { store } from "../../shared/in-memory-store.js";

export const adminRouter = Router();

adminRouter.get("/queue", (_req, res) => {
  res.json({
    data: {
      pendingServices: store.services.filter((service) => service.status === "pending"),
      adPosts: store.adPosts,
      bannerAds: store.bannerAds
    }
  });
});

adminRouter.patch("/services/:id/approve", (req, res) => {
  const service = store.services.find((item) => item.id === req.params.id);
  if (!service) throw new HttpError(404, "Service not found");
  service.status = "approved";
  res.json({ data: service });
});

adminRouter.patch("/services/:id/reject", (req, res) => {
  const service = store.services.find((item) => item.id === req.params.id);
  if (!service) throw new HttpError(404, "Service not found");
  service.status = "rejected";
  res.json({ data: service });
});

adminRouter.delete("/ad-posts/:id", (req, res) => {
  const index = store.adPosts.findIndex((post) => post.id === req.params.id);
  if (index === -1) throw new HttpError(404, "Ad post not found");
  const [deleted] = store.adPosts.splice(index, 1);
  res.json({ data: deleted });
});

adminRouter.patch("/banner-ads/:id/toggle", (req, res) => {
  const ad = store.bannerAds.find((item) => item.id === req.params.id);
  if (!ad) throw new HttpError(404, "Banner ad not found");
  ad.active = !ad.active;
  res.json({ data: ad });
});
