import { Router } from "express";
import { telegramNotifier } from "./telegram.service.js";

export const telegramRouter = Router();

telegramRouter.get("/support", (_req, res) => {
  res.json({ data: { redirectUrl: telegramNotifier.supportLink() } });
});

telegramRouter.post("/webhook", (req, res) => {
  res.json({
    data: {
      received: true,
      updateType: req.body?.message ? "message" : "unknown"
    }
  });
});
