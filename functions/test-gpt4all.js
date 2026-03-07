const { LLModel } = require("gpt4all");

async function runTest() {
  try {
    const modelPath = "C:\\Users\\sunay\\AppData\\Local\\nomic.ai\\GPT4All\\models\\mistral-7b-instruct-v0.1.Q4_0.gguf";
    console.log("Loading model from:", modelPath);

    // Construct LLModel directly with the path string
    const model = new LLModel(modelPath);

    // Initialize the model
    await model.open();
    console.log("Model initialized ✅");

    // Generate a reply
    const reply = await model.prompt("Hello GPT4All");
    console.log("Reply:", reply);
  } catch (error) {
    console.error("Error:", error);
  }
}

runTest();