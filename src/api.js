// src/api.js

// Use environment variable if available, fallback to your backend Railway URL
const API_URL =
  process.env.REACT_APP_BACKEND_URL ||
  "https://chat-board-backend-production.up.railway.app";

export async function getCompletion(message) {
  const response = await fetch(`${API_URL}/completion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }), // backend expects { message }
  });

  if (!response.ok) {
    throw new Error("Backend error: " + response.statusText);
  }

  return response.json();
}