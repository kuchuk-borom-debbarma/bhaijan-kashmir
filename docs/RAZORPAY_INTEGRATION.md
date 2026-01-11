# Razorpay Integration Guide for Bhaijan Kashmir

This guide details the setup, configuration, and testing procedures for the Razorpay payment gateway integration in the Bhaijan Kashmir application.

## 1. Prerequisites

Before starting, ensure you have:
1.  A **Razorpay Account** ([Sign Up](https://razorpay.com/)).
2.  Access to the **Razorpay Dashboard**.
3.  Generated **Test Mode API Keys**.

## 2. Configuration (`.env`)

The application uses environment variables to manage payment providers and credentials.

### Required Variables

Update your `.env` file with the keys from your Razorpay Dashboard (**Settings** -> **API Keys**).

```env
# Payment Provider Selection
# Options: 'mock' (default) or 'razorpay'
NEXT_PUBLIC_PAYMENT_PROVIDER=razorpay

# Razorpay API Keys (Backend)
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET

# Razorpay Public Key (Frontend)
# MUST match RAZORPAY_KEY_ID
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID

# Webhook Secret
# You define this string. It must match what you enter in the Razorpay Dashboard.
RAZORPAY_WEBHOOK_SECRET=your_custom_secret_string
```

## 3. Webhook Setup

Webhooks are **critical** for this integration. They ensure orders are marked as `PAID` in the database even if the user closes their browser immediately after payment.

### Steps to Configure

1.  Log in to the [Razorpay Dashboard](https://dashboard.razorpay.com/).
2.  Navigate to **Settings** -> **Webhooks**.
3.  Click **+ Add New Webhook**.

### Settings

| Field | Value | Notes |
| :--- | :--- | :--- |
| **Webhook URL** | `https://your-domain.com/api/webhooks/payment` | For local dev, use `ngrok` (see below). |
| **Secret** | `your_custom_secret_string` | Must match `RAZORPAY_WEBHOOK_SECRET` in `.env`. |
| **Active Events** | `payment.captured` | **Required.** This is the only event we listen for to confirm payment. |

### Local Development (ngrok)

To test webhooks locally:

1.  Install **ngrok** (or a similar tunneling tool).
2.  Run ngrok on your app's port:
    ```bash
    ngrok http 3000
    ```
3.  Copy the HTTPS URL provided by ngrok (e.g., `https://1234abcd.ngrok-free.app`).
4.  Use this URL in the Razorpay Dashboard:
    `https://1234abcd.ngrok-free.app/api/webhooks/payment`

## 4. Testing

### Test Cards

Razorpay provides specific test card details to simulate various scenarios (Success, Failure, etc.).

*   **Card Number:** `4111 1111 1111 1111` (Visa)
*   **Expiry:** Any future date (e.g., `12/30`)
*   **CVV:** Any 3 digits (e.g., `123`)
*   **OTP:** Use `123456` (Razorpay's test bank page will ask for this).

See [Razorpay Test Card Documentation](https://razorpay.com/docs/payments/payments/test-card-details/) for more options.

### Verification Flow

1.  **Add to Cart:** Add items to your cart on `http://localhost:3000`.
2.  **Checkout:** Proceed to checkout and enter an address.
3.  **Pay:** Click "Pay". The Razorpay modal should open.
4.  **Complete Payment:** Use the test card details.
5.  **Success Page:** You should be redirected to the Order Success page.
6.  **Database Check:** Verify the order status is `PAID` in the database:
    ```bash
    npx prisma studio
    ```
    Check the `Order` table.

## 5. Going Live (Production)

1.  **KYC:** Complete your KYC on Razorpay to activate your account.
2.  **Generate Live Keys:** In the Dashboard, switch to "Live Mode" and generate new API Keys.
3.  **Update Environment:** Update your production environment variables (e.g., Vercel, AWS) with the Live Keys.
    *   `RAZORPAY_KEY_ID` (starts with `rzp_live_...`)
    *   `NEXT_PUBLIC_RAZORPAY_KEY_ID`
    *   `RAZORPAY_KEY_SECRET`
4.  **Add Live Webhook:** Create a **new** webhook in the Razorpay Dashboard (Live Mode) pointing to your production URL.

## Troubleshooting

*   **Modal doesn't open:** Check browser console. Ensure `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set correctly.
*   **"Invalid API Key":** Ensure you are using the correct Key ID for the selected mode (Test vs Live).
*   **Order stays PENDING:**
    *   Did the webhook fire? Check Razorpay Dashboard -> Webhooks -> Select Webhook -> Delivery attempts.
    *   Did the signature verify? Check server logs for `[Razorpay Webhook] Invalid signature`.
    *   Is the Secret correct?
