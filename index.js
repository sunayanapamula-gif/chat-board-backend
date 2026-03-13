const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Root route (fixes "Cannot GET /")
app.get("/", (req, res) => {
  res.send("Chat-board backend is running ✅");
});

// ✅ Health check route
app.get("/ping", (req, res) => {
  res.json({ status: "Backend is alive 🚀" });
});

// ✅ Chat completion route
app.post("/completion", async (req, res) => {
  const { message } = req.body;

  try {
    const systemPrompt = `You are a coding assistant.
- If the user asks for code, respond ONLY with one complete, ready-to-paste code block inside fenced syntax (e.g. \`\`\`python ... \`\`\`).
- Default to Python unless another language is explicitly requested.
- Do NOT add explanations, commentary, or filler text unless the user asks for it.
- Do NOT generate multiple code blocks. Only one fenced block per reply.
- For non-code questions, reply politely and concisely (max 3 sentences).
User: ${message}
Assistant:`;

    const llamaServerUrl =
      process.env.LLAMA_SERVER_URL || "http://llama-server:8080/completion";

    const llamaRes = await fetch(llamaServerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: systemPrompt, n_predict: 256 }),
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

    const lines = reply.split("\n");
    if (lines.length > 30) {
      reply = lines.slice(0, 30).join("\n") + "\n... (truncated)";
    }
    const sentences = reply.split(/[.!?]/);
    if (sentences.length > 3 && !reply.includes("```")) {
      reply = sentences.slice(0, 3).join(". ") + "...";
    }

    if (!reply) {
      reply = "⚠️ No reply generated.";
    }

    res.json({ reply });
  } catch (err) {
    console.error("Error connecting to Llama server:", err);
    res.status(500).json({ reply: "⚠️ Error: could not reach Llama server." });
  }
});

// ✅ Start backend server with Railway dynamic port
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
