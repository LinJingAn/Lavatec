import { DeliveryRoute, DeliveryDriver, Delivery, RouteStop } from '../models/Delivery';

export class RouteOptimizationService {
  private static instance: RouteOptimizationService;

  private constructor() {}

  public static getInstance(): RouteOptimizationService {
    if (!RouteOptimizationService.instance) {
      RouteOptimizationService.instance = new RouteOptimizationService();
    }
    return RouteOptimizationService.instance;
  }

  async optimizeRoutes(
    deliveries: Delivery[],
    availableDrivers: DeliveryDriver[],
    options: OptimizationOptions = defaultOptions
  ): Promise<DeliveryRoute[]> {
    try {
      // Group deliveries by geographic proximity
      const deliveryClusters = this.clusterDeliveriesByLocation(deliveries);

      // Assign clusters to drivers based on capacity and working hours
      const driverAssignments = this.assignClustersToDrivers(
        deliveryClusters,
        availableDrivers
      );

      // Generate optimized routes for each driver
      const optimizedRoutes = await Promise.all(
        driverAssignments.map(assignment =>
          this.generateOptimizedRoute(assignment.driver, assignment.deliveries, options)
        )
      );

      return optimizedRoutes;
    } catch (error) {
      console.error('Error optimizing routes:', error);
      throw new Error('Failed to optimize routes');
    }
  }

  private clusterDeliveriesByLocation(deliveries: Delivery[]): Delivery[][] {
    // Implement K-means clustering based on delivery coordinates
    // This is a simplified version - in production, use a proper clustering algorithm
    const clusters: Delivery[][] = [];
    const maxClusterSize = 10;

    for (let i = 0; i < deliveries.length; i += maxClusterSize) {
      clusters.push(deliveries.slice(i, i + maxClusterSize));
    }

    return clusters;
  }

  private assignClustersToDrivers(
    clusters: Delivery[][],
    drivers: DeliveryDriver[]
  ): DriverAssignment[] {
    const assignments: DriverAssignment[] = [];

    // Simple round-robin assignment - in production, consider driver capacity and constraints
    clusters.forEach((cluster, index) => {
      const driverIndex = index % drivers.length;
      const existingAssignment = assignments.find(
        a => a.driver.id === drivers[driverIndex].id
      );

      if (existingAssignment) {
        existingAssignment.deliveries.push(...cluster);
      } else {
        assignments.push({
          driver: drivers[driverIndex],
          deliveries: [...cluster]
        });
      }
    });

    return assignments;
  }

  private async generateOptimizedRoute(
    driver: DeliveryDriver,
    deliveries: Delivery[],
    options: OptimizationOptions
  ): Promise<DeliveryRoute> {
    // Sort deliveries to minimize total distance
    const sortedStops = await this.calculateOptimalDeliverySequence(deliveries);

    // Calculate estimated times and distances
    const { totalDistance, totalDuration } = this.calculateRouteMetrics(sortedStops);

    const route: DeliveryRoute = {
      id: crypto.randomUUID(),
      driverId: driver.id,
      driverName: driver.name,
      status: 'planned',
      stops: sortedStops,
      deliveryIds: deliveries.map(d => d.id),
      startTime: new Date(),
      totalDistance,
      totalDuration,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return route;
  }

  private async calculateOptimalDeliverySequence(
    deliveries: Delivery[]
  ): Promise<RouteStop[]> {
    // In production, implement proper TSP algorithm or use external routing service
    // This is a simplified version that orders by latitude (north to south)
    const stops: RouteStop[] = deliveries
      .sort((a, b) => {
        const latA = a.address.latitude || 0;
        const latB = b.address.latitude || 0;
        return latB - latA;
      })
      .map((delivery, index) => ({
        deliveryId: delivery.id,
        address: `${delivery.address.streetAddress}, ${delivery.address.city}`,
        status: 'pending',
        estimatedArrival: new Date(),
        sequence: index + 1,
        latitude: delivery.address.latitude || 0,
        longitude: delivery.address.longitude || 0
      }));

    return stops;
  }

  private calculateRouteMetrics(stops: RouteStop[]): RouteMetrics {
    // In production, use actual distance calculation service
    // This is a simplified version using straight-line distance
    let totalDistance = 0;
    let totalDuration = 0;

    for (let i = 0; i < stops.length - 1; i++) {
      const distance = this.calculateDistance(
        stops[i].latitude,
        stops[i].longitude,
        stops[i + 1].latitude,
        stops[i + 1].longitude
      );
      totalDistance += distance;
      totalDuration += this.estimateDuration(distance);
    }

    return { totalDistance, totalDuration };
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    // Haversine formula for calculating distance between coordinates
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  private estimateDuration(distance: number): number {
    // Simplified duration estimation: 2 minutes per km plus 5 minutes per stop
    return distance * 2 * 60 + 5 * 60; // Duration in seconds
  }
}

interface OptimizationOptions {
  maxRouteDistance?: number;
  maxStopsPerRoute?: number;
  preferredTimeWindows?: {
    start: string;
    end: string;
  }[];
}

interface DriverAssignment {
  driver: DeliveryDriver;
  deliveries: Delivery[];
}

interface RouteMetrics {
  totalDistance: number;
  totalDuration: number;
}

const defaultOptions: OptimizationOptions = {
  maxRouteDistance: 200, // km
  maxStopsPerRoute: 20,
  preferredTimeWindows: [
    {
      start: '09:00',
      end: '17:00'
    }
  ]
}; 