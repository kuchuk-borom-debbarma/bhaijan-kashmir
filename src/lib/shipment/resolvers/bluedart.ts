import { ShipmentData, ShipmentResolver, TrackingResult } from "../types";

export class BlueDartResolver implements ShipmentResolver {
  async resolve(shipment: ShipmentData): Promise<TrackingResult> {
    return {
      status: 'UNKNOWN', // Without real API, we can't know.
      message: 'Track your shipment on the BlueDart website.',
      trackingUrl: `https://www.bluedart.com/trackdart?handler=trakdart&trackable_id=${shipment.trackingNumber}`
    };
  }

  getProviderName(): string {
    return "BlueDart";
  }
}
