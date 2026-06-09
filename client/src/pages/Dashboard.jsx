import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const features = [
  {
    title: "Resume Analyzer",
    description: "ATS score, keyword analysis, recruiter feedback",
    phase: "Phase 3",
    link: "/resume",
    ready: false,
  },
  {
    title: "DSA Roadmap",
    description: "Company-specific problem sets using AI",
    phase: "Phase 4",
    link: "/dsa",
    ready: false,
  },
  {
    title: "Mock Interview",
    description: "AI interviewer with follow-up questions",
    phase: "Phase 5",
    link: "/interview",
    ready: false,
  },
  {
    title: "Job Tracker",
    description: "Track applications and interview stages",
    phase: "Phase 7",
    link: "/jobs",
    ready: false,
  },
];

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <span className="font-mono text-sm font-medium text-gray-900">
          prep.ai
        </span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome, {user?.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Your placement prep dashboard. Pick where you want to start.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white border border-gray-200 rounded-lg p-5"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900">
                  {feature.title}
                </h3>
                <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                  {feature.phase}
                </span>
              </div>
              <p className="text-sm text-gray-500">{feature.description}</p>
              <div className="mt-3">
                {feature.ready ? (
                  <Link
                    to={feature.link}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Open
                  </Link>
                ) : (
                  <span className="text-xs text-gray-400">Coming soon</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
