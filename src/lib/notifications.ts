import { NotificationFactory } from "./notifications/factory";

export interface NotificationService {
  sendMagicLink(email: string, link: string): Promise<void>;
}

export const notificationService: NotificationService = {
  async sendMagicLink(email: string, link: string) {
    // 1. Log to console always (so you can dev easily without checking email)
    console.log('---------------------------------------------------------');
    console.log(`[MAGIC LINK] To: ${email}`);
    console.log(`[LINK]: ${link}`);
    console.log('---------------------------------------------------------');

    // 2. Send via configured provider
    const provider = NotificationFactory.getProvider();
    
    await provider.send({
      to: email,
      subject: "Sign In to Bhaijan Kashmir",
      body: `<p>Click the link below to verify your email and complete your registration:</p><p><a href="${link}">${link}</a></p>`,
      type: "AUTH_MAGIC_LINK"
    });
  },
};