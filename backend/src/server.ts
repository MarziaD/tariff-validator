import express, { Request, Response } from "express";
import multer from "multer";
import cors from "cors";
import { TariffValidator } from "./validators/tariffValidator";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const validator = new TariffValidator();

app.use(cors());

app.post(
  "/validate",
  upload.single("file"),
  async (req: MulterRequest, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
      }

      const result = await validator.validateTariffs(
        req.file.buffer,
        req.file.mimetype
      );

      res.json(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ message: errorMessage });
    }
  }
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
