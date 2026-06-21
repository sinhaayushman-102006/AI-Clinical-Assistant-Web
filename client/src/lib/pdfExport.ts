import { PatientData, AnalysisResults } from "./types";

export function generateClinicalReport(patientData: PatientData, analysisResults: AnalysisResults): string {
  const timestamp = new Date().toLocaleString();

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Clinical Analysis Report</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #1f2937;
          line-height: 1.6;
          margin: 0;
          padding: 20px;
          background: #fff;
        }
        .header {
          border-bottom: 3px solid #0891b2;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .title {
          font-size: 28px;
          font-weight: bold;
          color: #0891b2;
          margin: 0 0 10px 0;
        }
        .subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }
        .section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #1f2937;
          border-left: 4px solid #0891b2;
          padding-left: 12px;
          margin-bottom: 15px;
        }
        .vitals-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }
        .vital {
          background: #f3f4f6;
          padding: 12px;
          border-radius: 6px;
          border-left: 3px solid #0891b2;
        }
        .vital-label {
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .vital-value {
          font-size: 20px;
          font-weight: bold;
          color: #1f2937;
        }
        .complaint {
          background: #f9fafb;
          padding: 15px;
          border-radius: 6px;
          border-left: 3px solid #6366f1;
          font-style: italic;
          color: #374151;
        }
        .diagnosis-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .diagnosis-item {
          background: #f3f4f6;
          padding: 12px;
          margin-bottom: 10px;
          border-radius: 6px;
          border-left: 4px solid #10b981;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .diagnosis-name {
          font-weight: 600;
          color: #1f2937;
        }
        .diagnosis-prob {
          background: #d1fae5;
          color: #065f46;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
        }
        .interaction-item {
          background: #fee2e2;
          padding: 12px;
          margin-bottom: 10px;
          border-radius: 6px;
          border-left: 4px solid #dc2626;
        }
        .interaction-header {
          font-weight: bold;
          color: #7f1d1d;
          margin-bottom: 4px;
        }
        .interaction-severity {
          display: inline-block;
          background: #dc2626;
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: bold;
          margin-left: 8px;
        }
        .interaction-risk {
          color: #5f2120;
          font-size: 13px;
          margin-top: 4px;
        }
        .bibliography {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .bibliography-item {
          background: #f3f4f6;
          padding: 12px;
          margin-bottom: 10px;
          border-radius: 6px;
          border-left: 3px solid #8b5cf6;
          font-size: 13px;
        }
        .ref-id {
          color: #0891b2;
          font-weight: 600;
          font-family: monospace;
          margin-bottom: 4px;
        }
        .ref-title {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }
        .ref-source {
          color: #6b7280;
          font-size: 12px;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 12px;
          color: #6b7280;
          text-align: center;
        }
        .warning-box {
          background: #fef3c7;
          border: 1px solid #fcd34d;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 15px;
          color: #78350f;
        }
        @media print {
          body { margin: 0; padding: 10px; }
          .section { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">⚕️ Clinical Analysis Report</div>
        <div class="subtitle">AI Clinical Decision Assistant | Generated: ${timestamp}</div>
      </div>

      <!-- Patient Information Section -->
      <div class="section">
        <div class="section-title">Patient Information</div>
        <div class="vitals-grid">
          ${patientData.age ? `<div class="vital"><div class="vital-label">Age</div><div class="vital-value">${patientData.age} years</div></div>` : ""}
          ${patientData.hr ? `<div class="vital"><div class="vital-label">Heart Rate</div><div class="vital-value">${patientData.hr} bpm</div></div>` : ""}
          ${patientData.bp ? `<div class="vital"><div class="vital-label">Blood Pressure</div><div class="vital-value">${patientData.bp} mmHg</div></div>` : ""}
          ${patientData.spo2 ? `<div class="vital"><div class="vital-label">SpO₂</div><div class="vital-value">${patientData.spo2}%</div></div>` : ""}
          ${patientData.temp ? `<div class="vital"><div class="vital-label">Temperature</div><div class="vital-value">${patientData.temp}°C</div></div>` : ""}
        </div>
      </div>

      <!-- Chief Complaint Section -->
      ${patientData.complaint ? `
      <div class="section">
        <div class="section-title">Chief Complaint & Clinical History</div>
        <div class="complaint">${escapeHtml(patientData.complaint)}</div>
      </div>
      ` : ""}

      <!-- Differential Diagnoses Section -->
      ${analysisResults.diagnoses.length > 0 ? `
      <div class="section">
        <div class="section-title">Differential Diagnoses</div>
        <ul class="diagnosis-list">
          ${analysisResults.diagnoses.map((d) => `
            <li class="diagnosis-item">
              <span class="diagnosis-name">${escapeHtml(d.name)}</span>
              <span class="diagnosis-prob">${d.probability}%</span>
            </li>
          `).join("")}
        </ul>
      </div>
      ` : ""}

      <!-- Drug Interactions Section -->
      ${analysisResults.drugInteractions.length > 0 ? `
      <div class="section">
        <div class="warning-box">
          ⚠️ <strong>Critical Drug Interactions Detected</strong> - Review immediately before prescribing
        </div>
        ${analysisResults.drugInteractions.map((i) => `
          <div class="interaction-item">
            <div class="interaction-header">
              ${escapeHtml(i.drugs)}
              <span class="interaction-severity">${i.severity}</span>
            </div>
            <div class="interaction-risk">${escapeHtml(i.risk)}</div>
          </div>
        `).join("")}
      </div>
      ` : ""}

      <!-- Bibliography Section -->
      ${analysisResults.bibliography.length > 0 ? `
      <div class="section">
        <div class="section-title">Evidence-Backed Sources</div>
        <ul class="bibliography">
          ${analysisResults.bibliography.map((b) => `
            <li class="bibliography-item">
              <div class="ref-id">${escapeHtml(b.id)}</div>
              <div class="ref-title">${escapeHtml(b.title)}</div>
              <div class="ref-source">
                ${b.journal ? `${escapeHtml(b.journal)}` : b.org ? `${escapeHtml(b.org)}` : ""} (${b.year})
              </div>
            </li>
          `).join("")}
        </ul>
      </div>
      ` : ""}

      <div class="footer">
        <p>This report is generated by the AI Clinical Decision Assistant for educational and reference purposes only.</p>
        <p>Clinical decisions should always be made by qualified healthcare professionals in consultation with the patient.</p>
      </div>
    </body>
    </html>
  `;

  return html;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export function downloadPDF(html: string, filename: string = "clinical_report.pdf"): void {
  // Create a blob from the HTML
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  // Create a temporary link and trigger download
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function printReport(html: string): void {
  const printWindow = window.open("", "", "width=800,height=600");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  }
}
