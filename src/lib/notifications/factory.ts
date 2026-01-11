import { NotificationProvider } from "./types";
import { ConsoleNotificationProvider } from "./providers/console";

export class NotificationFactory {
  private static instance: NotificationProvider;

  static getProvider(): NotificationProvider {
    if (this.instance) return this.instance;

    // Default to Console for now. Future: Switch based on env var (e.g., 'RESEND', 'SMTP')
    this.instance = new ConsoleNotificationProvider();
    
    return this.instance;
  }
}
