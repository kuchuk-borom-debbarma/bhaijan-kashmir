import { NotificationProvider, NotificationRequest } from "../types";

export class ConsoleNotificationProvider implements NotificationProvider {
  async send(request: NotificationRequest): Promise<boolean> {
    console.log("---------------------------------------------------");
    console.log(`[Notification - ${request.type}]`);
    console.log(`To: ${request.to}`);
    console.log(`Subject: ${request.subject}`);
    console.log(`Body: ${request.body}`);
    console.log("---------------------------------------------------");
    return true;
  }
}
