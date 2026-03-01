const functions = require("firebase-functions");
const fetch = require("node-fetch");

// Cloud Function: llamaChat
exports.llamaChat = functions.https.onCall(async (data, context) => {
  const userMessage = data.prompt || "";

  // Strict system prompt
  const systemPrompt = `You are a friendly coding/chat assistant.
- Only respond to explicit user input.
- If the user asks a general question, reply warmly and clearly, staying strictly on topic.
- If the user asks for code, generate ONLY one complete, ready-to-paste code block inside fenced syntax (e.g. \`\`\`python ... \`\`\`).
- Do not split code into multiple blocks. Always give the entire code in one fenced block.
- Do not add explanations, commentary, or filler text after the code unless explicitly asked.
- Do not provide medical, health, or unrelated advice.
User: ${userMessage}
Assistant:`;

  try {
    const llamaRes = await fetch("http://localhost:8080/completion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: systemPrompt,
        n_predict: 128,
      }),
    });

    if (!llamaRes.ok) {
      throw new Error(`Llama server error: ${llamaRes.status} ${llamaRes.statusText}`);
    }

    const dataRes = await llamaRes.json();

    // Extract reply safely
    let reply =
      dataRes?.content?.[0]?.text || dataRes?.content || "";

    // Prevent stray empty or unsolicited replies
    if (!reply || reply.trim() === "") {
      reply = "⚠️ No reply generated.";
    }

    return { reply };
  } catch (err) {
    console.error("Error connecting to Llama server:", err);
    return { reply: "⚠️ Error: could not reach Llama server." };
  }
});