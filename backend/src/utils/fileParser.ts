import csv from "csv-parser";
import { Readable } from "stream";
import * as cheerio from "cheerio";
import {
  OCPITariff,
  TariffElement,
  PriceComponent,
  Restrictions,
} from "../types/ocpi";

export async function parseFileContent(
  buffer: Buffer,
  fileType: string
): Promise<OCPITariff[]> {
  switch (fileType) {
    case "text/csv":
      return parseCSV(buffer);
    case "application/json":
      return parseJSON(buffer);
    case "text/html":
      return parseHTML(buffer);
    default:
      throw new Error("Unsupported file type");
  }
}

function convertToOCPITariff(data: any): OCPITariff {
  const priceComponents: PriceComponent[] = [];

  if (typeof data.price_per_kwh === "number") {
    priceComponents.push({
      type: "ENERGY",
      price: data.price_per_kwh,
      step_size: 1,
    });
  }

  if (typeof data.hourly_parking_rate === "number") {
    priceComponents.push({
      type: "TIME",
      price: data.hourly_parking_rate,
      step_size: 3600,
    });
  }

  let restrictions: Restrictions | undefined;
  if (data.start_time || data.end_time) {
    restrictions = {
      start_time: data.start_time,
      end_time: data.end_time,
    };
  }

  const tariffElement: TariffElement = {
    price_components: priceComponents,
    ...(restrictions && { restrictions }),
  };

  return {
    id: data.plan_name
      ? `tariff-${data.plan_name.toLowerCase().replace(/\s+/g, "-")}`
      : `tariff-${Date.now()}`,
    currency: data.currency || "EUR",
    elements: [tariffElement],
    last_updated: new Date().toISOString(),
  };
}

async function parseCSV(buffer: Buffer): Promise<OCPITariff[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    const readable = Readable.from(buffer.toString());

    readable
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        const ocpiTariffs = results.map(convertToOCPITariff);
        resolve(ocpiTariffs);
      })
      .on("error", reject);
  });
}

function parseJSON(buffer: Buffer): OCPITariff[] {
  try {
    const data = JSON.parse(buffer.toString());
    const tariffs = data.tariffs || data;
    const tariffArray = Array.isArray(tariffs) ? tariffs : [tariffs];
    return tariffArray.map(convertToOCPITariff);
  } catch (error) {
    throw new Error("Invalid JSON format");
  }
}

function parseHTML(buffer: Buffer): OCPITariff[] {
  try {
    const html = buffer.toString();
    const $ = cheerio.load(html);
    const results: any[] = [];

    $("table tr").each((i, row) => {
      if (i === 0) return;

      const cells = $(row).find("td");
      if (cells.length >= 6) {
        const tariffData = {
          plan_name: $(cells[0]).text().trim(),
          currency: $(cells[1]).text().trim(),
          price_per_kwh: parseFloat($(cells[2]).text().trim()),
          hourly_parking_rate: parseFloat($(cells[3]).text().trim()),
          start_time: $(cells[4]).text().trim(),
          end_time: $(cells[5]).text().trim(),
        };
        results.push(tariffData);
      }
    });

    if (results.length === 0) {
      $(".tariff-data").each((i, elem) => {
        const tariffData = {
          plan_name: $(elem).find(".plan-name").text().trim(),
          currency: $(elem).find(".currency").text().trim(),
          price_per_kwh: parseFloat($(elem).find(".price").text().trim()),
          hourly_parking_rate: parseFloat(
            $(elem).find(".parking-rate").text().trim()
          ),
          start_time: $(elem).find(".start-time").text().trim(),
          end_time: $(elem).find(".end-time").text().trim(),
        };
        results.push(tariffData);
      });
    }

    if (results.length === 0) {
      const text = $("body").text();
      const tariffData = extractTariffFromText(text);
      if (tariffData) {
        results.push(tariffData);
      }
    }

    if (results.length === 0) {
      throw new Error("No valid tariff data found in HTML");
    }

    return results.map(convertToOCPITariff);
  } catch (error) {
    throw new Error(
      `Error parsing HTML: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

function extractTariffFromText(text: string): any {
  const priceMatch = text.match(/price[:\s]+(\d+\.?\d*)/i);
  const currencyMatch = text.match(/currency[:\s]+([A-Z]{3})/i);
  const startTimeMatch = text.match(/start[:\s]+(\d{1,2}:\d{2})/i);
  const endTimeMatch = text.match(/end[:\s]+(\d{1,2}:\d{2})/i);
  const planNameMatch = text.match(/plan[:\s]+([^\n]+)/i);
  const parkingRateMatch = text.match(/parking[:\s]+(\d+\.?\d*)/i);

  if (priceMatch || currencyMatch) {
    return {
      plan_name: planNameMatch ? planNameMatch[1].trim() : "Default Plan",
      currency: currencyMatch ? currencyMatch[1] : "EUR",
      price_per_kwh: priceMatch ? parseFloat(priceMatch[1]) : 0,
      hourly_parking_rate: parkingRateMatch
        ? parseFloat(parkingRateMatch[1])
        : 0,
      start_time: startTimeMatch ? startTimeMatch[1] : "00:00",
      end_time: endTimeMatch ? endTimeMatch[1] : "23:59",
    };
  }

  return null;
}
