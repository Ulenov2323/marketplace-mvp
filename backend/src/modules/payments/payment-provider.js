export class PaymentProvider {
  async pay(_payload) {
    throw new Error("PaymentProvider.pay() must be implemented");
  }

  async refund(_payload) {
    throw new Error("PaymentProvider.refund() must be implemented");
  }

  async verify(_payload) {
    throw new Error("PaymentProvider.verify() must be implemented");
  }
}
