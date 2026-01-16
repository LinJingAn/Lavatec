import { ServiceType, generateMockServiceTypes } from '../models/ServiceTypes';
import { 
  GarmentType,
  PriceMatrixEntry,
  PricingRule,
  PriceCalculatorInput,
  PriceCalculatorResult,
  calculatePrice,
  generateMockGarmentTypes,
  generateMockPriceMatrix,
  generateMockPricingRules
} from '../models/PricingTable';

// Service to handle pricing operations
class PricingService {
  private cacheTTL = 5 * 60 * 1000; // 5 minutes in milliseconds
  private lastFetchTime = {
    serviceTypes: 0,
    garmentTypes: 0,
    priceMatrix: 0,
    pricingRules: 0
  };
  
  private cache = {
    serviceTypes: [] as ServiceType[],
    garmentTypes: [] as GarmentType[],
    priceMatrix: [] as PriceMatrixEntry[],
    pricingRules: [] as PricingRule[]
  };

  // Fetch service types with caching
  async getServiceTypes(): Promise<ServiceType[]> {
    const now = Date.now();
    if (now - this.lastFetchTime.serviceTypes > this.cacheTTL || this.cache.serviceTypes.length === 0) {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      this.cache.serviceTypes = generateMockServiceTypes();
      this.lastFetchTime.serviceTypes = now;
    }
    return this.cache.serviceTypes;
  }

  // Fetch garment types with caching
  async getGarmentTypes(): Promise<GarmentType[]> {
    const now = Date.now();
    if (now - this.lastFetchTime.garmentTypes > this.cacheTTL || this.cache.garmentTypes.length === 0) {
      // In a real app, this would be an API call
      this.cache.garmentTypes = generateMockGarmentTypes();
      this.lastFetchTime.garmentTypes = now;
    }
    return this.cache.garmentTypes;
  }

  // Fetch price matrix with caching
  async getPriceMatrix(): Promise<PriceMatrixEntry[]> {
    const now = Date.now();
    if (now - this.lastFetchTime.priceMatrix > this.cacheTTL || this.cache.priceMatrix.length === 0) {
      // In a real app, this would be an API call
      this.cache.priceMatrix = generateMockPriceMatrix();
      this.lastFetchTime.priceMatrix = now;
    }
    return this.cache.priceMatrix;
  }

  // Fetch pricing rules with caching
  async getPricingRules(): Promise<PricingRule[]> {
    const now = Date.now();
    if (now - this.lastFetchTime.pricingRules > this.cacheTTL || this.cache.pricingRules.length === 0) {
      // In a real app, this would be an API call
      this.cache.pricingRules = generateMockPricingRules();
      this.lastFetchTime.pricingRules = now;
    }
    return this.cache.pricingRules;
  }

  // Calculate price based on service, garment, quantity, and options
  async calculatePrice(
    serviceTypeId: string,
    garmentTypeId: string,
    quantity: number,
    isExpress: boolean
  ): Promise<PriceCalculatorResult> {
    // Fetch all necessary data
    const [serviceTypes, garmentTypes, priceMatrix, pricingRules] = await Promise.all([
      this.getServiceTypes(),
      this.getGarmentTypes(),
      this.getPriceMatrix(),
      this.getPricingRules()
    ]);

    // Prepare input for price calculation
    const input: PriceCalculatorInput = {
      serviceTypeId,
      garmentTypeId,
      quantity,
      isExpress,
      priceMatrix,
      pricingRules,
      serviceTypes,
      garmentTypes
    };

    // Calculate price
    return calculatePrice(input);
  }

  // Get base price for a service-garment combination
  async getBasePrice(serviceTypeId: string, garmentTypeId: string): Promise<number> {
    const priceMatrix = await this.getPriceMatrix();
    const matrixEntry = priceMatrix.find(
      entry => entry.serviceTypeId === serviceTypeId && entry.garmentTypeId === garmentTypeId
    );

    if (!matrixEntry) {
      throw new Error('Price not found for the given service and garment combination');
    }

    return matrixEntry.price;
  }

  // Update price for a service-garment combination
  async updatePrice(serviceTypeId: string, garmentTypeId: string, newPrice: number): Promise<boolean> {
    // In a real app, this would be an API call to update the price
    const priceMatrix = await this.getPriceMatrix();
    const index = priceMatrix.findIndex(
      entry => entry.serviceTypeId === serviceTypeId && entry.garmentTypeId === garmentTypeId
    );

    if (index === -1) {
      return false;
    }

    // Update the price and lastUpdated date
    this.cache.priceMatrix[index] = {
      ...this.cache.priceMatrix[index],
      price: newPrice,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    return true;
  }

  // Get service type by ID
  async getServiceById(id: string): Promise<ServiceType | undefined> {
    const serviceTypes = await this.getServiceTypes();
    return serviceTypes.find(service => service.id === id);
  }

  // Get garment type by ID
  async getGarmentById(id: string): Promise<GarmentType | undefined> {
    const garmentTypes = await this.getGarmentTypes();
    return garmentTypes.find(garment => garment.id === id);
  }
}

// Export singleton instance
export const pricingService = new PricingService();

// For testing: simulate a delay to represent API latency
export const simulateApiDelay = (): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, 800));
}; 