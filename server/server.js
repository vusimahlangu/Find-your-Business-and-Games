import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import { codmSystemMessage, localReplySystemMessage, sanitizeText } from "./prompts.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
const PORT = process.env.PORT || 3000;
const OPENAI_KEY = process.env.OPENAI_API_KEY;
app.post("/api/codm", async (req, res) => {
  try {
    const { weapon_type, playstyle } = req.body;
    const response = { success: true, result: { title: "CODM Tips", tips: ["Practice aiming", "Learn map layouts"] }};
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/localreply", async (req, res) => {
  try {
    const { business_type, customer_message } = req.body;
    const response = { success: true, result: { suggested_reply: "Thank you for your message. We will respond shortly." }};
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
