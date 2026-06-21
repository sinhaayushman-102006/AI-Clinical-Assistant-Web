import { Button } from "@/components/ui/button";
import { AnalysisResults } from "@/lib/types";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisResults: AnalysisResults;
  onExport: () => void;
}

export default function ReportModal({ isOpen, onClose, analysisResults, onExport }: ReportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 border border-slate-700 animate-scale-in">
        {/* Animated Checkmark */}
        <div className="flex justify-center mb-6">
          <svg
            className="w-20 h-20 animate-checkmark-draw"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="45" stroke="url(#gradient)" strokeWidth="2" />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <path
              d="M 30 50 L 45 65 L 70 35"
              stroke="url(#gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="100"
              strokeDashoffset="100"
              className="animate-checkmark-draw"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Report Complete</h2>
          <p className="text-slate-300 text-sm">
            Clinical analysis verified and ready for export
          </p>
        </div>

        {/* Summary Stats */}
        <div className="space-y-3 mb-6">
          <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 uppercase tracking-wide">Diagnoses Generated</p>
            <p className="text-lg font-bold text-emerald-400">{analysisResults.diagnoses.length}</p>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 uppercase tracking-wide">Drug Interactions</p>
            <p className="text-lg font-bold text-amber-400">{analysisResults.drugInteractions.length}</p>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 uppercase tracking-wide">Sources Cited</p>
            <p className="text-lg font-bold text-cyan-400">{analysisResults.bibliography.length}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onExport}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-semibold rounded-md transition-all text-sm"
          >
            Export Report
          </Button>
          <Button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-md transition-all text-sm"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
