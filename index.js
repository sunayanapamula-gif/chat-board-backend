const express = require("express");
const app = express();

app.use(express.json()); // ✅ required to parse JSON body

app.post("/completion", (req, res) => {
  const userMessage = req.body.message;
  res.json({ reply: "You said: " + userMessage });
});

app.listen(8080, () => console.log("Server running on port 8080"));