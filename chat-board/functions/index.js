const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/completion", async (req, res) => {
  const userMessage = req.body.message?.trim() || "";

  let systemPrompt = `You are a friendly coding/chat assistant.
- Default to Python code unless the user explicitly requests another language.
- If the user asks for code, generate ONLY one complete, ready-to-paste code block inside fenced syntax (e.g. \`\`\`python ... \`\`\`).
- Do not split code into multiple blocks. Always give the entire code in one fenced block.
- Do not add explanations, commentary, or filler text after the code unless explicitly asked.
`;

  if (userMessage) {
    systemPrompt += `User: ${userMessage}\nAssistant:`;
  }

  try {
    const llamaRes = await fetch("http://localhost:8080/completion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: systemPrompt, n_predict: 128 }),
    });

    if (!llamaRes.ok) {
      throw new Error(`Llama server error: ${llamaRes.status} ${llamaRes.statusText}`);
    }

    const dataRes = await llamaRes.json();
    let reply = dataRes?.content?.[0]?.text || dataRes?.content || "";

    if (reply) {
      reply = reply.replace(/^User:.*$/gmi, "").replace(/undefined/g, "").trim();
      const assistantIndex = reply.indexOf("Assistant:");
      if (assistantIndex !== -1) {
        reply = reply.substring(assistantIndex + "Assistant:".length).trim();
      }
    }

    if (!reply || reply.trim() === "") {
      reply = "⚠️ No reply generated.";
    }

    res.json({ reply });
  } catch (err) {
    console.error("Error connecting to Llama server:", err);
    res.json({ reply: "⚠️ Error: could not reach Llama server." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));