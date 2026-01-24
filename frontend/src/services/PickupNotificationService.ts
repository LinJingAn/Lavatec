import { NotificationService } from './NotificationService';

export interface PickupNotification {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  estimatedPickupTime: string;
  status: 'pending' | 'ready' | 'partial' | 'delayed' | 'completed';
  type: 'arrival' | 'ready' | 'delay' | 'reminder';
}

export class PickupNotificationService {
  private static instance: PickupNotificationService;
  private notificationService: NotificationService;

  private constructor() {
    this.notificationService = NotificationService.getInstance();
  }

  public static getInstance(): PickupNotificationService {
    if (!PickupNotificationService.instance) {
      PickupNotificationService.instance = new PickupNotificationService();
    }
    return PickupNotificationService.instance;
  }

  public async sendPickupReadyNotification(notification: PickupNotification): Promise<void> {
    const message = `Your order #${notification.orderNumber} is ready for pickup. Please proceed to our pickup counter with your ID.`;
    await this.notificationService.sendBulkNotifications([{
      type: 'info',
      title: 'Order Ready for Pickup',
      message,
      recipient_id: notification.orderId,
      metadata: {
        orderId: notification.orderId,
        orderNumber: notification.orderNumber,
        customerPhone: notification.customerPhone
      }
    }]);
  }

  public async sendCustomerArrivalNotification(notification: PickupNotification): Promise<void> {
    const message = `Customer ${notification.customerName} has arrived for pickup of order #${notification.orderNumber}`;
    await this.notificationService.sendBulkNotifications([{
      type: 'info',
      title: 'Customer Arrival',
      message,
      recipient_id: notification.orderId,
      metadata: {
        orderId: notification.orderId,
        orderNumber: notification.orderNumber,
        customerName: notification.customerName
      }
    }]);
  }

  public async sendPickupDelayNotification(notification: PickupNotification, delayMinutes: number): Promise<void> {
    const message = `We apologize, but your order #${notification.orderNumber} needs ${delayMinutes} more minutes. We'll notify you as soon as it's ready.`;
    await this.notificationService.sendBulkNotifications([{
      type: 'warning',
      title: 'Pickup Delay',
      message,
      recipient_id: notification.orderId,
      metadata: {
        orderId: notification.orderId,
        orderNumber: notification.orderNumber,
        delayMinutes
      }
    }]);
  }

  public async sendPickupReminderNotification(notification: PickupNotification): Promise<void> {
    const message = `Reminder: Your order #${notification.orderNumber} is waiting for pickup. We'll hold it for 48 hours.`;
    await this.notificationService.sendBulkNotifications([{
      type: 'info',
      title: 'Pickup Reminder',
      message,
      recipient_id: notification.orderId,
      metadata: {
        orderId: notification.orderId,
        orderNumber: notification.orderNumber
      }
    }]);
  }

  public async markNotificationAsRead(notificationId: string): Promise<void> {
    await this.notificationService.markAsRead(notificationId);
  }
} 