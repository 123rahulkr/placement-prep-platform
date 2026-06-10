const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateEmbedding = async (text) => {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
};

const cosineSimilarity = (vectorA, vectorB) => {
  if (vectorA.length !== vectorB.length) return 0;

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] * vectorA[i];
    magnitudeB += vectorB[i] * vectorB[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) return 0;

  return dotProduct / (magnitudeA * magnitudeB);
};

const findSimilarProblems = (queryEmbedding, problems, topN = 15) => {
  const withScores = problems
    .filter((p) => p.embedding && p.embedding.length > 0)
    .map((problem) => ({
      ...problem.toObject(),
      similarityScore: cosineSimilarity(queryEmbedding, problem.embedding),
    }));

  withScores.sort((a, b) => b.similarityScore - a.similarityScore);
  return withScores.slice(0, topN);
};

module.exports = { generateEmbedding, cosineSimilarity, findSimilarProblems };
