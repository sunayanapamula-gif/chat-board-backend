const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/completion", async (req, res) => {
  const { message } = req.body;
  try {
    const llamaRes = await fetch("http://127.0.0.1:8080/completion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: message, n_predict: 128 })
    });
    const data = await llamaRes.json();
    res.json({ reply: data.content });
  } catch (err) {
    res.json({ reply: "Error connecting to Llama server." });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));