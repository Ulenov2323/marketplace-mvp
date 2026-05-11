import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../../shared/async-handler.js";
import { createPlacementPayment, getPaymentProvider } from "./payment.service.js";

export const paymentRouter = Router();

const placementSchema = z.object({
  kind: z.enum(["service", "adPost", "banner48h"]),
  ownerId: z.string().min(1)
});

paymentRouter.post("/placement", asyncHandler(async (req, res) => {
  const payload = placementSchema.parse(req.body);
  const payment = await createPlacementPayment(payload);
  res.status(201).json({ data: payment });
}));

paymentRouter.post("/:paymentId/verify", asyncHandler(async (req, res) => {
  const provider = getPaymentProvider();
  const verification = await provider.verify({ paymentId: req.params.paymentId });
  res.json({ data: verification });
}));

paymentRouter.post("/:paymentId/refund", asyncHandler(async (req, res) => {
  const provider = getPaymentProvider();
  const refund = await provider.refund({ paymentId: req.params.paymentId });
  res.json({ data: refund });
}));
