require("dotenv").config({ path: "../.env" });
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const modelsToTry = [
  "text-embedding-004",
  "embedding-001",
  "models/text-embedding-004",
  "models/embedding-001",
  "gemini-embedding-exp-03-07",
  "models/gemini-embedding-exp-03-07",
];

async function tryModel(modelName) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.embedContent({
      content: {
        parts: [{ text: "test embedding" }],
        role: "user",
      },
    });
    console.log(
      `SUCCESS: ${modelName} — got ${result.embedding.values.length} dimensions`,
    );
    return true;
  } catch (err) {
    console.log(`FAILED: ${modelName} — ${err.message.substring(0, 80)}`);
    return false;
  }
}

async function main() {
  console.log("Testing embedding models...\n");
  for (const modelName of modelsToTry) {
    const success = await tryModel(modelName);
    if (success) {
      console.log(`\nUse this model name: "${modelName}"`);
      break;
    }
    await new Promise((r) => setTimeout(r, 500));
  }
}

main();
