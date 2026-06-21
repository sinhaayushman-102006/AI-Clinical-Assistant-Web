import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

interface ConsoleLog {
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
}

interface AgentConsoleProps {
  logs: ConsoleLog[];
}

export default function AgentConsole({ logs }: AgentConsoleProps) {
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColor = (type: string) => {
    switch (type) {
      case "info":
        return "text-cyan-400 border-l-cyan-400";
      case "success":
        return "text-emerald-400 border-l-emerald-400";
      case "warning":
        return "text-amber-400 border-l-amber-400";
      case "error":
        return "text-red-400 border-l-red-400";
      default:
        return "text-slate-400 border-l-slate-400";
    }
  };

  return (
    <div className="h-80 bg-slate-950 border-t border-slate-800 flex flex-col overflow-hidden">
      <div className="px-6 py-3 border-b border-slate-800 flex items-center justify-between">
        <h3 className="font-bold text-white flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          Agent Orchestration Console
        </h3>
        <Button
          onClick={() => {}}
          className="text-xs px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-all"
        >
          Clear
        </Button>
      </div>
      <div
        ref={consoleRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-sm"
        style={{
          scrollBehavior: "smooth",
        }}
      >
        {logs.map((log, idx) => (
          <div
            key={idx}
            className={`log-entry ${getLogColor(log.type)} border-l-2 pl-3 py-0.5 animate-slide-up-fade`}
            style={{
              animationDelay: `${idx * 30}ms`,
            }}
          >
            <span className="text-slate-500">{log.timestamp}</span> {log.message}
          </div>
        ))}
      </div>
    </div>
  );
}
