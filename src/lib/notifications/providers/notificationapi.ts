import notificationapi from 'notificationapi-node-server-sdk';
import { NotificationProvider, NotificationRequest } from "../types";

export class NotificationApiProvider implements NotificationProvider {
  constructor() {
    const clientId = process.env.NOTIFICATION_API_CLIENT_ID;
    const clientSecret = process.env.NOTIFICATION_API_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.warn("NotificationAPI credentials missing");
    }

    notificationapi.init(
      clientId || '',
      clientSecret || '',
      {
        baseURL: process.env.NOTIFICATION_API_BASE_URL || 'https://api.eu.notificationapi.com'
      }
    );
  }

  async send(request: NotificationRequest): Promise<boolean> {
    try {
      // Mapping internal types to potential different notificationIds if needed
      // For now, using the default 'bhaijan_kashmir' as requested
      const notificationId = 'bhaijan_kashmir';

      await notificationapi.send({
        notificationId: notificationId,
        user: {
          id: request.to,
          email: request.to,
        },
        mergeTags: request.data,
        email: {
          subject: request.subject,
          html: request.body,
        }
      });
      
      console.log(`[NotificationAPI] Sent '${request.subject}' to ${request.to}`);
      return true;
    } catch (error) {
      console.error('[NotificationAPI] Failed to send:', error);
      return false;
    }
  }
}
