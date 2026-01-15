import Razorpay from "razorpay";
import crypto from "crypto";
import { PaymentOrderRequest, PaymentOrderResponse, PaymentProvider, PaymentVerificationRequest } from "../types";

export class RazorpayProvider implements PaymentProvider {
  private razorpay: Razorpay;

  constructor() {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay API keys are missing in environment variables.");
    }

    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  async createPaymentOrder(request: PaymentOrderRequest): Promise<PaymentOrderResponse> {
    const options = {
      amount: Math.round(request.amount * 100), // Razorpay expects amount in paise
      currency: request.currency,
      receipt: request.orderId,
      notes: {
        internal_order_id: request.orderId,
        customer_email: request.customer?.email || "",
      },
    };

    try {
      const order = await this.razorpay.orders.create(options);
      
      return {
        id: order.id,
        amount: request.amount,
        currency: request.currency,
        providerSpecificData: {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          order_id: order.id,
          name: "Bhaijan Kashmir",
          description: request.description || "Purchase from Bhaijan Kashmir",
          prefill: {
            name: request.customer?.name,
            email: request.customer?.email,
            contact: request.customer?.contact,
          },
        },
      };
    } catch (error) {
      console.error("[Razorpay] Error creating order:", error);
      throw new Error("Failed to create Razorpay order");
    }
  }

  async verifyPayment(request: PaymentVerificationRequest): Promise<boolean> {
    if (!request.providerOrderId || !request.signature || !request.paymentId) {
      return false;
    }

    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const body = request.providerOrderId + "|" + request.paymentId;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    return expectedSignature === request.signature;
  }

  getProviderName(): string {
    return "razorpay";
  }

  async processWebhook(request: Request): Promise<boolean> {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      console.error("[Razorpay Webhook] Missing signature");
      return false;
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET!;
    
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("[Razorpay Webhook] Invalid signature");
      return false;
    }

    const event = JSON.parse(body);
    console.log("[Razorpay Webhook] Event received:", event.event);

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const orderId = payment.notes.internal_order_id;
      const razorpayPaymentId = payment.id;

      if (orderId) {
        try {
          const { finalizeOrderPayment } = await import("@/lib/orders");
          const result = await finalizeOrderPayment(orderId, razorpayPaymentId);
          
          if (result.success) {
            console.log(`[Razorpay Webhook] Order ${orderId} processed successfully (Already paid: ${result.alreadyProcessed})`);
          }
          return true;
        } catch (dbError) {
          console.error("[Razorpay Webhook] Database update failed:", dbError);
        }
      }
    }

    return true; // Return true to acknowledge receipt even if we didn't process it (e.g. other event types)
  }
}
