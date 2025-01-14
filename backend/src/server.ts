import express, { Request, Response } from "express";
import multer from "multer";
import cors from "cors";
import { validateTariffData } from "./tariffValidator";
import { parseFileContent } from "./utils/fileParser";

const app = express();

app.use(cors());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

app.post(
  "/upload",
  upload.single("file"),
  async (req: Request & { file?: Express.Multer.File }, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
      }

      const fileType = req.file.mimetype;
      if (!["text/csv", "application/json", "text/html"].includes(fileType)) {
        res.status(400).json({ message: "Invalid file type" });
        return;
      }

      const parsedData = await parseFileContent(req.file.buffer, fileType);

      const validationResult = validateTariffData(parsedData);

      res.status(200).json({
        message: "File validated successfully",
        validationResult,
        file: {
          filename: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
      });
    } catch (error) {
      console.error("Error processing file:", error);
      res.status(500).json({
        message: "Error processing file",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

app.listen(3001, () => {
  console.log("Backend server running on http://localhost:3001");
});
