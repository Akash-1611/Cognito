import mongoose from "mongoose";

const CodeFileSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true }, // Room ID for collaboration
  code: { type: String, required: true }, // Code content
  language: { type: String, required: true }, // Programming language
});

export default mongoose.model("CodeFile", CodeFileSchema);
