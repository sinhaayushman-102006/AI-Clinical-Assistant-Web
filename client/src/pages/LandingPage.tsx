import { useNavigate } from "react-router-dom";

export default function LandingPage() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-transparent text-white overflow-hidden">

      {/* Navbar */}

      <nav className="flex justify-between items-center px-10 py-6">

        <h1 className="text-3xl font-bold text-cyan-400">
          ClinicalAI
        </h1>

        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 rounded-full bg-cyan-500 text-black font-semibold hover:scale-105 transition"
        >
          Launch Platform
        </button>

      </nav>

      {/* Hero */}

      <section className="max-w-7xl mx-auto px-10 grid lg:grid-cols-2 gap-12 items-center min-h-[85vh]">

        {/* Left Side */}

        <div>

          <p className="uppercase tracking-[4px] text-cyan-400 mb-4 text-sm sm:text-base">
            Healthcare Agentic AI
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">



            Transform Clinical
            <br />
            Decision Making
            <br />
            With Trusted AI

          </h1>

          <p className="mt-8 text-slate-300 text-xl max-w-xl">

            Evidence-backed clinical intelligence powered
            by Multi-Agent AI, Advanced RAG,
            OpenRouter LLMs and verified medical guidelines.

          </p>

          <div className="flex gap-4 mt-10">

            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-4 rounded-full bg-cyan-500 text-black font-semibold"
            >
              View Demo
            </button>

            <button
              className="px-8 py-4 rounded-full border border-white"
            >
              GitHub Repo
            </button>

          </div>

          {/* Stats */}

          <div className="grid grid-cols-3 gap-10 mt-16">

            <div>
              <h2 className="text-4xl font-bold text-cyan-400">
                5
              </h2>

              <p className="text-slate-400">
                AI Agents
              </p>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-cyan-400">
                99.2%
              </h2>

              <p className="text-slate-400">
                Verified
              </p>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-cyan-400">
                24/7
              </h2>

              <p className="text-slate-400">
                Support
              </p>
            </div>

          </div>

        </div>

        {/* Right Side */}

        <div className="relative flex justify-center items-center">

          {/* Outer Rings */}

          <div className="absolute w-[650px] h-[650px] border border-cyan-500/20 rounded-full animate-spin-slow"></div>

          <div className="absolute w-[520px] h-[520px] border border-blue-500/20 rounded-full animate-spin-reverse"></div>

          <div className="absolute w-[420px] h-[420px] border border-cyan-400/20 rounded-full animate-spin-slow"></div>

          {/* Earth */}

          <div className="w-80 h-80 rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-700 shadow-[0_0_120px_rgba(34,211,238,0.8)] animate-spin-slow">
          </div>

          {/* Agent Cards */}

          <div className="absolute top-10 left-0 bg-slate-900 border border-cyan-500 px-4 py-3 rounded-xl">
            Planner Agent
          </div>

          <div className="absolute top-24 right-0 bg-slate-900 border border-cyan-500 px-4 py-3 rounded-xl">
            Retrieval Agent
          </div>

          <div className="absolute bottom-24 right-0 bg-slate-900 border border-cyan-500 px-4 py-3 rounded-xl">
            Diagnosis Agent
          </div>

          <div className="absolute bottom-10 left-10 bg-slate-900 border border-cyan-500 px-4 py-3 rounded-xl">
            Drug Agent
          </div>

          <div className="absolute left-0 top-1/2 bg-slate-900 border border-cyan-500 px-4 py-3 rounded-xl">
            Verification Agent
          </div>

        </div>

      </section>

    </div>
  );
}