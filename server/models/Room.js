import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, unique: true },
    code: { type: String, default: "// Start coding..." },
    language: { type: String, default: "javascript" },
  },
  { timestamps: true } // ✅ This ensures `createdAt` and `updatedAt` are automatically updated
);

export default mongoose.model("Room", RoomSchema);
