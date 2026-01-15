import { ShipmentData, ShipmentResolver, TrackingResult } from "../types";

export class DelhiveryResolver implements ShipmentResolver {
  async resolve(shipment: ShipmentData): Promise<TrackingResult> {
    return {
      status: 'UNKNOWN',
      message: 'Track your shipment on the Delhivery website.',
      trackingUrl: `https://www.delhivery.com/track/package/${shipment.trackingNumber}`
    };
  }

  getProviderName(): string {
    return "Delhivery";
  }
}
