import express from "express";
import Room from "../models/Room.js"; // Import Room model

const router = express.Router();

/** ✅ Get Last Active Room */
router.get("/last-room", async (req, res) => {
  try {
    const lastRoom = await Room.findOne().sort({ updatedAt: -1 }); // Get the most recently updated room
    res.json(lastRoom || {}); // Return last active room or empty object
  } catch (error) {
    res.status(500).json({ message: "Error fetching last room", error });
  }
});

export default router; // ✅ Use ESM export
