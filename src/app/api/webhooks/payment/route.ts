import { PaymentFactory } from "@/lib/payment/factory";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const provider = PaymentFactory.getProvider();
    
    // Security Note: In a real app, you must verify the signature header
    // e.g., const signature = headers().get("x-razorpay-signature");
    
    const success = await provider.processWebhook(req);

    if (success) {
      return new Response("Webhook processed", { status: 200 });
    } else {
      return new Response("Event ignored", { status: 200 });
    }
  } catch (error: unknown) {
    console.error("Webhook Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(`Webhook Error: ${message}`, { status: 500 });
  }
}
