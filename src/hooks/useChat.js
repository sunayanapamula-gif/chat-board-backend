import { useState } from "react";
import axios from "axios";

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(message) {
    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setLoading(true);

    try {
      const res = await axios.post(
        "https://chat-board-backend-production-2008.up.railway.app/completion",
        { message }
      );

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: res.data.reply }
      ]);
    } catch (err) {
      console.error("Error calling backend:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "⚠️ Error: could not reach backend." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return { messages, sendMessage, loading };
}