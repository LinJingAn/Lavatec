import { supabase } from '../lib/supabaseClient';
import {
  Delivery,
  DeliveryAddress,
  DeliveryDriver,
  DeliveryRoute,
  DeliveryStatus,
  DeliveryTimeSlot,
} from '../models/Delivery';

export class DeliveryService {
  private static instance: DeliveryService;

  private constructor() {}

  static getInstance(): DeliveryService {
    if (!DeliveryService.instance) {
      DeliveryService.instance = new DeliveryService();
    }
    return DeliveryService.instance;
  }

  async createDelivery(delivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>): Promise<Delivery> {
    try {
      const trackingNumber = await this.generateTrackingNumber();
      const newDelivery = {
        ...delivery,
        trackingNumber,
        status: 'pending' as DeliveryStatus,
        createdAt: new Date(),
        updatedAt: new Date(),
        statusHistory: [{
          status: 'pending',
          timestamp: new Date(),
        }],
      };

      const { data, error } = await supabase
        .from('deliveries')
        .insert([newDelivery])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating delivery:', error);
      throw error;
    }
  }

  async updateDeliveryStatus(
    deliveryId: string,
    status: DeliveryStatus,
    notes?: string
  ): Promise<void> {
    try {
      const statusUpdate = {
        status,
        statusHistory: supabase.sql`array_append(status_history, ${JSON.stringify({
          status,
          timestamp: new Date(),
          notes,
        })}::jsonb)`,
        updatedAt: new Date(),
      };

      const { error } = await supabase
        .from('deliveries')
        .update(statusUpdate)
        .eq('id', deliveryId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating delivery status:', error);
      throw error;
    }
  }

  async assignDriver(deliveryId: string, driverId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('deliveries')
        .update({
          driverId,
          status: 'assigned',
          updatedAt: new Date(),
          statusHistory: supabase.sql`array_append(status_history, ${JSON.stringify({
            status: 'assigned',
            timestamp: new Date(),
            notes: `Assigned to driver ${driverId}`,
          })}::jsonb)`,
        })
        .eq('id', deliveryId);

      if (error) throw error;
    } catch (error) {
      console.error('Error assigning driver:', error);
      throw error;
    }
  }

  async confirmDelivery(
    deliveryId: string,
    signature?: string,
    photo?: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('deliveries')
        .update({
          status: 'completed',
          signature,
          photo,
          confirmedAt: new Date(),
          updatedAt: new Date(),
          statusHistory: supabase.sql`array_append(status_history, ${JSON.stringify({
            status: 'completed',
            timestamp: new Date(),
            notes: 'Delivery confirmed',
          })}::jsonb)`,
        })
        .eq('id', deliveryId);

      if (error) throw error;
    } catch (error) {
      console.error('Error confirming delivery:', error);
      throw error;
    }
  }

  async getAvailableTimeSlots(date: Date): Promise<DeliveryTimeSlot[]> {
    try {
      const { data, error } = await supabase
        .from('delivery_time_slots')
        .select('*')
        .lte('currentDeliveries', supabase.raw('max_deliveries'))
        .eq('date', date.toISOString().split('T')[0]);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting time slots:', error);
      throw error;
    }
  }

  async getDeliveryByOrderId(orderId: string): Promise<Delivery | null> {
    try {
      const { data, error } = await supabase
        .from('deliveries')
        .select('*')
        .eq('orderId', orderId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting delivery:', error);
      throw error;
    }
  }

  async getDeliveriesByStatus(status: DeliveryStatus): Promise<Delivery[]> {
    try {
      const { data, error } = await supabase
        .from('deliveries')
        .select('*')
        .eq('status', status);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting deliveries:', error);
      throw error;
    }
  }

  async createDeliveryRoute(route: Omit<DeliveryRoute, 'id'>): Promise<DeliveryRoute> {
    try {
      const { data, error } = await supabase
        .from('delivery_routes')
        .insert([route])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating delivery route:', error);
      throw error;
    }
  }

  async updateDriverLocation(
    driverId: string,
    latitude: number,
    longitude: number
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('delivery_drivers')
        .update({
          currentLocation: {
            latitude,
            longitude,
            lastUpdated: new Date(),
          },
        })
        .eq('id', driverId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating driver location:', error);
      throw error;
    }
  }

  async getAvailableDrivers(): Promise<DeliveryDriver[]> {
    try {
      const { data, error } = await supabase
        .from('delivery_drivers')
        .select('*')
        .eq('isAvailable', true);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting available drivers:', error);
      throw error;
    }
  }

  async saveDeliveryAddress(address: Omit<DeliveryAddress, 'id'>): Promise<DeliveryAddress> {
    try {
      const { data, error } = await supabase
        .from('delivery_addresses')
        .insert([address])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving delivery address:', error);
      throw error;
    }
  }

  private async generateTrackingNumber(): Promise<string> {
    const prefix = 'DEL';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }
} 