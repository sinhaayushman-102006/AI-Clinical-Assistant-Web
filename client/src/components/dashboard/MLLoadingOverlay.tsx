import { useEffect, useState } from "react";
import { getMLEngineState } from "@/lib/mlEngine";

interface MLLoadingOverlayProps {
  isVisible: boolean;
}

export default function MLLoadingOverlay({ isVisible }: MLLoadingOverlayProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing Neural Engine...");

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      const state = getMLEngineState();
      setProgress(state.progress);

      if (state.progress < 20) {
        setStatus("🔍 Loading Universal Sentence Encoder...");
      } else if (state.progress < 60) {
        setStatus("🧠 Initializing TensorFlow.js...");
      } else if (state.progress < 90) {
        setStatus("📚 Training Clinical Risk Predictor...");
      } else if (state.progress < 100) {
        setStatus("✓ Finalizing Neural Engine...");
      } else {
        setStatus("✅ Neural Engine Ready!");
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 border border-slate-700">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 mb-4 animate-pulse"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Downloading Neural Engine</h2>
          <p className="text-slate-300 text-sm">Real-time AI/ML inference loading in browser...</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-slate-400 text-sm mt-2 text-center font-mono">{progress}%</p>
        </div>

        {/* Status Message */}
        <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <p className="text-slate-200 text-center text-sm font-medium">{status}</p>
        </div>

        {/* Model Loading Status */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${progress >= 50 ? "bg-emerald-500" : "bg-slate-600"}`} />
            <span className={progress >= 50 ? "text-emerald-300" : "text-slate-400"}>
              {progress >= 50 ? "Complete" : "Loading"} Universal Sentence Encoder
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${progress >= 75 ? "bg-emerald-500" : "bg-slate-600"}`} />
            <span className={progress >= 75 ? "text-emerald-300" : "text-slate-400"}>
              {progress >= 75 ? "Complete" : "Loading"} TensorFlow.js
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${progress >= 90 ? "bg-emerald-500" : "bg-slate-600"}`} />
            <span className={progress >= 90 ? "text-emerald-300" : "text-slate-400"}>
              {progress >= 90 ? "Complete" : "Loading"} Clinical Risk Predictor
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 bg-indigo-900/20 rounded-lg border border-indigo-700/30">
          <p className="text-xs text-indigo-300 text-center">
            Real-time clinical inference running directly in your browser with no server dependency.
          </p>
        </div>
      </div>
    </div>
  );
}
