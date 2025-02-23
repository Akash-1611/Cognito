import express from "express";
import multer from "multer";
import CodeFile from "../models/CodeFile.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { originalname, buffer } = req.file;
    const { language } = req.body;
    const code = buffer.toString("utf-8");

    const newFile = new CodeFile({ filename: originalname, language, code });
    await newFile.save();

    res.json({ message: "✅ File uploaded successfully!", file: newFile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const files = await CodeFile.find().sort({ createdAt: -1 });
    res.json({ files });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
