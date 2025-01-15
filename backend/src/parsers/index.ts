import { Readable } from "stream";
import csv from "csv-parser";
import * as cheerio from "cheerio";

export class TariffParser {
  static async parseInput(buffer: Buffer, fileType: string): Promise<any[]> {
    switch (fileType) {
      case "text/csv":
        return this.parseCSV(buffer);
      case "application/json":
        return this.parseFinestChargeJSON(buffer);
      case "text/html":
        return this.parseHTML(buffer);
      default:
        throw new Error("Unsupported file type");
    }
  }

  private static parseFinestChargeJSON(buffer: Buffer): any[] {
    try {
      const rawData = JSON.parse(buffer.toString());

      if (rawData.tariffs && Array.isArray(rawData.tariffs)) {
        const parsedTariffs = rawData.tariffs.map((tariff) => ({
          plan_name: `${tariff.region} Plan`,
          currency: "GBP",
          provider: "FINEST_CHARGE",
          price_per_kwh: Number(tariff.price_per_kwh),
          hourly_parking_rate: Number(tariff.parking_fee_per_hour),
          region: tariff.region,
        }));

        console.log("Parsed Tariffs:", parsedTariffs);
        return parsedTariffs;
      }

      throw new Error("Invalid JSON structure");
    } catch (error) {
      console.error("JSON parsing error:", error);
      throw error;
    }
  }

  private static async parseCSV(buffer: Buffer): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      const readable = Readable.from(buffer.toString());
      readable
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => resolve(results))
        .on("error", reject);
    });
  }

  private static parseHTML(buffer: Buffer): any[] {
    const $ = cheerio.load(buffer.toString());
    const results: any[] = [];

    $("table tr").each((i, row) => {
      if (i === 0) return;
      const cells = $(row).find("td");
      if (cells.length >= 6) {
        results.push({
          plan_name: $(cells[0]).text().trim(),
          currency: $(cells[1]).text().trim(),
          price_per_kwh: parseFloat($(cells[2]).text()),
          hourly_parking_rate: parseFloat($(cells[3]).text()),
          start_time: $(cells[4]).text().trim(),
          end_time: $(cells[5]).text().trim(),
        });
      }
    });

    return results;
  }
}
