import express, { Request, Response } from "express";
import multer from "multer";
import cors from "cors";

const app = express();

app.use(cors());

const upload = multer({ dest: "uploads/" });

app.post(
  "/upload",
  upload.single("file"),
  (req: Request & { file?: Express.Multer.File }, res: Response): void => {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }
    res.status(200).json({
      message: "File uploaded successfully",
      file: req.file,
    });
  }
);

app.listen(3001, () => {
  console.log("Backend server running on http://localhost:3001");
});
