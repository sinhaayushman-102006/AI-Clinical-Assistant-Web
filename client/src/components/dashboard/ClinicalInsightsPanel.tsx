import { AnalysisResults } from "@/lib/types";

interface ClinicalInsightsPanelProps {
  analysisResults: AnalysisResults;
}

export default function ClinicalInsightsPanel({ analysisResults }: ClinicalInsightsPanelProps) {
  return (
    <div className="w-96 bg-slate-900 border-l border-slate-800 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Differential Diagnoses */}
        <div>
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
            <span className="text-lg">▦</span> Differential Diagnoses
          </h3>
          <div className="space-y-3">
            {analysisResults.diagnoses.length === 0 ? (
              <div className="text-slate-400 text-sm">Awaiting patient data...</div>
            ) : (
              analysisResults.diagnoses.map((diagnosis, idx) => (
                <div key={idx} className="animate-fade-in">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-slate-200">{diagnosis.name}</span>
                    <span className="text-xs font-bold text-emerald-400">{diagnosis.probability}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="chart-bar bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full animate-progress-fill"
                      style={{
                        '--progress-width': `${diagnosis.probability}%`,
                      } as React.CSSProperties}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Drug Interaction Matrix */}
        <div>
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
            <span className="text-lg">▣</span> Drug Interactions
          </h3>
          <div className="space-y-2">
            {analysisResults.drugInteractions.length === 0 ? (
              <div className="text-slate-400 text-sm">No interactions detected</div>
            ) : (
              analysisResults.drugInteractions.map((interaction, idx) => {
                const isCritical = interaction.severity === "CRITICAL";
                const severityColor = isCritical
                  ? "bg-red-900 text-red-200 border-red-700"
                  : "bg-yellow-900 text-yellow-200 border-yellow-700";
                const severityBadge = isCritical ? "CRITICAL" : "WARNING";

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border animate-fade-in transition-all ${severityColor} ${
                      isCritical ? "animate-neon-pulse" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-sm">{interaction.drugs}</span>
                      <span className="text-xs font-bold">{severityBadge}</span>
                    </div>
                    <p className="text-xs opacity-90">{interaction.risk}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Bibliography */}
        <div>
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
            <span className="text-lg">▢</span> Evidence-Backed Sources
          </h3>
          <div className="space-y-2 text-sm">
            {analysisResults.bibliography.length === 0 ? (
              <div className="text-slate-400 text-sm">No citations retrieved</div>
            ) : (
              analysisResults.bibliography.map((source, idx) => (
                <div key={idx} className="p-2 bg-slate-800/50 rounded border border-slate-700 animate-fade-in">
                  <div className="font-mono text-xs text-cyan-400 mb-1">{source.id}</div>
                  <div className="text-xs text-slate-300">{source.title}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {source.journal || source.org} ({source.year})
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
