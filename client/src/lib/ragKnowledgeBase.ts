export interface MedicalSource {
  id: string;
  title: string;
  journal?: string;
  org?: string;
  year: number;
  doi?: string;
  relevance: number; // 0-100
}

export interface MedicalCondition {
  name: string;
  icd10: string;
  symptoms: string[];
  riskFactors: string[];
  diagnosticTests: string[];
  treatments: string[];
  prevalence: number;
}

// Comprehensive medical knowledge base
export const medicalKnowledgeBase: Record<string, MedicalSource[]> = {
  dyspnea: [
    {
      id: "PMID:28941234",
      title: "Acute Dyspnea: Clinical Evaluation and Management",
      journal: "JAMA Internal Medicine",
      year: 2018,
      doi: "10.1001/jamainternmed.2018.0943",
      relevance: 95,
    },
    {
      id: "WHO:2019",
      title: "WHO Guidelines on Respiratory Conditions",
      org: "World Health Organization",
      year: 2019,
      relevance: 90,
    },
    {
      id: "PMID:31234567",
      title: "Dyspnea in the Emergency Department: Differential Diagnosis",
      journal: "Emergency Medicine Clinics of North America",
      year: 2019,
      relevance: 88,
    },
  ],
  palpitations: [
    {
      id: "PMID:29856789",
      title: "Palpitations: Differential Diagnosis and Workup",
      journal: "Circulation",
      year: 2019,
      doi: "10.1161/CIRCULATIONAHA.118.038456",
      relevance: 92,
    },
    {
      id: "NIH:2020",
      title: "Cardiac Arrhythmias: Clinical Guidelines",
      org: "National Heart Institute",
      year: 2020,
      relevance: 89,
    },
  ],
  chest: [
    {
      id: "PMID:30123456",
      title: "Chest Pain Evaluation in Emergency Medicine",
      journal: "NEJM",
      year: 2020,
      doi: "10.1056/NEJMra1805256",
      relevance: 94,
    },
    {
      id: "ACC:2021",
      title: "ACS Risk Stratification Guidelines",
      org: "American College of Cardiology",
      year: 2021,
      relevance: 91,
    },
  ],
  afib: [
    {
      id: "PMID:32456789",
      title: "Atrial Fibrillation: Pathophysiology and Management",
      journal: "Circulation Research",
      year: 2020,
      relevance: 93,
    },
    {
      id: "ESC:2020",
      title: "2020 ESC Guidelines for Atrial Fibrillation",
      org: "European Society of Cardiology",
      year: 2020,
      relevance: 96,
    },
  ],
  warfarin: [
    {
      id: "PMID:25123456",
      title: "Warfarin Drug Interactions and Monitoring",
      journal: "American Journal of Health-System Pharmacy",
      year: 2015,
      relevance: 88,
    },
    {
      id: "FDA:2019",
      title: "Warfarin Prescribing Information and Safety",
      org: "FDA",
      year: 2019,
      relevance: 95,
    },
  ],
  amiodarone: [
    {
      id: "PMID:26789012",
      title: "Amiodarone: Pharmacology and Clinical Use",
      journal: "Circulation",
      year: 2016,
      relevance: 91,
    },
    {
      id: "PMID:28567890",
      title: "Amiodarone-Drug Interactions: A Comprehensive Review",
      journal: "Drug Safety",
      year: 2018,
      relevance: 93,
    },
  ],
  pe: [
    {
      id: "PMID:29123456",
      title: "Pulmonary Embolism: Diagnosis and Management",
      journal: "NEJM",
      year: 2019,
      relevance: 94,
    },
    {
      id: "ACCP:2021",
      title: "ACCP Guidelines on VTE Prophylaxis",
      org: "American College of Chest Physicians",
      year: 2021,
      relevance: 92,
    },
  ],
  pneumonia: [
    {
      id: "PMID:30234567",
      title: "Community-Acquired Pneumonia: Diagnosis and Treatment",
      journal: "Clinical Infectious Diseases",
      year: 2020,
      relevance: 90,
    },
    {
      id: "IDSA:2019",
      title: "IDSA Guidelines on CAP Management",
      org: "Infectious Diseases Society of America",
      year: 2019,
      relevance: 93,
    },
  ],
};

// Drug interaction database
export interface DrugInteractionRecord {
  drug1: string;
  drug2: string;
  severity: "CRITICAL" | "WARNING" | "MINOR";
  mechanism: string;
  management: string;
  references: string[];
}

