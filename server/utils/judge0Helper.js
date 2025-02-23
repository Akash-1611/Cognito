import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com/submissions";
const RAPID_API_KEY = process.env.RAPID_API_KEY; // Store in .env file

const languageMap = {
  javascript: 63, // Node.js
  python: 71, // Python 3
  cpp: 54, // C++
};

export const runCode = async (code, language) => {
  if (!languageMap[language]) {
    throw new Error("Unsupported language!");
  }

  try {
    // ✅ 1. Send code to Judge0 API
    const { data } = await axios.post(
      `${JUDGE0_API_URL}?base64_encoded=false&wait=true`,
      {
        source_code: code,
        language_id: languageMap[language],
        stdin: "",
      },
      {
        headers: {
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "X-RapidAPI-Key": RAPID_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    // ✅ 2. Get execution result
    return { output: data.stdout || data.stderr || "No output" };
  } catch (error) {
    console.error("Judge0 API Error:", error);
    throw new Error("Error executing code");
  }
};
