import React from "react";
import ChatBoard from "./ChatBoard";

// ✅ Detect environment: use localhost:5000 in dev, Railway URL in production
const backendUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://chat-board-backend-production.up.railway.app";

// ✅ API call wrapper
async function callBackend(message) {
  try {
    const response = await fetch(`${backendUrl}/completion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }), // send { "message": "Hello" }
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // ✅ Ensure we always return a reply string
    return { reply: data.reply || "No reply received from backend." };
  } catch (error) {
    console.error("Error calling backend:", error);
    return { reply: "⚠️ I couldn’t generate a reply, but I’m here 🙂✨💬" };
  }
}

function App() {
  return (
    <div className="App">
      {/* Pass backend function into ChatBoard */}
      <ChatBoard backendCall={callBackend} />
    </div>
  );
}

export default App;