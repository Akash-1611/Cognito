import express from "express";
import Room from "../models/Room.js";

const router = express.Router();

/** ✅ API to Create a New Room */
router.post("/create-room", async (req, res) => {
  console.log("🔍 Incoming Request to /create-room");
  console.log("📦 Headers:", req.headers);

  try {
    const roomId = Math.random().toString(36).substring(2, 10);
    await Room.create({ roomId });
    res.json({ roomId });
  } catch (error) {
    console.error("❌ Error Creating Room:", error);
    res.status(500).json({ error: error.message });
  }
});


/** ✅ API to Join an Existing Room */
router.post("/join-room", async (req, res) => {
  try {
    const { roomId } = req.body;
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
