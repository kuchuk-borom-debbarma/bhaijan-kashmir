import { ShipmentResolver } from "./types";
import { BlueDartResolver } from "./resolvers/bluedart";
import { DelhiveryResolver } from "./resolvers/delhivery";
import { MockResolver } from "./resolvers/mock";

export class ShipmentFactory {
  static getResolver(providerName: string): ShipmentResolver {
    switch (providerName.toLowerCase()) {
      case 'bluedart':
        return new BlueDartResolver();
      case 'delhivery':
        return new DelhiveryResolver();
      case 'mock':
      case 'mockcourier':
        return new MockResolver();
      default:
        // Fallback for unknown providers
        return {
          resolve: async (_data) => ({
             status: 'UNKNOWN',
             message: 'Carrier details available.',
             trackingUrl: undefined
          }),
          getProviderName: () => providerName
        };
    }
  }

  static getAvailableProviders(): string[] {
    return ['BlueDart', 'Delhivery', 'MockCourier'];
  }
}
