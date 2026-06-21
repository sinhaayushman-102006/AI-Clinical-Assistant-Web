import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { clearAllRecords } from "@/lib/patientDB";

const SETTINGS_KEY = "clinical_settings";

interface AppSettings {
  clinicianName: string;
  facilityName: string;
  llmModel: string;
  autoSave: boolean;
  showWarnings: boolean;
}

const DEFAULTS: AppSettings = {
  clinicianName: "Dr. Demo",
  facilityName: "City General Hospital",
  llmModel: "meta-llama/llama-3-8b-instruct",
  autoSave: true,
  showWarnings: true,
};

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

function persistSettings(s: AppSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

export function getSettings(): AppSettings {
  return loadSettings();
}

interface SettingsPanelProps {
  onRecordsCleared: () => void;
}

export default function SettingsPanel({ onRecordsCleared }: SettingsPanelProps) {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [saved, setSaved] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setSaved(false);
  }, [settings]);

  const update = <K extends keyof AppSettings>(key: K, val: AppSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = () => {
    persistSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    clearAllRecords();
    setConfirmClear(false);
    onRecordsCleared();
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>

      {/* Clinician Info */}
      <Section title="Clinician Information">
        <Field label="Clinician Name">
          <input
            type="text"
            value={settings.clinicianName}
            onChange={(e) => update("clinicianName", e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white text-sm focus:border-cyan-500 focus:outline-none"
          />
        </Field>
        <Field label="Facility / Hospital Name">
          <input
            type="text"
            value={settings.facilityName}
            onChange={(e) => update("facilityName", e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white text-sm focus:border-cyan-500 focus:outline-none"
          />
        </Field>
      </Section>

      {/* AI Model */}
      <Section title="AI / LLM Configuration">
        <Field label="Primary Language Model">
          <select
            value={settings.llmModel}
            onChange={(e) => update("llmModel", e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white text-sm focus:border-cyan-500 focus:outline-none"
          >
            <option value="meta-llama/llama-3-8b-instruct">Llama 3 8B Instruct (fast)</option>
            <option value="mistralai/mistral-7b-instruct">Mistral 7B Instruct</option>
            <option value="anthropic/claude-3-haiku">Claude 3 Haiku</option>
            <option value="openai/gpt-4o-mini">GPT-4o Mini</option>
          </select>
        </Field>
        <p className="text-xs text-slate-500 mt-1">
          Model is set via OpenRouter. Changing requires an active API key.
        </p>
      </Section>

      {/* Preferences */}
      <Section title="Preferences">
        <Toggle
          label="Auto-save patient records after analysis"
          value={settings.autoSave}
          onChange={(v) => update("autoSave", v)}
        />
        <Toggle
          label="Show clinical warnings in console"
          value={settings.showWarnings}
          onChange={(v) => update("showWarnings", v)}
        />
      </Section>

      {/* Save button */}
      <Button
        onClick={handleSave}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition-all text-sm"
      >
        {saved ? "✓ Saved!" : "Save Settings"}
      </Button>

      {/* Danger zone */}
      <Section title="Danger Zone">
        <p className="text-xs text-slate-400 mb-3">
          Permanently delete all saved patient records from this device's local storage.
        </p>
        {confirmClear ? (
          <div className="flex gap-2">
            <Button
              onClick={handleClear}
              className="flex-1 py-2 bg-red-700 hover:bg-red-600 text-white text-sm font-semibold rounded-md"
            >
              Yes, Delete All
            </Button>
            <Button
              onClick={() => setConfirmClear(false)}
              className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-md"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setConfirmClear(true)}
            className="w-full py-2 bg-red-900/50 hover:bg-red-900 border border-red-700 text-red-300 text-sm font-medium rounded-md transition-all"
          >
            🗑 Clear All Patient Records
          </Button>
        )}
      </Section>

      {/* About */}
      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-xs text-slate-500 space-y-1">
        <div className="font-semibold text-slate-400">Clinical AI Decision Support System</div>
        <div>Version 1.0.0 · Hackathon Demo Build</div>
        <div>Data stored locally — no PHI leaves this device.</div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4 space-y-3">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm text-slate-300 mb-1">{label}</label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-300">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          value ? "bg-cyan-600" : "bg-slate-600"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
