const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Middleware
app.use(cors());          // allow requests from frontend (Firebase Hosting, localhost, etc.)
app.use(express.json());  // parse JSON body

// ✅ Completion endpoint
app.post("/completion", (req, res) => {
  const { message } = req.body; // ✅ match frontend App.js

  // For demo, just echo back
  res.json({ reply: `You said: ${message}` });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});