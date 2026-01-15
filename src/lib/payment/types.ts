export interface PaymentOrderRequest {
  amount: number; // Amount in major units (e.g., Rupees, Dollars)
  currency: string;
  orderId: string; // Internal Order ID
  description?: string;
  customer?: {
    name: string;
    email: string;
    contact?: string;
  };
}

export interface PaymentOrderResponse {
  id: string; // Provider's reference ID
  amount: number;
  currency: string;
  clientSecret?: string; // For Stripe-like flows
  providerSpecificData?: Record<string, unknown>; // For Razorpay-like frontend SDKs
}

export interface PaymentVerificationRequest {
  paymentId: string; // The transaction/payment ID from provider
  orderId: string; // Our internal Order ID
  providerOrderId?: string; // Provider's order ID (like Razorpay order_id)
  signature?: string; // Security signature if applicable
}

export interface PaymentProvider {
  /**
   * Initializes a payment order with the provider.
   */
  createPaymentOrder(request: PaymentOrderRequest): Promise<PaymentOrderResponse>;

  /**
   * Verifies the payment (server-side validation).
   */
  verifyPayment(request: PaymentVerificationRequest): Promise<boolean>;

  /**
   * Returns the provider name (e.g., 'mock', 'razorpay').
   */
  getProviderName(): string;

  /**
   * Handles incoming webhooks from the provider.
   * Returns true if the event was processed successfully.
   */
  processWebhook(request: Request): Promise<boolean>;
}
