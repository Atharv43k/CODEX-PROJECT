import React from 'react';
import { CalculationResponse } from '../types/academic';
import { ClassificationBadge } from './ClassificationBadge';
import {
  GraduationCap,
  Clock,
  Layers,
  Cpu,
  Target,
  BarChart3,
  Flame,
} from 'lucide-react';

interface Props {
  results: CalculationResponse | null;
  latencyMs: number;
}

export const AcademicSummaryCards: React.FC<Props> = ({ results, latencyMs }) => {
  if (!results) {
    return (
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center">
        <p className="text-sm text-slate-400">Click &ldquo;Recalculate C++&rdquo; to compute academic metrics.</p>
      </div>
    );
  }

  const cgpa = results.cgpa || 0;
  const percentage = Math.min(100, Math.round((cgpa / 4.0) * 100));

  return (
    <div className="space-y-4">
      {/* Top Main Hero Metric: Cumulative CGPA Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 shadow-xl shadow-black/50">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* CGPA Display */}
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative flex items-center justify-center w-24 h-24 rounded-2xl bg-slate-950/80 border border-emerald-500/30 shadow-inner shrink-0">
              {/* Circular gauge indicator */}
              <svg className="w-20 h-20 -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  className="stroke-slate-800"
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  className="stroke-emerald-400 transition-all duration-700 ease-out"
                  strokeWidth="6"
                  strokeDasharray="213.6"
                  strokeDashoffset={213.6 - (213.6 * percentage) / 100}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black font-mono tracking-tight text-white">
                  {cgpa.toFixed(2)}
                </span>
                <span className="text-[9px] font-mono uppercase text-slate-400">out of 4.0</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Cumulative Academic Standing
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {percentage}%
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                CGPA: {cgpa.toFixed(2)}
              </h1>
              <div className="mt-2.5">
                <ClassificationBadge classification={results.classification} size="md" />
              </div>
            </div>
          </div>

          {/* Engine Latency & Metadata */}
          <div className="flex flex-col sm:items-end justify-between border-t md:border-t-0 md:border-l border-slate-800/80 pt-4 md:pt-0 md:pl-6 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>C++ Native Execution:</span>
              <strong className="text-cyan-300">
                {results.computation_time_ms ? `${results.computation_time_ms.toFixed(3)} ms` : '< 0.1 ms'}
              </strong>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>Network Latency:</span>
              <strong className="text-teal-300">{latencyMs} ms</strong>
            </div>

            <div className="text-[11px] font-mono text-slate-500">
              {results._engine_transport || 'C++ Crow HTTP Micro-Framework'}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Key Aggregate Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Credit Hours */}
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Total Credits</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-slate-100">
              {results.total_credits_all.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-slate-400">credit hrs</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Completed across all semesters</p>
        </div>

        {/* Total Weighted Grade Points */}
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Weighted Points</span>
            <Flame className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-slate-100">
              {results.total_weighted_points_all.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-slate-400">pts</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">&sum;(Grade Point &times; Hours)</p>
        </div>

        {/* Total Courses Completed */}
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Total Courses</span>
            <GraduationCap className="w-4 h-4 text-teal-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-slate-100">
              {results.total_courses_all}
            </span>
            <span className="text-xs font-mono text-slate-400">graded courses</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Enrolled and evaluated</p>
        </div>

        {/* Semesters Count */}
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Semesters</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-slate-100">
              {results.total_semesters}
            </span>
            <span className="text-xs font-mono text-slate-400">semesters</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Active curriculum cycle</p>
        </div>
      </div>
    </div>
  );
};
