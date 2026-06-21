import { useState } from "react";
import { getAllRecords, deleteRecord, PatientRecord } from "@/lib/patientDB";
import { Button } from "@/components/ui/button";

const RISK_STYLES: Record<string, string> = {
  low: "bg-emerald-900/50 text-emerald-300 border-emerald-700",
  medium: "bg-amber-900/50 text-amber-300 border-amber-700",
  high: "bg-orange-900/50 text-orange-300 border-orange-700",
  critical: "bg-red-900/50 text-red-300 border-red-700",
};

interface PatientRecordsPanelProps {
  refreshKey: number;
  onRecordDeleted: () => void;
}

export default function PatientRecordsPanel({
  refreshKey,
  onRecordDeleted,
}: PatientRecordsPanelProps) {
  const records = getAllRecords();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = records.filter((r) => {
    const q = search.toLowerCase();
    return (
      !q ||
      (r.patientData.name ?? "").toLowerCase().includes(q) ||
      r.topDiagnosis.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q)
    );
  });

  const handleDelete = (id: string) => {
    deleteRecord(id);
    if (expandedId === id) setExpandedId(null);
    onRecordDeleted();
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-white">Patient Records</h2>
        <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded-full border border-slate-700">
          {records.length} record{records.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, diagnosis or ID…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white text-sm focus:border-cyan-500 focus:outline-none"
      />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500 text-center space-y-2">
          <span className="text-4xl">🗂️</span>
          <p className="text-sm">
            {records.length === 0
              ? "No patient records yet. Run an analysis to save one."
              : "No records match your search."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((record) => (
            <RecordCard
              key={record.id}
              record={record}
              isExpanded={expandedId === record.id}
              onToggle={() =>
                setExpandedId(expandedId === record.id ? null : record.id)
              }
              onDelete={() => handleDelete(record.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RecordCard({
  record,
  isExpanded,
  onToggle,
  onDelete,
}: {
  record: PatientRecord;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const { patientData: pd, analysisResults: ar } = record;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden transition-all">
      {/* Header row */}
      <button
        onClick={onToggle}
        className="w-full text-left p-4 flex items-start gap-3 hover:bg-slate-700/50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-white text-sm truncate">
              {pd.name ?? "Unknown Patient"}
            </span>
            {pd.age && (
              <span className="text-xs text-slate-400 shrink-0">
                · {pd.age} yrs
              </span>
            )}
          </div>
          <div className="text-xs text-slate-400 truncate mb-2">
            {record.topDiagnosis}
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                RISK_STYLES[record.riskLevel]
              }`}
            >
              {record.riskLevel.toUpperCase()}
            </span>
            <span className="text-xs text-slate-500">{record.date}</span>
          </div>
        </div>
        <span className="text-slate-500 text-lg mt-0.5">
          {isExpanded ? "▲" : "▼"}
        </span>
      </button>

      {/* Expanded detail */}
      {isExpanded && (
        <div className="border-t border-slate-700 p-4 space-y-4 text-sm">
          {/* Vitals */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Vitals
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Vital label="HR" value={pd.hr ? `${pd.hr} bpm` : "—"} />
              <Vital label="BP" value={pd.bp ?? "—"} />
              <Vital label="SpO₂" value={pd.spo2 ? `${pd.spo2}%` : "—"} />
              <Vital label="Temp" value={pd.temp ? `${pd.temp}°C` : "—"} />
            </div>
          </div>

          {/* Complaint */}
          {pd.complaint && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Chief Complaint
              </p>
              <p className="text-slate-300 text-xs leading-relaxed line-clamp-3">
                {pd.complaint}
              </p>
            </div>
          )}

          {/* Diagnoses */}
          {ar.diagnoses.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Differential Diagnoses
              </p>
              <div className="space-y-1">
                {ar.diagnoses.slice(0, 3).map((d, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-slate-300 truncate pr-2">{d.name}</span>
                    <span className="text-cyan-400 font-bold shrink-0">{d.probability}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Drug interactions */}
          {ar.drugInteractions.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Drug Interactions
              </p>
              {ar.drugInteractions.map((di, i) => (
                <div
                  key={i}
                  className={`text-xs p-2 rounded border mb-1 ${
                    di.severity === "CRITICAL"
                      ? "bg-red-900/30 border-red-700 text-red-200"
                      : "bg-amber-900/30 border-amber-700 text-amber-200"
                  }`}
                >
                  <span className="font-semibold">{di.drugs}</span> — {di.risk}
                </div>
              ))}
            </div>
          )}

          {/* Record meta */}
          <p className="text-xs text-slate-600">ID: {record.id}</p>

          {/* Delete */}
          <Button
            onClick={onDelete}
            className="w-full py-2 bg-red-900/40 hover:bg-red-900/70 border border-red-800 text-red-300 text-xs rounded-md transition-all"
          >
            Delete Record
          </Button>
        </div>
      )}
    </div>
  );
}

function Vital({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-900 rounded p-2 text-center">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-white font-medium text-xs mt-0.5">{value}</div>
    </div>
  );
}
