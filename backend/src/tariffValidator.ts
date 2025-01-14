import { OCPITariff, ValidationResult, Discrepancy } from "./types/ocpi";

export function validateTariffData(inputData: any): ValidationResult {
  const discrepancies: Discrepancy[] = [];

  // Handle different input formats
  const tariffs = Array.isArray(inputData) ? inputData : [inputData];

  tariffs.forEach((tariff, index) => {
    // Validate currency
    if (!isValidCurrency(tariff.currency)) {
      discrepancies.push({
        field: `tariffs[${index}].currency`,
        expected: "Valid ISO 4217 currency code",
        actual: tariff.currency,
        message: "Invalid currency code",
      });
    }

    // Validate price components
    if (typeof tariff.price_per_kwh !== "number" || tariff.price_per_kwh < 0) {
      discrepancies.push({
        field: `tariffs[${index}].price_per_kwh`,
        expected: "Positive number",
        actual: tariff.price_per_kwh,
        message: "Invalid price per kWh",
      });
    }

    // Validate time restrictions
    if (tariff.start_time && !isValidTimeFormat(tariff.start_time)) {
      discrepancies.push({
        field: `tariffs[${index}].start_time`,
        expected: "HH:mm format",
        actual: tariff.start_time,
        message: "Invalid start time format",
      });
    }

    if (tariff.end_time && !isValidTimeFormat(tariff.end_time)) {
      discrepancies.push({
        field: `tariffs[${index}].end_time`,
        expected: "HH:mm format",
        actual: tariff.end_time,
        message: "Invalid end time format",
      });
    }

    // Add more validation rules based on OCPI specification
  });

  return {
    isValid: discrepancies.length === 0,
    discrepancies,
  };
}

function isValidCurrency(currency: string): boolean {
  return /^[A-Z]{3}$/.test(currency);
}

function isValidTimeFormat(time: string): boolean {
  return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
}
