import { NotificationService } from './NotificationService';

export interface PickupNotification {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  estimatedPickupTime: string;
  status: 'pending' | 'ready' | 'delayed' | 'completed';
  type: 'arrival' | 'ready' | 'delay' | 'reminder';
}

export class PickupNotificationService {
  private static instance: PickupNotificationService;
  private notificationService: NotificationService;

  private constructor() {
    this.notificationService = new NotificationService();
  }

  public static getInstance(): PickupNotificationService {
    if (!PickupNotificationService.instance) {
      PickupNotificationService.instance = new PickupNotificationService();
    }
    return PickupNotificationService.instance;
  }

  public async sendPickupReadyNotification(notification: PickupNotification): Promise<void> {
    const message = `Your order #${notification.orderNumber} is ready for pickup. Please proceed to our pickup counter with your ID.`;
    await this.notificationService.sendSMS(notification.customerPhone, message);
    await this.notificationService.sendPushNotification({
      userId: notification.orderId,
      title: 'Order Ready for Pickup',
      body: message,
      data: {
        type: 'pickup_ready',
        orderId: notification.orderId,
        orderNumber: notification.orderNumber
      }
    });
  }

  public async sendCustomerArrivalNotification(notification: PickupNotification): Promise<void> {
    const message = `Customer ${notification.customerName} has arrived for pickup of order #${notification.orderNumber}`;
    await this.notificationService.sendStaffNotification({
      title: 'Customer Arrival',
      message,
      priority: 'high',
      type: 'pickup_arrival',
      data: {
        orderId: notification.orderId,
        orderNumber: notification.orderNumber
      }
    });
  }

  public async sendPickupDelayNotification(notification: PickupNotification, delayMinutes: number): Promise<void> {
    const message = `We apologize, but your order #${notification.orderNumber} needs ${delayMinutes} more minutes. We'll notify you as soon as it's ready.`;
    await this.notificationService.sendSMS(notification.customerPhone, message);
    await this.notificationService.sendPushNotification({
      userId: notification.orderId,
      title: 'Pickup Delay',
      body: message,
      data: {
        type: 'pickup_delay',
        orderId: notification.orderId,
        orderNumber: notification.orderNumber
      }
    });
  }

  public async sendPickupReminderNotification(notification: PickupNotification): Promise<void> {
    const message = `Reminder: Your order #${notification.orderNumber} is waiting for pickup. We'll hold it for 48 hours.`;
    await this.notificationService.sendSMS(notification.customerPhone, message);
    await this.notificationService.sendPushNotification({
      userId: notification.orderId,
      title: 'Pickup Reminder',
      body: message,
      data: {
        type: 'pickup_reminder',
        orderId: notification.orderId,
        orderNumber: notification.orderNumber
      }
    });
  }

  public async markNotificationAsRead(notificationId: string): Promise<void> {
    await this.notificationService.markAsRead(notificationId);
  }
} 