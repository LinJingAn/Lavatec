import { api } from '../utils/api';
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

      const response = await api.post('/deliveries', newDelivery);
      return response.data.delivery;
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
      await api.put(`/deliveries/${deliveryId}/status`, { status, notes });
    } catch (error) {
      console.error('Error updating delivery status:', error);
      throw error;
    }
  }

  async assignDriver(deliveryId: string, driverId: string): Promise<void> {
    try {
      await api.put(`/deliveries/${deliveryId}/assign`, { driver_id: driverId });
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
      await api.put(`/deliveries/${deliveryId}/status`, {
        status: 'completed',
        signature,
        photo,
      });
    } catch (error) {
      console.error('Error confirming delivery:', error);
      throw error;
    }
  }

  async getAvailableTimeSlots(date: Date): Promise<DeliveryTimeSlot[]> {
    try {
      // TODO: Implement time slots endpoint in backend
      // For now, return mock data
      return [
        { id: '1', startTime: '09:00', endTime: '12:00', maxDeliveries: 10, currentDeliveries: 0 },
        { id: '2', startTime: '12:00', endTime: '15:00', maxDeliveries: 10, currentDeliveries: 0 },
        { id: '3', startTime: '15:00', endTime: '18:00', maxDeliveries: 10, currentDeliveries: 0 },
      ];
    } catch (error) {
      console.error('Error getting time slots:', error);
      throw error;
    }
  }

  async getDeliveryByOrderId(orderId: string): Promise<Delivery | null> {
    try {
      const response = await api.get(`/deliveries?orderId=${orderId}`);
      return response.data.deliveries?.[0] || null;
    } catch (error) {
      console.error('Error getting delivery:', error);
      throw error;
    }
  }

  async getDeliveriesByStatus(status: DeliveryStatus): Promise<Delivery[]> {
    try {
      const response = await api.get(`/deliveries?status=${status}`);
      return response.data.deliveries || [];
    } catch (error) {
      console.error('Error getting deliveries:', error);
      throw error;
    }
  }

  async createDeliveryRoute(route: Omit<DeliveryRoute, 'id'>): Promise<DeliveryRoute> {
    try {
      // TODO: Implement routes endpoint in backend
      throw new Error('Route creation not yet implemented in backend');
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
      // TODO: Implement driver location update endpoint in backend
      console.log('Driver location update:', { driverId, latitude, longitude });
    } catch (error) {
      console.error('Error updating driver location:', error);
      throw error;
    }
  }

  async getAvailableDrivers(): Promise<DeliveryDriver[]> {
    try {
      // TODO: Implement drivers endpoint in backend
      return [];
    } catch (error) {
      console.error('Error getting available drivers:', error);
      throw error;
    }
  }

  async saveDeliveryAddress(address: Omit<DeliveryAddress, 'id'>): Promise<DeliveryAddress> {
    try {
      // TODO: Implement delivery addresses endpoint in backend
      return { ...address, id: crypto.randomUUID() };
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