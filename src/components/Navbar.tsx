import React from 'react';
import {
  Sparkles,
  Server,
  RefreshCw,
  Terminal,
  BookOpen,
  Apple,
  RotateCcw,
} from 'lucide-react';
import { ApiHealthResponse, StudentProfile } from '../types/academic';

interface Props {
  health: ApiHealthResponse | null;
  healthLoading: boolean;
  student: StudentProfile;
  cgpa?: number;
  isCalculating: boolean;
  onRecalculate: () => void;
  onLoadSample: () => void;
  onReset: () => void;
  onOpenMacGuide: () => void;
}

export const Navbar: React.FC<Props> = ({
  health,
  healthLoading,
  student,
  cgpa,
  isCalculating,
  onRecalculate,
  onLoadSample,
  onReset,
  onOpenMacGuide,
}) => {
  const isCrowActive = health?.cpp_crow_server?.active ?? false;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 shadow-md shadow-emerald-500/20 border border-emerald-400/30">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 tracking-wider text-base sm:text-lg">
                  METAMORPHOSIS
                </span>
                <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  C++ REST v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Academic Performance Tracker &bull; GPA / CGPA Engine
              </p>
            </div>
          </div>

          {/* Student Status Chip */}
          <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-slate-400">Student:</span>
            <span className="font-semibold text-slate-200">
              {student.student_name || 'Unassigned'}
            </span>
            <span className="text-slate-500 font-mono">({student.student_id || 'N/A'})</span>
            {cgpa !== undefined && (
              <span className="ml-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono">
                CGPA {cgpa.toFixed(2)}
              </span>
            )}
          </div>

          {/* C++ Backend Health Status & Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* C++ Status Indicator */}
            <div
              className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono border ${
                isCrowActive
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
                  : 'bg-amber-950/40 text-amber-300 border-amber-800/60'
              }`}
              title={
                isCrowActive
                  ? 'C++ Crow REST Server is active on port 5050'
                  : 'Using native C++ standalone CLI calculation pipeline'
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isCrowActive ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                }`}
              />
              <Server className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {healthLoading
                  ? 'Checking C++...'
                  : isCrowActive
                  ? 'C++ Crow: LIVE'
                  : 'C++ CLI: ACTIVE'}
              </span>
            </div>

            {/* macOS Guide Button */}
            <button
              onClick={onOpenMacGuide}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-medium transition-all"
              title="View macOS build & run instructions for college project"
            >
              <Apple className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">macOS Guide</span>
            </button>

            {/* Load Sample Record */}
            <button
              onClick={onLoadSample}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-medium transition-all"
              title="Populate 3 semesters with sample college courses"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Sample Data</span>
            </button>

            {/* Recalculate C++ Button */}
            <button
              onClick={onRecalculate}
              disabled={isCalculating}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs shadow-md shadow-emerald-900/30 border border-emerald-400/30 transition-all disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isCalculating ? 'animate-spin' : ''}`}
              />
              <span>{isCalculating ? 'Calculating...' : 'Recalculate C++'}</span>
            </button>

            {/* Reset */}
            <button
              onClick={onReset}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 transition-all"
              title="Reset All Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
