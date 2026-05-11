import { env } from "../../config/env.js";
import { paymentProviders } from "./providers.js";

export function getPaymentProvider(name = env.paymentProvider) {
  return paymentProviders[name] ?? paymentProviders["ru-card-demo"];
}

export async function createPlacementPayment({ kind, ownerId }) {
  const prices = {
    service: 250,
    adPost: 200,
    banner48h: 2500
  };

  const amount = prices[kind];
  if (!amount) {
    throw new Error("Unsupported placement payment kind");
  }

  return getPaymentProvider().pay({
    amount,
    ownerId,
    metadata: { kind }
  });
}
