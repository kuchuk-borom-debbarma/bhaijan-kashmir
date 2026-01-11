import { PaymentProvider } from "./types";
import { MockPaymentProvider } from "./providers/mock";
import { RazorpayProvider } from "./providers/razorpay";

export type PaymentProviderType = "mock" | "razorpay" | "stripe";

export class PaymentFactory {
  private static instance: PaymentProvider;

  static getProvider(): PaymentProvider {
    if (this.instance) return this.instance;

    // We use an environment variable to switch providers
    const providerType = (process.env.NEXT_PUBLIC_PAYMENT_PROVIDER || "mock") as PaymentProviderType;

    switch (providerType) {
      case "razorpay":
        this.instance = new RazorpayProvider();
        break;
      case "mock":
      default:
        this.instance = new MockPaymentProvider();
        break;
    }

    return this.instance;
  }
}
