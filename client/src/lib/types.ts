export interface PatientData {
  name: string | null;
  age: number | null;
  hr: number | null;
  bp: string | null;
  spo2: number | null;
  temp: number | null;
  complaint: string | null;
  files: File[];
}


export interface Diagnosis {
  name: string;
  probability: number;
  verified?: boolean;
  citations?: BibliographyEntry[];
}

export interface DrugInteraction {
  drugs: string;
  severity: "CRITICAL" | "WARNING";
  risk: string;
}

export interface BibliographyEntry {
  id: string;
  title: string;
  journal?: string;
  org?: string;
  year: number;
}

export interface AnalysisResults {
  diagnoses: Diagnosis[];
  drugInteractions: DrugInteraction[];
  bibliography: BibliographyEntry[];
  warnings: string[];
}

export interface ConsoleLog {
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
}
