import { PaymentProvider } from "./payment-provider.js";

class RuCardDemoProvider extends PaymentProvider {
  async pay(payload) {
    return {
      provider: "ru-card-demo",
      paymentId: crypto.randomUUID(),
      status: "requires_confirmation",
      amount: payload.amount,
      currency: "RUB",
      redirectUrl: `/checkout/demo/${crypto.randomUUID()}`
    };
  }

  async refund(payload) {
    return {
      provider: "ru-card-demo",
      refundId: crypto.randomUUID(),
      paymentId: payload.paymentId,
      status: "refunded"
    };
  }

  async verify(payload) {
    return {
      provider: "ru-card-demo",
      paymentId: payload.paymentId,
      verified: true
    };
  }
}

class FutureProviderStub extends PaymentProvider {
  constructor(name) {
    super();
    this.name = name;
  }

  async pay() {
    return { provider: this.name, status: "not_configured" };
  }

  async refund() {
    return { provider: this.name, status: "not_configured" };
  }

  async verify() {
    return { provider: this.name, verified: false };
  }
}

export const paymentProviders = {
  "ru-card-demo": new RuCardDemoProvider(),
  crypto: new FutureProviderStub("crypto"),
  "binance-pay": new FutureProviderStub("binance-pay"),
  alternative: new FutureProviderStub("alternative")
};
