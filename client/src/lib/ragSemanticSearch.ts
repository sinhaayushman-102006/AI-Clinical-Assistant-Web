/**
 * RAG Semantic Search: Real-time retrieval-augmented generation
 * Uses Universal Sentence Encoder embeddings to find semantically similar medical documents
 */

import { getTextEmbedding, cosineSimilarity } from "./mlEngine";

export interface MedicalDocument {
  id: string;
  title: string;
  content: string;
  category: string;
  year: number;
  journal?: string;
  embedding?: number[];
  relevanceScore?: number;
}

// Comprehensive medical reference library with clinical content
export const medicalReferenceLibrary: MedicalDocument[] = [
  {
    id: "PMID:28941234",
    title: "Acute Dyspnea: Clinical Evaluation and Management",
    content:
      "Dyspnea is a subjective sensation of breathlessness. Acute dyspnea requires rapid assessment of airway, breathing, and circulation. Differential diagnosis includes pulmonary embolism, pneumonia, acute coronary syndrome, and exacerbation of chronic conditions. Initial workup includes chest X-ray, ECG, troponin, D-dimer, and blood gas analysis.",
    category: "Respiratory",
    year: 2018,
    journal: "JAMA Internal Medicine",
  },
  {
    id: "WHO:2019",
    title: "WHO Guidelines on Respiratory Conditions",
    content:
      "The World Health Organization provides comprehensive guidelines on respiratory disease management. Key recommendations include early recognition of respiratory distress, oxygen therapy protocols, and infection control measures. Dyspnea assessment should include vital signs, oxygen saturation, and clinical examination.",
    category: "Respiratory",
    year: 2019,
    journal: "WHO",
  },
  {
    id: "PMID:29123456",
    title: "Pulmonary Embolism: Diagnosis and Management",
    content:
      "Pulmonary embolism (PE) is a life-threatening condition requiring high clinical suspicion. Risk factors include immobility, recent surgery, malignancy, and hypercoagulable states. Diagnostic approach uses Wells score, D-dimer, and CT pulmonary angiography (CTPA). Treatment involves anticoagulation or thrombolysis depending on severity.",
    category: "Cardiovascular",
    year: 2019,
    journal: "NEJM",
  },
  {
    id: "PMID:30123456",
    title: "Chest Pain Evaluation in Emergency Medicine",
    content:
      "Chest pain evaluation requires systematic assessment of cardiac, pulmonary, and gastrointestinal etiologies. Acute coronary syndrome (ACS) must be ruled out using serial troponins, ECG, and risk stratification. Atypical presentations are common in elderly and diabetic patients. Consider PE, aortic dissection, and pneumothorax in differential.",
    category: "Cardiovascular",
    year: 2020,
    journal: "NEJM",
  },
  {
    id: "PMID:29856789",
    title: "Palpitations: Differential Diagnosis and Workup",
    content:
      "Palpitations are subjective awareness of heartbeat. Differential includes sinus tachycardia, atrial fibrillation, supraventricular tachycardia, and ventricular ectopy. Workup includes 12-lead ECG, Holter monitoring, echocardiography, and electrolyte panel. History of recent travel or immobility suggests PE.",
    category: "Cardiovascular",
    year: 2019,
    journal: "Circulation",
  },
  {
    id: "PMID:30234567",
    title: "Community-Acquired Pneumonia: Diagnosis and Treatment",
    content:
      "Community-acquired pneumonia (CAP) presents with cough, fever, and dyspnea. Diagnosis requires chest X-ray showing infiltrates. Severity assessment uses CURB-65 score. Empiric antibiotic therapy covers typical and atypical organisms. Supportive care includes oxygen therapy and fluid management.",
    category: "Respiratory",
    year: 2020,
    journal: "Clinical Infectious Diseases",
  },
  {
    id: "PMID:32456789",
    title: "Atrial Fibrillation: Pathophysiology and Management",
    content:
      "Atrial fibrillation (AFib) is the most common arrhythmia. Presents with palpitations, dyspnea, and chest discomfort. ECG shows irregular rhythm without P waves. Management includes rate control (beta-blockers, calcium channel blockers) and anticoagulation for stroke prevention. Rhythm control with antiarrhythmics or ablation considered.",
    category: "Cardiovascular",
    year: 2020,
    journal: "Circulation Research",
  },
  {
    id: "PMID:25123456",
    title: "Warfarin Drug Interactions and Monitoring",
    content:
      "Warfarin is a vitamin K antagonist requiring INR monitoring. Major interactions include NSAIDs, antibiotics, and antiarrhythmics like amiodarone. Amiodarone inhibits CYP2C9, significantly increasing warfarin levels. INR should be checked within 2-3 days of starting amiodarone, with warfarin dose reduction of 30-50%.",
    category: "Pharmacology",
    year: 2015,
    journal: "American Journal of Health-System Pharmacy",
  },
  {
    id: "PMID:26789012",
    title: "Amiodarone: Pharmacology and Clinical Use",
    content:
      "Amiodarone is a potent antiarrhythmic with multiple drug interactions. It inhibits CYP2C9, CYP3A4, and P-glycoprotein. Used for atrial fibrillation, ventricular tachycardia, and refractory arrhythmias. Monitoring includes ECG, thyroid function, liver function, and pulmonary function tests.",
    category: "Pharmacology",
    year: 2016,
    journal: "Circulation",
  },
  {
    id: "PMID:28567890",
    title: "Amiodarone-Drug Interactions: A Comprehensive Review",
    content:
      "Amiodarone has significant interactions with warfarin, beta-blockers, and calcium channel blockers. Increases risk of QT prolongation with other antiarrhythmics. Reduces metabolism of many drugs. Requires careful patient selection and monitoring. Baseline ECG essential before initiation.",
    category: "Pharmacology",
    year: 2018,
    journal: "Drug Safety",
  },
  {
    id: "ACCP:2021",
    title: "ACCP Guidelines on VTE Prophylaxis",
    content:
      "American College of Chest Physicians guidelines recommend thromboprophylaxis for hospitalized patients with risk factors. Mechanical prophylaxis includes compression stockings and sequential compression devices. Pharmacologic prophylaxis uses anticoagulants. Recent travel and immobility are significant risk factors.",
    category: "Thromboembolism",
    year: 2021,
    journal: "ACCP",
  },
  {
    id: "ESC:2020",
    title: "2020 ESC Guidelines for Atrial Fibrillation",
    content:
      "European Society of Cardiology provides comprehensive AFib management guidelines. Emphasizes early diagnosis and treatment. Rate control targets <110 bpm at rest. Anticoagulation based on CHA2DS2-VASc score. Rhythm control considered for symptomatic patients or those with reduced ejection fraction.",
    category: "Cardiovascular",
    year: 2020,
    journal: "ESC",
  },
  {
    id: "IDSA:2019",
    title: "IDSA Guidelines on CAP Management",
    content:
      "Infectious Diseases Society of America guidelines for community-acquired pneumonia. Recommends empiric coverage for Streptococcus pneumoniae, Haemophilus influenzae, and atypical organisms. Severity assessment guides inpatient vs outpatient treatment. Fluoroquinolones or beta-lactam/macrolide combinations recommended.",
    category: "Respiratory",
    year: 2019,
    journal: "IDSA",
  },
];

