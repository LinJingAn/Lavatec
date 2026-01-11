import { supabase, handleSupabaseResponse } from "../lib/supabaseClient";

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  recipient_id: string;
  is_read: boolean;
  created_at: string;
  metadata?: Record<string, any>;
}

export class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async createNotification(notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        ...notification,
        is_read: false
      })
      .select()
      .single();

    return handleSupabaseResponse<Notification>({ data, error });
  }

  async getNotifications(recipientId: string, options: {
    unreadOnly?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<Notification[]> {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', recipientId)
      .order('created_at', { ascending: false });

    if (options.unreadOnly) {
      query = query.eq('is_read', false);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;
    return handleSupabaseResponse<Notification[]>({ data, error }) || [];
  }

  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      throw new Error(error.message);
    }
  }

  async markAllAsRead(recipientId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('recipient_id', recipientId)
      .eq('is_read', false);

    if (error) {
      throw new Error(error.message);
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) {
      throw new Error(error.message);
    }
  }

  async getUnreadCount(recipientId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', recipientId)
      .eq('is_read', false);

    if (error) {
      throw new Error(error.message);
    }

    return count || 0;
  }

  async sendBulkNotifications(notifications: Omit<Notification, 'id' | 'created_at' | 'is_read'>[]): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .insert(
        notifications.map(notification => ({
          ...notification,
          is_read: false
        }))
      );

    if (error) {
      throw new Error(error.message);
    }
  }
} 