import { OCPITariff } from "../types/ocpi";

// Mock ENAPI's OCPI implementation for Finest Charge Ltd.
export class ENAPIMockService {
  async getTariff(region: string): Promise<OCPITariff> {
    const mockTariffs: { [key: string]: OCPITariff } = {
      London: {
        id: "finest-charge-london",
        currency: "GBP",
        elements: [
          {
            price_components: [
              {
                type: "ENERGY",
                price: 0.28,
                step_size: 1,
              },
              {
                type: "TIME",
                price: 3.0,
                step_size: 3600,
              },
            ],
          },
        ],
        last_updated: new Date().toISOString(),
      },
      Other: {
        id: "finest-charge-other",
        currency: "GBP",
        elements: [
          {
            price_components: [
              {
                type: "ENERGY",
                price: 0.25,
                step_size: 1,
              },
              {
                type: "TIME",
                price: 2.0,
                step_size: 3600,
              },
            ],
          },
        ],
        last_updated: new Date().toISOString(),
      },
      Manchester: {
        id: "finest-charge-manchester",
        currency: "GBP",
        elements: [
          {
            price_components: [
              {
                type: "ENERGY",
                price: 0.27,
                step_size: 1,
              },
              {
                type: "TIME",
                price: 2.5,
                step_size: 3600,
              },
            ],
          },
        ],
        last_updated: new Date().toISOString(),
      },
    };

    const tariff = mockTariffs[region];
    console.log("Found tariff:", tariff);

    return tariff || mockTariffs["Other"];
  }
}
