// src/api.js

// Use environment variable if available, fallback to your Railway backend URL
const API_URL =
  process.env.REACT_APP_API_BASE ||
  "https://chat-board-backend-production-2a27.up.railway.app";

/**
 * Send a message to the backend and get a completion response
 * @param {string} message - The user’s input message
 * @returns {Promise<object>} - The backend JSON response
 */
export async function getCompletion(message) {
  try {
    const response = await fetch(`${API_URL}/completion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }), // backend expects { message }
    });

    if (!response.ok) {
      throw new Error("Backend error: " + response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching completion:", error);
    throw error;
  }
}

/**
 * Health check to verify backend connectivity
 * @returns {Promise<object>} - Health status JSON
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_URL}/ping`);
    if (!response.ok) {
      throw new Error("Health check failed: " + response.statusText);
    }
    return await response.json();
  } catch (error) {
    console.error("Error checking backend health:", error);
    throw error;
  }
}