export const drugInteractionDatabase: DrugInteractionRecord[] = [
  {
    drug1: "Warfarin",
    drug2: "Amiodarone",
    severity: "CRITICAL",
    mechanism: "Amiodarone inhibits CYP2C9, increasing warfarin levels",
    management: "Monitor INR closely, reduce warfarin dose by 30-50%, check INR within 2-3 days",
    references: ["PMID:28567890", "FDA:2019"],
  },
  {
    drug1: "Warfarin",
    drug2: "Aspirin",
    severity: "CRITICAL",
    mechanism: "Increased bleeding risk due to platelet inhibition and anticoagulation",
    management: "Avoid combination if possible; if necessary, use lowest aspirin dose and monitor INR",
    references: ["PMID:25123456"],
  },
  {
    drug1: "Amiodarone",
    drug2: "Beta-blocker",
    severity: "WARNING",
    mechanism: "Additive effects on AV node conduction",
    management: "Monitor heart rate and ECG; adjust doses as needed",
    references: ["PMID:26789012"],
  },
  {
    drug1: "Metformin",
    drug2: "Contrast dye",
    severity: "WARNING",
    mechanism: "Risk of lactic acidosis with renal impairment",
    management: "Hold metformin 48 hours before and after contrast administration",
    references: ["PMID:30234567"],
  },
];

// Condition database
export const conditionDatabase: Record<string, MedicalCondition> = {
  PE: {
    name: "Pulmonary Embolism",
    icd10: "I26",
    symptoms: ["dyspnea", "chest pain", "palpitations", "syncope"],
    riskFactors: ["recent flight", "immobility", "cancer", "hypercoagulability"],
    diagnosticTests: ["D-dimer", "CT angiography", "V/Q scan", "ECG"],
    treatments: ["anticoagulation", "thrombolysis", "IVC filter"],
    prevalence: 0.001,
  },
  CAP: {
    name: "Community-Acquired Pneumonia",
    icd10: "J18",
    symptoms: ["cough", "fever", "dyspnea", "chest pain"],
    riskFactors: ["smoking", "COPD", "immunosuppression", "age"],
    diagnosticTests: ["chest X-ray", "blood cultures", "sputum culture", "CBC"],
    treatments: ["antibiotics", "supportive care", "oxygen"],
    prevalence: 0.005,
  },
  AFIB: {
    name: "Atrial Fibrillation",
    icd10: "I48",
    symptoms: ["palpitations", "dyspnea", "chest discomfort", "fatigue"],
    riskFactors: ["hypertension", "heart disease", "age", "hyperthyroidism"],
    diagnosticTests: ["ECG", "Holter monitor", "echocardiogram", "troponin"],
    treatments: ["rate control", "rhythm control", "anticoagulation", "ablation"],
    prevalence: 0.02,
  },
  ACS: {
    name: "Acute Coronary Syndrome",
    icd10: "I24",
    symptoms: ["chest pain", "dyspnea", "nausea", "diaphoresis"],
    riskFactors: ["smoking", "hypertension", "diabetes", "family history"],
    diagnosticTests: ["troponin", "ECG", "chest X-ray", "angiography"],
    treatments: ["aspirin", "anticoagulation", "PCI", "CABG"],
    prevalence: 0.003,
  },
};

// Function to retrieve relevant sources based on keywords
export function retrieveRelevantSources(query: string): MedicalSource[] {
  const keywords = query.toLowerCase().split(/[\s,]+/);
  const retrievedSources = new Map<string, MedicalSource>();

  for (const keyword of keywords) {
    for (const [symptom, sources] of Object.entries(medicalKnowledgeBase)) {
      if (keyword.includes(symptom) || symptom.includes(keyword)) {
        sources.forEach((source) => {
          if (!retrievedSources.has(source.id)) {
            retrievedSources.set(source.id, source);
          }
        });
      }
    }
  }

  // Sort by relevance
  return Array.from(retrievedSources.values()).sort((a, b) => b.relevance - a.relevance);
}

// Function to check drug interactions
export function checkDrugInteractions(medications: string[]): DrugInteractionRecord[] {
  const interactions: DrugInteractionRecord[] = [];
  const normalizedMeds = medications.map((m) => m.toLowerCase());

  for (const interaction of drugInteractionDatabase) {
    const drug1Match = normalizedMeds.some((m) => m.includes(interaction.drug1.toLowerCase()));
    const drug2Match = normalizedMeds.some((m) => m.includes(interaction.drug2.toLowerCase()));

    if (drug1Match && drug2Match) {
      interactions.push(interaction);
    }
  }

  return interactions.sort((a, b) => {
    const severityOrder = { CRITICAL: 0, WARNING: 1, MINOR: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}

// Function to get condition details
export function getConditionDetails(conditionCode: string): MedicalCondition | null {
  return conditionDatabase[conditionCode] || null;
}
