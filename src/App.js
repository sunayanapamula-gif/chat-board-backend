import React from "react";
import ChatBoard from "./ChatBoard";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

async function callBackend(message) {
  try {
    const response = await fetch(`${backendUrl}/completion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: message, max_tokens: 64 }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    let reply = data.content || "No reply received from backend.";
    reply = reply
      .replace(/^User:.*$/gmi, "")
      .replace(/undefined/g, "")
      .trim();

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