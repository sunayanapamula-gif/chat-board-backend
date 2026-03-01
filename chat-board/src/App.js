import React from "react";
import ChatBoard from "./ChatBoard";

// Detect environment
const backendUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://chat-board-backend-production.up.railway.app";

async function callBackend(message) {
  try {
    const response = await fetch(`${backendUrl}/completion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    let reply = data.reply || "No reply received from backend.";
    reply = reply.replace(/^User:.*$/gmi, "").replace(/undefined/g, "").trim();

    return { reply };
  } catch (error) {
    console.error("Error calling backend:", error);
    return { reply: "⚠️ I couldn’t generate a reply, but I’m here 🙂✨💬" };
  }
}

function App() {
  return (
    <div className="App">
      <ChatBoard backendCall={callBackend} />
    </div>
  );
}

export default App;