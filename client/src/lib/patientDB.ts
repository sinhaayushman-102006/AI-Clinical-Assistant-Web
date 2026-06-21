import { PatientData, AnalysisResults } from "./types";

export interface PatientRecord {
  id: string;
  timestamp: string;
  date: string;
  patientData: Omit<PatientData, "files">;
  analysisResults: AnalysisResults;
  topDiagnosis: string;
  riskLevel: "low" | "medium" | "high" | "critical";
}

const DB_KEY = "clinical_patient_records";

function computeRisk(results: AnalysisResults): PatientRecord["riskLevel"] {
  if (results.drugInteractions.some((i) => i.severity === "CRITICAL")) return "critical";
  if (results.drugInteractions.length > 0) return "high";
  if ((results.diagnoses[0]?.probability ?? 0) > 60) return "medium";
  return "low";
}

export function savePatientRecord(
  patientData: PatientData,
  analysisResults: AnalysisResults
): PatientRecord {
  const records = getAllRecords();
  const id = `PAT-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const record: PatientRecord = {
    id,
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString(),
    patientData: {
      name: patientData.name,
      age: patientData.age,
      hr: patientData.hr,
      bp: patientData.bp,
      spo2: patientData.spo2,
      temp: patientData.temp,
      complaint: patientData.complaint,
      files: [],
    },
    analysisResults,
    topDiagnosis: analysisResults.diagnoses[0]?.name || "Unknown",
    riskLevel: computeRisk(analysisResults),
  };

  records.unshift(record);
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(records));
  } catch {
    // quota exceeded – trim oldest
    records.pop();
    localStorage.setItem(DB_KEY, JSON.stringify(records));
  }
  return record;
}

export function getAllRecords(): PatientRecord[] {
  try {
    const raw = localStorage.getItem(DB_KEY);
    return raw ? (JSON.parse(raw) as PatientRecord[]) : [];
  } catch {
    return [];
  }
}

export function deleteRecord(id: string): void {
  const records = getAllRecords().filter((r) => r.id !== id);
  localStorage.setItem(DB_KEY, JSON.stringify(records));
}

export function clearAllRecords(): void {
  localStorage.removeItem(DB_KEY);
}

export interface AnalyticsSummary {
  total: number;
  avgAge: number;
  topDiagnosis: string;
  riskCounts: Record<"low" | "medium" | "high" | "critical", number>;
  byDate: { date: string; patients: number }[];
  criticalInteractions: number;
  diagnosisDistribution: { name: string; count: number }[];
}

export function getAnalyticsSummary(): AnalyticsSummary {
  const records = getAllRecords();
  const total = records.length;

  const avgAge =
    total > 0
      ? Math.round(
          records.reduce((sum, r) => sum + (r.patientData.age ?? 0), 0) / total
        )
      : 0;

  const diagnosisCounts: Record<string, number> = {};
  records.forEach((r) => {
    r.analysisResults.diagnoses.forEach((d) => {
      diagnosisCounts[d.name] = (diagnosisCounts[d.name] ?? 0) + 1;
    });
  });

  const sortedDx = Object.entries(diagnosisCounts).sort((a, b) => b[1] - a[1]);
  const topDiagnosis = sortedDx[0]?.[0] ?? "N/A";
  const diagnosisDistribution = sortedDx.slice(0, 5).map(([name, count]) => ({ name, count }));

  const riskCounts = { low: 0, medium: 0, high: 0, critical: 0 };
  records.forEach((r) => {
    riskCounts[r.riskLevel]++;
  });

  // last 7 days
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });
  const countByDate: Record<string, number> = {};
  last7.forEach((d) => { countByDate[d] = 0; });
  records.forEach((r) => {
    const d = new Date(r.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (countByDate[d] !== undefined) countByDate[d]++;
  });
  const byDate = last7.map((date) => ({ date, patients: countByDate[date] ?? 0 }));

  const criticalInteractions = records.filter((r) =>
    r.analysisResults.drugInteractions.some((i) => i.severity === "CRITICAL")
  ).length;

  return { total, avgAge, topDiagnosis, riskCounts, byDate, criticalInteractions, diagnosisDistribution };
}
