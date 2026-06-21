import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { getAnalyticsSummary } from "@/lib/patientDB";

const RISK_COLORS: Record<string, string> = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#ef4444",
};

export default function AnalyticsPanel({ refreshKey }: { refreshKey: number }) {
  const summary = useMemo(() => getAnalyticsSummary(), [refreshKey]);

  const riskPieData = Object.entries(summary.riskCounts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white mb-2">Analytics</h2>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Total Patients" value={summary.total} icon="👤" color="cyan" />
        <StatCard label="Avg Patient Age" value={`${summary.avgAge} yrs`} icon="📊" color="indigo" />
        <StatCard
          label="Critical Drug Alerts"
          value={summary.criticalInteractions}
          icon="⚠️"
          color="red"
        />
        <StatCard
          label="Most Common Dx"
          value={summary.topDiagnosis === "N/A" ? "—" : summary.topDiagnosis.split(" ").slice(0, 2).join(" ")}
          icon="🔬"
          color="emerald"
          small
        />
      </div>

      {/* Patients per day bar chart */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wide">
          Patients Analyzed — Last 7 Days
        </h3>
        {summary.total === 0 ? (
          <EmptyChart label="No patient records yet. Run an analysis to populate charts." />
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={summary.byDate} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
                labelStyle={{ color: "#cbd5e1" }}
                itemStyle={{ color: "#67e8f9" }}
              />
              <Bar dataKey="patients" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Risk distribution pie */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wide">
          Risk Level Distribution
        </h3>
        {riskPieData.length === 0 ? (
          <EmptyChart label="Risk distribution will appear after patient analyses." />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={riskPieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {riskPieData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={RISK_COLORS[entry.name.toLowerCase()] ?? "#64748b"}
                  />
                ))}
              </Pie>
              <Legend
                formatter={(value) => (
                  <span style={{ color: "#cbd5e1", fontSize: 12 }}>{value}</span>
                )}
              />
              <Tooltip
                contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
                itemStyle={{ color: "#cbd5e1" }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top diagnoses */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wide">
          Top Diagnoses
        </h3>
        {summary.diagnosisDistribution.length === 0 ? (
          <EmptyChart label="Diagnosis trends will appear here after analyses." />
        ) : (
          <div className="space-y-3">
            {summary.diagnosisDistribution.map((d) => {
              const maxCount = summary.diagnosisDistribution[0]?.count ?? 1;
              const pct = Math.round((d.count / maxCount) * 100);
              return (
                <div key={d.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-300 truncate pr-4">{d.name}</span>
                    <span className="text-xs font-bold text-cyan-400 shrink-0">{d.count}×</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-2 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
  small,
}: {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  small?: boolean;
}) {
  const colorMap: Record<string, string> = {
    cyan: "border-cyan-700 bg-cyan-950/40",
    indigo: "border-indigo-700 bg-indigo-950/40",
    red: "border-red-700 bg-red-950/40",
    emerald: "border-emerald-700 bg-emerald-950/40",
  };
  return (
    <div className={`rounded-lg border p-4 ${colorMap[color] ?? ""}`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`font-bold text-white mb-1 ${small ? "text-base leading-tight" : "text-2xl"}`}>
        {value}
      </div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="h-32 flex items-center justify-center text-slate-500 text-sm text-center px-4">
      {label}
    </div>
  );
}
