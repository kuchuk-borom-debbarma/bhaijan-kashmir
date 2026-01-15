export interface NotificationRequest {
  to: string; // Email address or user ID
  subject: string;
  body: string; // Plain text or HTML
  type: 'ORDER_CONFIRMATION' | 'ORDER_SHIPPED' | 'ORDER_DELIVERED' | 'GENERAL';
  data?: Record<string, unknown>; // Extra context
}

export interface NotificationProvider {
  send(request: NotificationRequest): Promise<boolean>;
}
