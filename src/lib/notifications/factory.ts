import { NotificationProvider } from "./types";
import { ConsoleNotificationProvider } from "./providers/console";
import { NotificationApiProvider } from "./providers/notificationapi";

export class NotificationFactory {
  private static instance: NotificationProvider;

  static getProvider(): NotificationProvider {
    if (this.instance) return this.instance;

    // Prioritize NotificationAPI if keys are present
    if (process.env.NOTIFICATION_API_CLIENT_ID && process.env.NOTIFICATION_API_CLIENT_SECRET) {
      this.instance = new NotificationApiProvider();
    } else {
      this.instance = new ConsoleNotificationProvider();
    }
    
    return this.instance;
  }
}
