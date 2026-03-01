// src/api.js
export async function getCompletion(prompt) {
  const response = await fetch("http://localhost:8080/completion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  if (!response.ok) {
    throw new Error("Backend error: " + response.statusText);
  }

  return response.json();
}