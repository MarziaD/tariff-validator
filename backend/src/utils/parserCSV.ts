import fs from "fs";
import csvParser from "csv-parser";

interface CSVData {
  [key: string]: string | number;
}

const parserCSV = (filePath: string): Promise<CSVData[]> => {
  return new Promise((resolve, reject) => {
    const results: CSVData[] = [];
    fs.createReadStream(filePath)
      .pipe(csvParser({ separator: ";" }))
      .on("data", (data: CSVData) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err: Error) => reject(err));
  });
};

export { parserCSV };
