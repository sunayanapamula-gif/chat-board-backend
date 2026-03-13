// src/api.js

// Use environment variable if available, fallback to your Railway backend URL
const API_URL =
  process.env.REACT_APP_BACKEND_URL ||
  "https://chat-board-backend-production-51a5.up.railway.app";

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
 * Optional health check to verify backend connectivity
 * @returns {Promise<string>} - Health status message
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_URL}/health`);
    if (!response.ok) {
      throw new Error("Health check failed: " + response.statusText);
    }
    return await response.text();
  } catch (error) {
    console.error("Error checking backend health:", error);
    throw error;
  }
}