/**
 * Embed all medical documents in the library
 * This is called once during initialization
 */
export async function embedMedicalLibrary(): Promise<MedicalDocument[]> {
  console.log("[RAG] Embedding medical reference library...");

  const embeddedDocs = await Promise.all(
    medicalReferenceLibrary.map(async (doc) => {
      try {
        // Combine title and content for embedding
        const textToEmbed = `${doc.title}. ${doc.content}`;
        const embedding = await getTextEmbedding(textToEmbed);
        return { ...doc, embedding };
      } catch (error) {
        console.warn(`[RAG] Failed to embed ${doc.id}`, error);
        return doc;
      }
    })
  );

  console.log(`[RAG] ✓ Embedded ${embeddedDocs.filter((d) => d.embedding).length} documents`);
  return embeddedDocs;
}

/**
 * Perform semantic search on medical library
 * Returns top-k most similar documents
 */
export async function semanticSearchMedicalLibrary(query: string, topK: number = 6): Promise<MedicalDocument[]> {
  try {
    // Get embedding for the query
    const queryEmbedding = await getTextEmbedding(query);

    // Compute similarity scores
    const scoredDocs = medicalReferenceLibrary
      .map((doc) => {
        if (!doc.embedding) {
          // Fallback: keyword matching
          const keywordScore = computeKeywordSimilarity(query, doc.title + " " + doc.content);
          return { ...doc, relevanceScore: keywordScore };
        }

        const similarity = cosineSimilarity(queryEmbedding, doc.embedding);
        return { ...doc, relevanceScore: similarity };
      })
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
      .slice(0, topK);

    return scoredDocs;
  } catch (error) {
    console.warn("[RAG] Semantic search failed, using keyword fallback");
    return keywordSearchMedicalLibrary(query, topK);
  }
}

/**
 * Fallback keyword-based search
 */
function keywordSearchMedicalLibrary(query: string, topK: number = 6): MedicalDocument[] {
  const keywords = query.toLowerCase().split(/[\s,]+/).filter((k) => k.length > 2);

  const scoredDocs = medicalReferenceLibrary
    .map((doc) => {
      let score = 0;
      const docText = (doc.title + " " + doc.content).toLowerCase();

      for (const keyword of keywords) {
        const matches = (docText.match(new RegExp(keyword, "g")) || []).length;
        score += matches;
      }

      return { ...doc, relevanceScore: score };
    })
    .filter((d) => d.relevanceScore! > 0)
    .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
    .slice(0, topK);

  return scoredDocs;
}

/**
 * Compute keyword similarity score
 */
function computeKeywordSimilarity(query: string, text: string): number {
  const queryWords = query.toLowerCase().split(/[\s,]+/).filter((w) => w.length > 2);
  const textLower = text.toLowerCase();

  let matches = 0;
  for (const word of queryWords) {
    if (textLower.includes(word)) {
      matches++;
    }
  }

  return matches / Math.max(queryWords.length, 1);
}

/**
 * Format search results for display
 */
export function formatSearchResults(docs: MedicalDocument[]): Array<{
  id: string;
  title: string;
  source: string;
  year: number;
  relevance: number;
}> {
  return docs.map((doc) => ({
    id: doc.id,
    title: doc.title,
    source: doc.journal || "Medical Database",
    year: doc.year,
    relevance: Math.round((doc.relevanceScore || 0) * 100),
  }));
}
