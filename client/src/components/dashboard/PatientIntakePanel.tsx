import { Button } from "@/components/ui/button";
import { PatientData } from "@/lib/types";
import { useRef } from "react";

interface PatientIntakePanelProps {
  patientData: PatientData;
  setPatientData: (data: PatientData) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export default function PatientIntakePanel({
  patientData,
  setPatientData,
  onAnalyze,
  isAnalyzing,
}: PatientIntakePanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof PatientData, value: any) => {
    setPatientData({
      ...patientData,
      [field]: value,
    });
  };

  const handleFileChange = (files: FileList | null) => {
    if (files) {
      setPatientData({
        ...patientData,
        files: Array.from(files),
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("drag-over");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
    handleFileChange(e.dataTransfer.files);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Patient Intake</h2>

        {/* Patient Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">Patient Name</label>
          <input
            type="text"
            value={patientData.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:border-cyan-500 focus:outline-none transition-colors"
            placeholder="e.g., John Doe"
          />
        </div>

        {/* Vitals Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Age (years)</label>
            <input
              type="number"
              min="0"
              max="150"
              value={patientData.age || ""}
              onChange={(e) => handleInputChange("age", e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:border-cyan-500 focus:outline-none transition-colors"
              placeholder="e.g., 64"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Heart Rate (bpm)</label>
            <input
              type="number"
              min="0"
              max="250"
              value={patientData.hr || ""}
              onChange={(e) => handleInputChange("hr", e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:border-cyan-500 focus:outline-none transition-colors"
              placeholder="e.g., 105"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Blood Pressure (mmHg)</label>
            <input
              type="text"
              value={patientData.bp || ""}
              onChange={(e) => handleInputChange("bp", e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:border-cyan-500 focus:outline-none transition-colors"
              placeholder="e.g., 145/92"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">SpO2 (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={patientData.spo2 || ""}
              onChange={(e) => handleInputChange("spo2", e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:border-cyan-500 focus:outline-none transition-colors"
              placeholder="e.g., 92"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Temperature (°C)</label>
            <input
              type="number"
              step="0.1"
              value={patientData.temp || ""}
              onChange={(e) => handleInputChange("temp", e.target.value ? parseFloat(e.target.value) : null)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:border-cyan-500 focus:outline-none transition-colors"
              placeholder="e.g., 37.2"
            />
          </div>
        </div>

        {/* Chief Complaint */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">Chief Complaint & Clinical History</label>
          <textarea
            value={patientData.complaint || ""}
            onChange={(e) => handleInputChange("complaint", e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-md text-white focus:border-cyan-500 focus:outline-none transition-colors resize-none h-24"
            placeholder="Describe patient symptoms, medical history, current medications..."
          />
        </div>

        {/* Lab Upload Zone */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">Lab Reports & Attachments</label>
          <div
            ref={fileInputRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="drop-zone border-2 border-dashed border-slate-700 rounded-md p-6 text-center cursor-pointer transition-all duration-300 hover:border-cyan-500 hover:scale-105 bg-slate-800/50 hover:bg-slate-800"
          >
            <div className="text-4xl mb-2">▢</div>
            <p className="text-slate-300 font-medium">Drag & drop lab reports here</p>
            <p className="text-slate-500 text-sm">or click to browse (PDF, images)</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileChange(e.target.files)}
              className="hidden"
              multiple
              accept=".pdf,.jpg,.png,.jpeg"
            />
          </div>
          {patientData.files.length > 0 && (
            <div id="fileList" className="mt-3 space-y-2">
              {patientData.files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 bg-slate-800 rounded-md text-sm text-slate-300 animate-slide-up-fade"
                  style={{
                    animationDelay: `${idx * 50}ms`,
                  }}
                >
                  <span>▪</span>
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition-all disabled:opacity-50 text-sm"
          >
            Analyze Patient
          </Button>
          <Button
            onClick={() =>
              setPatientData({
                name: null,
                age: null,
                hr: null,
                bp: null,
                spo2: null,

                temp: null,
                complaint: null,
                files: [],
              })
            }
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-md transition-all text-sm"
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
