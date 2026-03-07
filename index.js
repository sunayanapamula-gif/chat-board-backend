const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/ping", (req, res) => {
  res.json({ status: "Backend is alive 🚀" });
});

// Completion route
app.post("/completion", async (req, res) => {
  const { message } = req.body;

  try {
    // Forward to Llama server (local or cloud)
    const llamaResponse = await fetch("http://localhost:8080/completion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await llamaResponse.json();
    res.json({ reply: data.reply || "No reply from Llama server." });
  } catch (error) {
    console.error("Error contacting Llama server:", error);
    res.status(500).json({ reply: "⚠️ Backend error: could not reach Llama server." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});