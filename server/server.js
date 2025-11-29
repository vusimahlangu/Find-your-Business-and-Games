import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import { codmSystemMessage, localReplySystemMessage, sanitizeText } from "./prompts.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;
const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) {
  console.error("ERROR: OPENAI_API_KEY not set in environment.");
  process.exit(1);
}
// Basic in-memory rate limiting by IP for simple cost control
const usageCounts = {};
const DAILY_LIMIT = Number(process.env.DAILY_LIMIT_PER_IP || 200);
// Helper: enforce per-IP limit (simple)
function incrementUsage(ip) {
  const key = ip || "unknown";
  usageCounts[key] = (usageCounts[key] || 0) + 1;
  return usageCounts[key];
}
// Helper: call OpenAI Chat Completions
async function callOpenAI(messages, max_tokens = 700) {
  const url = "https://api.openai.com/v1/chat/completions";
  const body = {
    model: "gpt-4o-mini",
    messages,
    max_tokens,
    temperature: 0.2
  };
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`OpenAI error: ${resp.status} ${txt}`);
  }
  const data = await resp.json();
  return data;
}
// Root: serve static files (frontend) from /public
app.use(express.static("public"));
// Endpoint: CODM tips
app.post("/api/codm", async (req, res) => {
  try {
    const ip = req.ip;
    const count = incrementUsage(ip);
    if (count > DAILY_LIMIT) {
      return res.status(429).json({ error: "Daily request limit exceeded for this IP." });
    }
    const { weapon_type, playstyle, map, device, skill_level } = req.body;
    const userInput = {
      weapon_type: sanitizeText(weapon_type || ""),
      playstyle: sanitizeText(playstyle || ""),
      map: sanitizeText(map || ""),
      device: sanitizeText(device || ""),
      skill_level: sanitizeText(skill_level || "")
    };
    const userMessage = JSON.stringify(userInput);
    const messages = [
      { role: "system", content: codmSystemMessage },
      { role: "user", content: userMessage }
    ];
    const openaiResp = await callOpenAI(messages, 600);
    const assistant = openaiResp.choices?.[0]?.message?.content || "";
    // Try to parse JSON - models sometimes include backticks or explanation
    let parsed;
    try {
      parsed = JSON.parse(assistant);
    } catch (e) {
      // attempt to extract JSON substring
      const start = assistant.indexOf("{");
      const end = assistant.lastIndexOf("}");
      if (start !== -1 && end !== -1 && end > start) {
        const sub = assistant.substring(start, end + 1);
        parsed = JSON.parse(sub);
      } else {
        return res.status(500).json({ error: "Model did not return valid JSON", raw: assistant });
      }
    }
    return res.json({ success: true, result: parsed });
  } catch (err) {
    console.error("Error /api/codm:", err);
    return res.status(500).json({ error: err.message || String(err) });
  }
});
// Endpoint: Local business reply drafts
app.post("/api/localreply", async (req, res) => {
  try {
    const ip = req.ip;
    const count = incrementUsage(ip);
    if (count > DAILY_LIMIT) {
      return res.status(429).json({ error: "Daily request limit exceeded for this IP." });
    }
    const { business_type, customer_message, preferred_tone, extra_info } = req.body;
    const userInput = {
      business_type: sanitizeText(business_type || ""),
      customer_message: sanitizeText(customer_message || ""),
      preferred_tone: sanitizeText(preferred_tone || "friendly"),
      extra_info: sanitizeText(extra_info || "")
    };
    const userMessage = JSON.stringify(userInput);
    const messages = [
      { role: "system", content: localReplySystemMessage },
      { role: "user", content: userMessage }
    ];
    const openaiResp = await callOpenAI(messages, 500);
    const assistant = openaiResp.choices?.[0]?.message?.content || "";
    let parsed;
    try {
      parsed = JSON.parse(assistant);
    } catch (e) {
      const start = assistant.indexOf("{");
      const end = assistant.lastIndexOf("}");
      if (start !== -1 && end !== -1 && end > start) {
        const sub = assistant.substring(start, end + 1);
        parsed = JSON.parse(sub);
      } else {
        return res.status(500).json({ error: "Model did not return valid JSON", raw: assistant });
      }
    }
    return res.json({ success: true, result: parsed });
  } catch (err) {
    console.error("Error /api/localreply:", err);
    return res.status(500).json({ error: err.message || String(err) });
  }
});
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
}
