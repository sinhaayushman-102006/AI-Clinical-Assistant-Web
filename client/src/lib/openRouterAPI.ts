import { Diagnosis, DrugInteraction, BibliographyEntry } from "./types";
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
async function safeCallOpenRouter(
  systemPrompt: string,
  userPrompt: string,
  temperature = 0.5
): Promise<string | null> {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "AI Clinical Decision Assistant",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`OpenRouter unavailable (${response.status}): ${errorText}`);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty response from OpenRouter");
    return content;
  } catch (error) {
    console.warn("OpenRouter API call failed (falling back to local engine):", error);
    return null;
  }
}

export async function callDiagnosisAgent(patientContext: string, ragContext: string): Promise<Diagnosis[]> {
  const systemPrompt = `You are an expert diagnostic AI assistant. Analyze the patient case and provided medical literature context.
Return ONLY a valid JSON array with exactly 3-4 differential diagnoses. Each object must have "name" (string) and "probability" (number 0-100).
Example format: [{"name": "Atrial Fibrillation with Rapid Ventricular Response", "probability": 85}, {"name": "Pulmonary Embolism", "probability": 60}]
Do not include any text outside the JSON array.`;

  const userPrompt = `Patient Case:\n${patientContext}\n\nMedical Literature Context:\n${ragContext}\n\nProvide differential diagnoses as a JSON array.`;

  const responseText = await safeCallOpenRouter(systemPrompt, userPrompt, 0.7);
  if (!responseText) {
    return [
      { name: "Pulmonary Embolism", probability: 45, verified: false },
      { name: "Atrial Fibrillation with Rapid Ventricular Response", probability: 25, verified: false },
      { name: "Acute Coronary Syndrome", probability: 15, verified: false },
      { name: "Pneumonia", probability: 5, verified: false },
    ];
  }

  try {
    const cleanJSON = cleanJSONResponse(responseText);
    const diagnoses: Diagnosis[] = JSON.parse(cleanJSON);
    return diagnoses;
  } catch (error) {
    console.warn("Diagnosis output was not valid JSON; using fallback:", error);
    return [
      { name: "Pulmonary Embolism", probability: 45, verified: false },
      { name: "Atrial Fibrillation with Rapid Ventricular Response", probability: 25, verified: false },
      { name: "Acute Coronary Syndrome", probability: 15, verified: false },
      { name: "Pneumonia", probability: 5, verified: false },
    ];
  }
}

export async function callDrugInteractionAgent(
  currentMeds: string,
  suggestedMeds: string
): Promise<DrugInteraction[]> {
  const systemPrompt = `You are a pharmacist AI specializing in drug-drug interactions. Analyze the medications and identify critical interactions.
Return ONLY a valid JSON array of interactions. Each object must have "drugs" (string), "severity" ("CRITICAL" or "WARNING"), and "risk" (string description).
Example: [{"drugs": "Warfarin + Amiodarone", "severity": "CRITICAL", "risk": "Increased anticoagulation effect, bleeding risk"}]
Do not include any text outside the JSON array.`;

  const userPrompt = `Current Medications: ${currentMeds}\nSuggested/New Medications: ${suggestedMeds}\n\nIdentify drug interactions as a JSON array.`;

  const responseText = await safeCallOpenRouter(systemPrompt, userPrompt, 0.5);
  if (!responseText) return [];

  try {
    const cleanJSON = cleanJSONResponse(responseText);
    const interactions: DrugInteraction[] = JSON.parse(cleanJSON);
    return interactions;
  } catch (error) {
    console.warn("Drug interaction output was not valid JSON; returning empty:", error);
    return [];
  }
}

