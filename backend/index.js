// backend/index.js
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();

// Railway assigns a dynamic port, so always use process.env.PORT
const PORT = process.env.PORT || 8080;

// Use Railway variable for llama-deploy, fallback to your deployed domain
const LLAMA_URL =
  process.env.LLAMA_URL ||
  "https://llama-deploy-production.up.railway.app/completion";

app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("🚀 Chat-board backend is running! Try /ping or POST /completion");
});

// Health check routes
app.get("/ping", (req, res) => {
  res.json({ status: "Backend is alive 🚀" });
});

app.get("/health", (req, res) => {
  res.send("OK");
});

// Chat completion route
app.post("/completion", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "⚠️ No message provided." });
  }

  try {
    const systemPrompt = `You are a coding assistant.
- If the user asks for code, respond ONLY with one complete, ready-to-paste code block inside fenced syntax (e.g. \`\`\`python ... \`\`\`).
- Default to Python unless another language is explicitly requested.
- Do NOT add explanations, commentary, or filler text unless the user asks for it.
- Do NOT generate multiple code blocks. Only one fenced block per reply.
- For non-code questions, reply politely and concisely (max 3 sentences).

User: ${message}
Assistant:`;

    const llamaRes = await fetch(LLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: systemPrompt,
        n_predict: 256,
      }),
    });

    if (!llamaRes.ok) {
      throw new Error(`Llama server error: ${llamaRes.status} ${llamaRes.statusText}`);
    }

    const data = await llamaRes.json();
    let reply = data?.content?.[0]?.text || data?.content || "";

    reply = reply
      .replace(/^User:.*$/gmi, "")
      .replace(/^Assistant:/gmi, "")
      .replace(/undefined/g, "")
      .trim();

    if (!reply) {
      reply = "⚠️ No reply generated.";
    }

    res.json({ reply });
  } catch (err) {
    console.error("Error connecting to Llama server:", err);
    res.status(500).json({ reply: "⚠️ Error: could not reach Llama server." });
  }
});

// Start backend server — bind to 0.0.0.0 for Railway
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});