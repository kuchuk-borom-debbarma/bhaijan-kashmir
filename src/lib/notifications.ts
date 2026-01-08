
export interface NotificationService {
  sendMagicLink(email: string, link: string): Promise<void>;
}

export const consoleNotificationService: NotificationService = {
  async sendMagicLink(email: string, link: string) {
    console.log('---------------------------------------------------------');
    console.log(`[MAGIC LINK] To: ${email}`);
    console.log(`[LINK]: ${link}`);
    console.log('---------------------------------------------------------');
  },
};

// Default export can be switched later (e.g., to email provider)
export const notificationService = consoleNotificationService;
