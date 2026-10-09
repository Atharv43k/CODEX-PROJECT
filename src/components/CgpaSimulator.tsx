import React, { useState } from 'react';
import { simulateTargetCgpa } from '../services/api';
import { SimulationResult } from '../types/academic';
import {
  Calculator,
  Target,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface Props {
  currentCgpa: number;
  currentCredits: number;
}

export const CgpaSimulator: React.FC<Props> = ({
  currentCgpa,
  currentCredits,
}) => {
  const [targetCgpa, setTargetCgpa] = useState<number>(
    Math.min(4.0, Math.round((currentCgpa + 0.3) * 10) / 10)
  );
  const [futureCredits, setFutureCredits] = useState<number>(15);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await simulateTargetCgpa({
        current_cgpa: currentCgpa || 3.0,
        current_credits: currentCredits || 30.0,
        target_cgpa: targetCgpa,
        future_credits: futureCredits,
      });
      setSimulation(res);
    } catch (err: any) {
      setError(err.message || 'Simulation calculation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 sm:p-7 shadow-lg shadow-black/40 backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800/80 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-100">Target CGPA What-If Simulator</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Calculate the exact upcoming semester GPA required to achieve your target graduation honors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
            Powered by C++ Math Engine
          </span>
        </div>
      </div>

      {/* Simulator Inputs */}
      <form onSubmit={handleSimulate} className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Current State (Readonly info) */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Current CGPA
          </span>
          <div className="text-xl font-black font-mono text-emerald-400 mt-1">
            {currentCgpa ? currentCgpa.toFixed(2) : '3.00'}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            Across {currentCredits.toFixed(1)} earned credits
          </span>
        </div>

        {/* Desired Target CGPA */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
            Target CGPA (up to 4.00)
          </label>
          <input
            type="number"
            step="0.05"
            min="1.0"
            max="4.0"
            value={targetCgpa}
            onChange={(e) => setTargetCgpa(parseFloat(e.target.value) || 3.5)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-slate-100 focus:outline-none focus:border-cyan-500/80"
          />
          <p className="text-[10px] text-slate-500">Goal for cumulative average</p>
        </div>

        {/* Future Credit Hours */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
            Upcoming Credit Hours
          </label>
          <input
            type="number"
            min="1"
            max="60"
            step="1"
            value={futureCredits}
            onChange={(e) => setFutureCredits(parseInt(e.target.value, 10) || 15)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-slate-100 focus:outline-none focus:border-cyan-500/80"
          />
          <p className="text-[10px] text-slate-500">Credits planned in upcoming terms</p>
        </div>

        {/* Submit */}
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold text-xs shadow-md shadow-cyan-950/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{loading ? 'Simulating...' : 'Calculate Target'}</span>
          </button>
        </div>
      </form>

      {/* Results banner */}
      {simulation && (
        <div
          className={`p-5 rounded-xl border transition-all ${
            simulation.is_achievable
              ? 'bg-emerald-950/30 border-emerald-500/30 text-slate-200'
              : 'bg-rose-950/30 border-rose-500/30 text-slate-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                C++ Math Engine Target Assessment
              </span>
              <div className="flex items-center gap-2 mt-1">
                {simulation.is_achievable ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                )}
                <h3 className="text-base font-bold text-white">
                  Required Upcoming GPA:{' '}
                  <span
                    className={`font-mono ${
                      simulation.is_achievable ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {simulation.required_gpa.toFixed(2)}
                  </span>
                </h3>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold font-mono border ${
                simulation.is_achievable
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {simulation.is_achievable ? 'Mathematically Achievable' : 'Target Exceeds 4.00 Max'}
            </span>
          </div>

          <p className="text-xs text-slate-300 mt-3 leading-relaxed">
            {simulation.advice}
          </p>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
