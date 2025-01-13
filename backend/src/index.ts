import express, { Request, Response } from "express";
import multer from "multer";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import csvParser from "csv-parser";

const app = express();

app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.json());
app.use(bodyParser.json());

app.post(
  "/api/validate-csv",
  upload.single("file"),
  (req: Request, res: Response) => {
    const results: any[] = [];
    const filePath = req.file?.path;

    if (filePath) {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", (data: any) => results.push(data))
        .on("end", () => {
          const discrepancies = validateDiscrepancies(results);
          res.json({ message: "CSV received", discrepancies });
        });
    } else {
      res.status(400).json({ error: "No file uploaded" });
    }
  }
);

function validateDiscrepancies(inputData: any[]): any[] {
  const mockENAPIData = [
    { plan_name: "Basic Plan", price_per_kwh: 0.25 },
    { plan_name: "Value Rate", price_per_kwh: 0.32 },
  ];

  const discrepancies = inputData.filter((item) => {
    return !mockENAPIData.some(
      (apiData) =>
        apiData.plan_name === item.plan_name &&
        apiData.price_per_kwh === parseFloat(item.price_per_kwh)
    );
  });

  return discrepancies;
}

app.get("/", (_, res: Response) => {
  res.send("Hello, World!");
});

app.get("/api/tariffs", (_, res: Response) => {
  res.json({ message: "Tariffs data" });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
