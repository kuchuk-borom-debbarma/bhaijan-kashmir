import { PaymentOrderRequest, PaymentOrderResponse, PaymentProvider, PaymentVerificationRequest } from "../types";

export class MockPaymentProvider implements PaymentProvider {
  async createPaymentOrder(request: PaymentOrderRequest): Promise<PaymentOrderResponse> {
    console.log("[MockPayment] Creating order:", request);
    // In a real provider, this would call an API.
    // Here we just simulate a successful order creation.
    return {
      id: `mock_order_${Math.random().toString(36).substr(2, 9)}`,
      amount: request.amount,
      currency: request.currency,
      providerSpecificData: {
        note: "This is a mock transaction. No real money will be charged.",
      },
    };
  }

  async verifyPayment(request: PaymentVerificationRequest): Promise<boolean> {
    console.log("[MockPayment] Verifying payment:", request);
    // Mock always returns true
    return true;
  }

  getProviderName(): string {
    return "mock";
  }

  async processWebhook(request: Request): Promise<boolean> {
    const body = await request.json();
    console.log("[MockPayment] Processing Webhook:", body);

    // In a real app, we would:
    // 1. Verify the webhook signature (security)
    // 2. Check if the event is 'payment.captured'
    // 3. Update the database

    // Simulating database update logic here for demonstration:
    if (body.event === "payment_success" && body.orderId) {
      console.log(`[MockPayment] Webhook confirmed payment for Order ${body.orderId}`);
      
      // Import prisma dynamically to avoid circular dependencies if any
      const { prisma } = await import("@/lib/prisma");
      
      await prisma.order.update({
        where: { id: body.orderId },
        data: { 
          status: "PAID",
          paymentId: body.paymentId || "webhook_recovered_id"
        }
      });
      return true;
    }

    return false;
  }
}
