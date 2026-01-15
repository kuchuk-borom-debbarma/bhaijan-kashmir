import { ShipmentData, ShipmentResolver, TrackingResult } from "../types";

export class MockResolver implements ShipmentResolver {
  async resolve(_shipment: ShipmentData): Promise<TrackingResult> {
    return {
      status: 'IN_TRANSIT',
      location: 'Srinagar Hub',
      timestamp: new Date(),
      message: 'Your package is on its way.',
      trackingUrl: '#'
    };
  }

  getProviderName(): string {
    return "MockCourier";
  }
}
