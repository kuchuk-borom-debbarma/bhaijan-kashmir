# Razorpay Integration Guide

This project uses the **Razorpay Standard Web Integration** via a custom Adapter pattern (`PaymentProvider`).

## Prerequisites

1.  **Razorpay Account**: Create an account at [razorpay.com](https://razorpay.com).
2.  **API Keys**: Get your `Key ID` and `Key Secret` from the Razorpay Dashboard -> Settings -> API Keys.
3.  **Webhook Secret**: Set up a webhook in Razorpay Dashboard -> Settings -> Webhooks.
    *   **URL**: `https://your-domain.com/api/webhooks/payment` (or use Ngrok for local dev)
    *   **Secret**: A secret string you define (e.g., `my_webhook_secret`)
    *   **Events**: Select `payment.captured` and `order.paid`.

## Configuration

Add the following environment variables to your `.env` file:

```bash
# Payment Provider Selection
NEXT_PUBLIC_PAYMENT_PROVIDER="razorpay"

# Razorpay API Keys (Server-side)
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your_secret_..."

# Razorpay Webhook Secret (Server-side)
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"

# Public Key for Frontend (Must match RAZORPAY_KEY_ID)
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
```

## How It Works

1.  **Order Creation (Backend)**:
    *   User clicks "Checkout".
    *   `src/app/checkout/actions.ts` -> `createOrder` calls `RazorpayProvider.createPaymentOrder`.
    *   It creates a Razorpay Order (`razorpay.orders.create`) server-side.
    *   Returns the `order_id` and other details to the frontend.

2.  **Payment Flow (Frontend)**:
    *   `src/app/checkout/page.tsx` receives the order details.
    *   It initializes the Razorpay Checkout form (`new Razorpay(options)`).
    *   User completes payment.

3.  **Verification (Backend)**:
    *   On success, the frontend calls `verifyOrderPayment`.
    *   The backend validates the `razorpay_signature` using HMAC SHA256.
    *   If valid, the Order status is updated to `PAID`.

4.  **Webhooks (Safety Net)**:
    *   If the user closes the browser before verification, Razorpay sends a webhook (`payment.captured`).
    *   `src/app/api/webhooks/payment/route.ts` receives it.
    *   `RazorpayProvider.processWebhook` verifies the signature and updates the order status to `PAID`.

## Testing

1.  Set `NEXT_PUBLIC_PAYMENT_PROVIDER="razorpay"` in `.env`.
2.  Use **Test Mode** API keys.
3.  Use Razorpay's test card details (available in their docs) to complete a transaction.

## Architecture & Internal Logic

This project uses the **Adapter Pattern** to abstract payment providers. This allows you to switch between Mock, Razorpay, or future providers (like Stripe) without changing the core checkout logic.

### Key Files & Responsibilities

1.  **Interface Definition** (`src/lib/payment/types.ts`)
    *   Defines the contract that all providers must follow: `createPaymentOrder`, `verifyPayment`, `processWebhook`.
    *   **Customization**: If you need to pass extra data to a provider, update `PaymentOrderRequest` or `PaymentOrderResponse` here.

2.  **The Factory** (`src/lib/payment/factory.ts`)
    *   **Role**: Decides which provider to instantiate based on `NEXT_PUBLIC_PAYMENT_PROVIDER`.
    *   **Customization**: Add new case statements here when adding new providers (e.g., Stripe).

3.  **Razorpay Implementation** (`src/lib/payment/providers/razorpay.ts`)
    *   **Role**: The actual implementation of the Razorpay logic.
    *   **Internal Flow**:
        *   `createPaymentOrder`: Converts our internal currency/amount to Razorpay's format (paise) and calls `razorpay.orders.create`.
        *   `verifyPayment`: Implements the HMAC-SHA256 signature verification mandatory for security.
        *   `processWebhook`: Parses the raw body, verifies signature, and updates the database.

4.  **Checkout Logic** (`src/app/checkout/actions.ts`)
    *   **Role**: The high-level orchestrator.
    *   **Flow**:
        1.  Checks Rate Limits.
        2.  Calculates Cart Total.
        3.  Creates `Order` in Postgres (Status: `PENDING`).
        4.  Calls `PaymentFactory.getProvider().createPaymentOrder()`.
        5.  Returns the Order ID and Provider Data to the frontend.

5.  **Frontend Orchestration** (`src/app/checkout/page.tsx`)
    *   **Role**: Handles the UI and the "Handshake".
    *   **Flow**:
        1.  Calls `createOrder` action.
        2.  Initializes `window.Razorpay` with the returned data.
        3.  On success/failure, calls `verifyOrderPayment` action to finalize the order in the DB.

### Common Customization Scenarios

*   **Adding New Fields to Razorpay**:
    *   Edit `src/lib/payment/providers/razorpay.ts` inside `createPaymentOrder`. You can add more to the `notes` object, which appears in the Razorpay Dashboard.
*   **Changing Post-Payment Logic**:
    *   Edit `src/app/checkout/actions.ts` -> `verifyOrderPayment`. This is where emails are sent and the order is marked confirmed.