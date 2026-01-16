export type DeliveryMethod = 'pickup' | 'delivery';

export type DeliveryStatus = 
  | 'pending'
  | 'scheduled'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type DeliveryTimeSlot = {
  id: string;
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
  maxDeliveries: number;
  currentDeliveries: number;
};

export interface DeliveryAddress {
  id: string;
  customerId: string;
  type: 'home' | 'office' | 'other';
  streetAddress: string;
  unit?: string;
  city: string;
  state: string;
  zipCode: string;
  instructions?: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
  country: string;
}

export interface DeliveryDriver {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleType: string;
  vehicleNumber: string;
  isAvailable: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
    lastUpdated: Date;
  };
  vehiclePlate: string;
  phoneNumber: string;
  status: DriverStatus;
  maxCapacity: {
    weight: number;
    volume: number;
  };
  workingHours: {
    start: string;
    end: string;
  };
  breakTime?: {
    start: string;
    end: string;
  };
}

export interface DeliveryRoute {
  id: string;
  driverId: string;
  driverName: string;
  status: RouteStatus;
  stops: RouteStop[];
  deliveryIds: string[];
  startTime: Date;
  endTime?: Date;
  totalDistance: number;
  totalDuration: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeliveryStop {
  id: string;
  orderId: string;
  sequence: number;
  estimatedArrival: Date;
  actualArrival?: Date;
  status: 'pending' | 'completed' | 'failed';
  notes?: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  customerId: string;
  method: DeliveryMethod;
  status: DeliveryStatus;
  scheduledDate: Date;
  timeSlot: DeliveryTimeSlot;
  address: DeliveryAddress;
  driverId?: string;
  routeId?: string;
  trackingNumber: string;
  notes?: string;
  signature?: string;
  photo?: string;
  confirmedAt?: Date;
  confirmedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  statusHistory: Array<{
    status: DeliveryStatus;
    timestamp: Date;
    notes?: string;
  }>;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  items: DeliveryItem[];
  specialInstructions?: string;
  photos?: string[];
}

export interface DeliveryItem {
  id: string;
  name: string;
  quantity: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
}

export type DriverStatus = 
  | 'available'
  | 'on_delivery'
  | 'on_break'
  | 'off_duty';

export type VehicleType = 
  | 'van'
  | 'truck'
  | 'bike'
  | 'car';

export interface RouteStop {
  deliveryId: string;
  address: string;
  status: StopStatus;
  estimatedArrival: Date;
  actualArrival?: Date;
  departureTime?: Date;
  sequence: number;
  latitude: number;
  longitude: number;
}

export type RouteStatus = 
  | 'planned'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type StopStatus = 
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'skipped'; 