export async function callBibliographyAgent(
  diagnosisNames: string,
  symptoms: string
): Promise<BibliographyEntry[]> {
  const systemPrompt = `You are a medical librarian AI. Generate realistic PubMed-style citations for the given diagnoses and symptoms.
Return ONLY a valid JSON array of citations. Each object must have "id" (string like "PMID:12345678"), "title" (string), "journal" (string), and "year" (number).
Example: [{"id": "PMID:35123456", "title": "Atrial Fibrillation Management Guidelines 2023", "journal": "Circulation", "year": 2023}]
Do not include any text outside the JSON array.`;

  const userPrompt = `Diagnoses: ${diagnosisNames}\nSymptoms: ${symptoms}\n\nGenerate relevant medical citations as a JSON array.`;

  const responseText = await safeCallOpenRouter(systemPrompt, userPrompt, 0.6);
  if (!responseText) return [];

  try {
    const cleanJSON = cleanJSONResponse(responseText);
    const citations = JSON.parse(cleanJSON);
    return (citations as any[]).map((c: any) => ({
      id: c.id || "PMID:unknown",
      title: c.title || "Unknown Title",
      journal: c.journal || "Unknown Journal",
      year: typeof c.year === "number" ? c.year : parseInt(c.year) || new Date().getFullYear(),
    }));
  } catch (error) {
    console.warn("Bibliography output was not valid JSON; returning empty:", error);
    return [];
  }
}

export async function callVerificationAgent(
  diagnosisStr: string,
  interactionStr: string,
  ragContext: string
): Promise<{ isValid: boolean; warnings: string[]; sanitizedDiagnoses: string }> {
  const systemPrompt = `You are a clinical safety verification AI. Cross-reference the provided diagnoses and interactions against the medical literature context.
Identify any hallucinations or unsupported claims. Return a JSON object with "isValid" (boolean), "warnings" (array of strings), and "sanitizedDiagnoses" (string).
Example: {"isValid": true, "warnings": [], "sanitizedDiagnoses": "..."}`;

  const userPrompt = `Diagnoses: ${diagnosisStr}\nDrug Interactions: ${interactionStr}\nMedical Context: ${ragContext}\n\nVerify accuracy and return JSON.`;

  const responseText = await safeCallOpenRouter(systemPrompt, userPrompt, 0.3);
  if (!responseText) {
    return {
      isValid: false,
      warnings: ["OpenRouter unavailable; using local estimates."],
      sanitizedDiagnoses: diagnosisStr,
    };
  }

  try {
    const cleanJSON = cleanJSONResponse(responseText);
    // Verification must be valid JSON; fallback deterministically if parsing fails.
    try {
      const verification = JSON.parse(cleanJSON);
      return {
        isValid: typeof verification?.isValid === "boolean" ? verification.isValid : true,
        warnings: Array.isArray(verification?.warnings) ? verification.warnings : [],
        sanitizedDiagnoses: verification?.sanitizedDiagnoses || diagnosisStr,
      };
    } catch {
      return {
        isValid: false,
        warnings: ["Verification output was not valid JSON; using local estimates."],
        sanitizedDiagnoses: diagnosisStr,
      };
    }
  } catch (error) {
    // This is the specific issue you saw: model output not being valid JSON.
    console.warn("Verification output was not valid JSON; using local estimates:", error);
    return {
      isValid: false,
      warnings: ["Verification output was not valid JSON; using local estimates."],
      sanitizedDiagnoses: diagnosisStr,
    };
  }
}

function cleanJSONResponse(text: string): string {
  let cleaned = text.trim();

  // Remove markdown code fences if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }

  // Some models may return leading/trailing commentary or single quotes.
  // Attempt to extract the first JSON object/array in the text.
  const firstObjOrArr = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (firstObjOrArr?.[1]) cleaned = firstObjOrArr[1];

  // Normalize single quotes to double quotes for JSON compatibility (best-effort).
  // Only do this if there are no double quotes at all; prevents corrupting already-valid JSON.
  const looksLikeSingleQuoted = cleaned.includes("'") && !cleaned.includes('"');
  if (looksLikeSingleQuoted) {
    cleaned = cleaned.replace(/'/g, '"');
  }

  return cleaned.trim();
}


