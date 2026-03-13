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

// 🔗 Log the llama server URL at startup
const llamaServerUrl =
  process.env.LLAMA_SERVER_URL || "http://llama-server:8080/completion";
console.log("🔗 Using Llama server URL:", llamaServerUrl);

// ✅ Chat completion route
app.post("/completion", async (req, res) => {
  const { message } = req.body;
  try {
    const systemPrompt = `You are a coding assistant.
User: ${message}
Assistant:`;

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
