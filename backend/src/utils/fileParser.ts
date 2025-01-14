import csv from "csv-parser";
import { Readable } from "stream";

export async function parseFileContent(
  buffer: Buffer,
  fileType: string
): Promise<any> {
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

async function parseCSV(buffer: Buffer): Promise<any[]> {
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

function parseJSON(buffer: Buffer): any {
  try {
    return JSON.parse(buffer.toString());
  } catch (error) {
    throw new Error("Invalid JSON format");
  }
}

function parseHTML(buffer: Buffer): any {
  // Add HTML parsing logic if needed
  throw new Error("HTML parsing not implemented");
}
