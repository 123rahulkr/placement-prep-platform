const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeResume = async (resumeText, targetRole = "Software Engineer") => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
You are an expert ATS (Applicant Tracking System) and senior technical recruiter.
Analyze the resume below for a ${targetRole} position.

Return ONLY a valid JSON object with exactly this structure and nothing else.
No explanation, no markdown, no code blocks, just raw JSON:

{
  "atsScore": <number between 0 and 100>,
  "scoreBreakdown": {
    "formatting": <number out of 20>,
    "keywords": <number out of 30>,
    "experience": <number out of 25>,
    "skills": <number out of 25>
  },
  "presentKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "recruiterFeedback": "2 to 3 sentences of direct honest recruiter feedback",
  "overallVerdict": "<one of exactly these four values: Strong, Good, Needs Work, Weak>"
}

Resume text:
${resumeText}
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text().trim();

  if (text.startsWith("```json")) {
    text = text
      .replace(/^```json\n?/, "")
      .replace(/\n?```$/, "")
      .trim();
  } else if (text.startsWith("```")) {
    text = text
      .replace(/^```\n?/, "")
      .replace(/\n?```$/, "")
      .trim();
  }

  const analysis = JSON.parse(text);
  return analysis;
};

module.exports = { analyzeResume };
