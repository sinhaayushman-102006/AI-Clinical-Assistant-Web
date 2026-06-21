import Globe from "./Globe";
import OrbitAnimation from "./OrbitAnimation";
import ParticleBackground from "./ParticleBackground";

interface HeroProps {
  onLaunch: () => void;
}

export default function HeroSection({ onLaunch }: HeroProps) {
  return (
    <div className="min-h-screen bg-transparent text-white overflow-hidden relative">
      {/* Stars image (behind everything) */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-30">
        <img
          src="/assets/stars.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Particles should appear above stars */}
      <ParticleBackground />

      {/* Navbar */}
      <nav className="flex justify-between items-center px-12 py-8 relative z-50">
        <h1 className="text-4xl font-bold text-cyan-400">ClinicalAI</h1>

        <div className="hidden lg:flex gap-10 text-slate-300">
          <button className="hover:text-cyan-400 transition">Features</button>
          <button className="hover:text-cyan-400 transition">Resources</button>
          <button className="hover:text-cyan-400 transition">Support</button>
        </div>

        <button
          onClick={onLaunch}
          className="
            bg-cyan-500
            text-black
            px-8
            py-4
            rounded-full
            font-semibold
            hover:scale-105
            transition
          "
        >
          Launch Platform
        </button>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 lg:px-12 min-h-[85vh] grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT PANEL */}
        <div className="relative z-20">
          <p className="uppercase tracking-[6px] text-cyan-400 mb-6 text-sm sm:text-base">
            Healthcare Agentic AI
          </p>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Transform
            <br />
            Clinical
            <br />
            Decision Making
            <br />
            With Trusted AI
          </h1>

          <p className="mt-8 text-slate-300 text-xl max-w-xl">
            Evidence-backed Multi-Agent Clinical Intelligence powered by Advanced RAG, OpenRouter LLMs,
            PubMed, NIH and WHO guidelines.
          </p>

          <div className="flex flex-wrap gap-5 mt-10">
            <button
              onClick={onLaunch}
              className="
                bg-cyan-500
                text-black
                px-8
                py-4
                rounded-full
                font-semibold
                hover:scale-105
                transition
              "
            >
              View Demo
            </button>

            <button
              className="
                border
                border-white
                px-8
                py-4
                rounded-full
                hover:bg-white
                hover:text-black
                transition
              "
            >
              GitHub Repository
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-12 mt-14">
            <div>
              <h2 className="text-4xl font-bold text-cyan-400">5</h2>
              <p className="text-slate-400">AI Agents</p>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-cyan-400">99.2%</h2>
              <p className="text-slate-400">Verified</p>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-cyan-400">24/7</h2>
              <p className="text-slate-400">Clinical Support</p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="relative flex justify-center items-center h-[800px]">
          <OrbitAnimation />
          <Globe />
        </div>
      </section>

      {/* Bottom Gradient */}
      <div
        className="
          absolute
          bottom-0
          left-0
          w-full
          h-40
          bg-gradient-to-t
          from-slate-950
          to-transparent
        "
      />
    </div>
  );
}

