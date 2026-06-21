import { Button } from "@/components/ui/button";
import { PatientData, AnalysisResults } from "@/lib/types";
import { generateClinicalReport, printReport, downloadPDF } from "@/lib/pdfExport";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientData: PatientData;
  analysisResults: AnalysisResults;
}

export default function ExportModal({
  isOpen,
  onClose,
  patientData,
  analysisResults,
}: ExportModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    const html = generateClinicalReport(patientData, analysisResults);
    printReport(html);
    onClose();
  };

  const handleDownload = () => {
    const html = generateClinicalReport(patientData, analysisResults);
    const timestamp = new Date().toISOString().slice(0, 10);
    downloadPDF(html, `clinical_report_${timestamp}.html`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-slate-900 rounded-lg shadow-2xl p-6 max-w-md w-full mx-4 border border-slate-700 animate-scale-in">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span>📄</span> Export Clinical Report
        </h2>

        <p className="text-slate-300 mb-6">
          Choose how you would like to export the clinical analysis report:
        </p>

        <div className="space-y-3">
          <Button
            onClick={handlePrint}
            className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <span>🖨️</span> Print Report
          </Button>

          <Button
            onClick={handleDownload}
            className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <span>💾</span> Download as HTML
          </Button>

          <Button
            onClick={onClose}
            className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg transition-all"
          >
            Cancel
          </Button>
        </div>

        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <p className="text-xs text-slate-400">
            <strong>Note:</strong> The report includes patient vitals, differential diagnoses, drug interactions, and evidence-backed sources for clinical reference.
          </p>
        </div>
      </div>
    </div>
  );
}
