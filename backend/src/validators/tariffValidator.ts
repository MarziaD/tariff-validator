import { OCPITariff, ValidationResult, Discrepancy } from "../types/ocpi";
import { ENAPIMockService } from "../services/enapiMock";
import { TariffParser } from "../parsers";

export class TariffValidator {
  #enapiService: ENAPIMockService;

  constructor() {
    this.#enapiService = new ENAPIMockService();
  }

  async validateTariffs(
    inputBuffer: Buffer,
    fileType: string
  ): Promise<ValidationResult> {
    try {
      const cpoTariffs = await TariffParser.parseInput(inputBuffer, fileType);
      const discrepancies: Discrepancy[] = [];

      for (const cpoTariff of cpoTariffs) {
        const enapiTariff = await this.#enapiService.getTariff(
          cpoTariff.provider
        );
        this.validateTariff(cpoTariff, enapiTariff, discrepancies);
      }

      return {
        isValid: discrepancies.length === 0,
        discrepancies,
      };
    } catch (error) {
      throw new Error(
        `Validation failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private validateTariff(
    cpoTariff: any,
    enapiTariff: OCPITariff,
    discrepancies: Discrepancy[]
  ): void {
    const enapiEnergyPrice = this.findPriceComponent(
      enapiTariff,
      "ENERGY"
    )?.price;
    if (enapiEnergyPrice !== cpoTariff.price_per_kwh) {
      discrepancies.push({
        field: "energy_price",
        expected: cpoTariff.price_per_kwh,
        actual: enapiEnergyPrice,
        message: `Energy price mismatch for ${cpoTariff.plan_name}`,
      });
    }

    const enapiTimePrice = this.findPriceComponent(enapiTariff, "TIME")?.price;
    if (enapiTimePrice !== cpoTariff.hourly_parking_rate) {
      discrepancies.push({
        field: "parking_rate",
        expected: cpoTariff.hourly_parking_rate,
        actual: enapiTimePrice,
        message: `Parking rate mismatch for ${cpoTariff.plan_name}`,
      });
    }

    if (enapiTariff.currency !== cpoTariff.currency) {
      discrepancies.push({
        field: "currency",
        expected: cpoTariff.currency,
        actual: enapiTariff.currency,
        message: `Currency mismatch for ${cpoTariff.plan_name}`,
      });
    }
  }

  private findPriceComponent(tariff: OCPITariff, type: string) {
    return tariff.elements[0]?.price_components.find((pc) => pc.type === type);
  }
}
