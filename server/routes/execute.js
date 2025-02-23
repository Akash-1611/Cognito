import express from "express";
import { runCode } from "../utils/judge0Helper.js";

const router = express.Router();

router.post("/run", async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: "Code and language are required!" });
    }

    const result = await runCode(code, language);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
