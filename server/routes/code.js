import express from "express";
import CodeFile from "../models/CodeFile.js"; // Import the Code model

const router = express.Router();

/** ✅ API to Load Code from Database */
router.get("/load/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const file = await CodeFile.findOne({ roomId });

    if (file) {
      res.json({ code: file.code, language: file.language });
    } else {
      res.json({ code: "// Start coding...", language: "javascript" }); // Default code
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/** ✅ API to Save Code to Database */
router.post("/save", async (req, res) => {
  try {
    const { roomId, code, language } = req.body;

    if (!roomId) return res.status(400).json({ error: "Room ID is required" });

    await CodeFile.updateOne(
      { roomId },
      { $set: { code, language } },  // ✅ Use `$set` to update specific fields
      { upsert: true }  // ✅ Ensures document is created if not exists
    );

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error saving code:", error);
    res.status(500).json({ error: error.message });
  }
});


export default router;
