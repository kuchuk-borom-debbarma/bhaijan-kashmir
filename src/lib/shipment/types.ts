export interface ShipmentData {
  provider: string;
  trackingNumber: string;
}

export interface TrackingResult {
  status: 'PRE_TRANSIT' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'UNKNOWN';
  location?: string;
  timestamp?: Date;
  message: string;
  trackingUrl?: string;
}

export interface ShipmentResolver {
  resolve(shipment: ShipmentData): Promise<TrackingResult>;
  getProviderName(): string;
}
