const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Middleware
app.use(cors());          // allow requests from frontend (localhost:3000, Firebase Hosting, Render, etc.)
app.use(express.json());  // parse JSON body

// ✅ Example endpoint
app.post("/completion", (req, res) => {
  const { prompt } = req.body;

  // For demo, just echo back
  res.json({ reply: `You said: ${prompt}` });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});