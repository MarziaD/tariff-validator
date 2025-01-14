import request from "supertest";
import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";

const filePath = path.join(__dirname, "test-files", "plans_data.csv");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }
  res.status(200).json({
    message: "File uploaded successfully",
    file: req.file,
  });
});

describe("POST /upload", () => {
  it("should return 400 if no file is uploaded", async () => {
    const res = await request(app).post("/upload");
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("No file uploaded");
  });

  it("should return 200 and file data if a file is uploaded successfully", async () => {
    const res = await request(app).post("/upload").attach("file", filePath);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("File uploaded successfully");
    expect(res.body.file).toBeDefined();
  });
});
