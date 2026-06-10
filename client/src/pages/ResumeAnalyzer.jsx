import { useState } from "react";
import { analyzeResume } from "../services/resumeService";

const getScoreColor = (score) => {
  if (score >= 75) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
};

const getVerdictStyle = (verdict) => {
  const map = {
    Strong: "bg-green-50 text-green-700 border-green-200",
    Good: "bg-blue-50 text-blue-700 border-blue-200",
    "Needs Work": "bg-yellow-50 text-yellow-700 border-yellow-200",
    Weak: "bg-red-50 text-red-700 border-red-200",
  };
  return map[verdict] || "bg-gray-50 text-gray-700 border-gray-200";
};

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.type !== "application/pdf") {
      setError("Please select a PDF file only");
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB");
      return;
    }

    setFile(selected);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError("Please select a file first");

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await analyzeResume(file, targetRole);
      setResult(data.analysis);
    } catch (err) {
      setError(
        err.response?.data?.message || "Analysis failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <span className="font-mono text-sm font-medium text-gray-900">
          prep.ai / resume analyzer
        </span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Resume Analyzer
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload your resume PDF and get an ATS score, keyword gaps, and
            recruiter-style feedback powered by Gemini AI.
          </p>
        </div>

        {/* Upload form */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Backend Developer, Full Stack Engineer"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                Gemini will evaluate your resume against this specific role
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resume PDF
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-md px-6 py-10 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-file-input"
                />
                <label htmlFor="resume-file-input" className="cursor-pointer">
                  {file ? (
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB — click to
                        change
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-600">
                        Click to upload your resume
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PDF only, max 5MB
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full py-2 px-4 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Analyzing your resume..." : "Analyze Resume"}
            </button>

            {loading && (
              <p className="text-xs text-gray-400 text-center">
                Uploading to S3 and running Gemini AI analysis. This takes 10 to
                20 seconds.
              </p>
            )}
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* ATS Score and Verdict */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                    ATS Score
                  </p>
                  <p
                    className={`text-5xl font-semibold ${getScoreColor(result.atsScore)}`}
                  >
                    {result.atsScore}
                    <span className="text-2xl text-gray-400 font-normal">
                      /100
                    </span>
                  </p>
                </div>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-md border ${getVerdictStyle(result.overallVerdict)}`}
                >
                  {result.overallVerdict}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(result.scoreBreakdown).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 rounded-md p-3">
                    <p className="text-xs text-gray-500 capitalize mb-1">
                      {key}
                    </p>
                    <p className="text-lg font-medium text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recruiter Feedback */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Recruiter Feedback
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {result.recruiterFeedback}
              </p>
            </div>

            {/* Keywords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Keywords Found
                  <span className="ml-2 text-xs font-normal text-green-600">
                    {result.presentKeywords.length} detected
                  </span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.presentKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="text-xs px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Missing Keywords
                  <span className="ml-2 text-xs font-normal text-red-500">
                    {result.missingKeywords.length} missing
                  </span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="text-xs px-2 py-1 bg-red-50 text-red-600 border border-red-200 rounded"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Strengths and Improvements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {result.strengths.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-600">
                      <span className="text-green-500 font-medium mt-0.5">
                        +
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Improvements
                </h3>
                <ul className="space-y-2">
                  {result.improvements.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-600">
                      <span className="text-red-400 font-medium mt-0.5">-</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
