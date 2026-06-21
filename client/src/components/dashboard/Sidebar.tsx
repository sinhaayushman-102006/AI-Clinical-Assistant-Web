import { Button } from "@/components/ui/button";

export type ViewName = "dashboard" | "records" | "analytics" | "settings";

interface NavItem {
  id: ViewName;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "records", label: "Patient Records", icon: "▣" },
  { id: "analytics", label: "Analytics", icon: "▲" },
  { id: "settings", label: "Settings", icon: "⚙" },
];

interface SidebarProps {
  activeView: ViewName;
  onViewChange: (view: ViewName) => void;
  onDemoClick: () => void;
  onExportClick: () => void;
  isAnalyzing: boolean;
  hasResults?: boolean;
  recordCount?: number;
}

export default function Sidebar({
  activeView,
  onViewChange,
  onDemoClick,
  onExportClick,
  isAnalyzing,
  hasResults,
  recordCount = 0,
}: SidebarProps) {
  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">+</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Clinical AI</h1>
            <p className="text-xs text-slate-400">Decision Support System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`nav-item w-full px-4 py-3 rounded-md flex items-center gap-3 transition-all font-medium text-sm ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
              {item.id === "records" && recordCount > 0 && (
                <span className="ml-auto text-xs bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded-full">
                  {recordCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Demo / Export actions */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Demo Mode
        </div>
        <Button
          onClick={() => {
            onViewChange("dashboard");
            onDemoClick();
          }}
          disabled={isAnalyzing}
          className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-semibold rounded-md transition-all pulse-glow flex items-center justify-center gap-2 text-sm"
        >
          <span>Load Demo Case</span>
        </Button>
        <Button
          onClick={onExportClick}
          disabled={!hasResults}
          className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-200 text-sm font-medium rounded-md transition-all"
        >
          Export Report
        </Button>
      </div>
    </div>
  );
}
