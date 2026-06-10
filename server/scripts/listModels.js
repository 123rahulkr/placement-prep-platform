require("dotenv").config({ path: "../.env" });
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function list() {
  try {
    const models = await genAI.listModels();
    console.log("Available models:\n");
    for await (const model of models) {
      console.log(model.name);
      console.log("  Methods:", model.supportedGenerationMethods);
      console.log("");
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

list();
