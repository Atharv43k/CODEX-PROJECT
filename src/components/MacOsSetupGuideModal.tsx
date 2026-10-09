import React, { useState } from 'react';
import {
  X,
  Apple,
  Terminal,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const MacOsSetupGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: 'Step 1: Install macOS Prerequisites with Homebrew',
      desc: 'Open Terminal on your Mac and install CMake, Boost, and Asio:',
      code: 'brew install cmake boost asio nlohmann-json',
    },
    {
      title: 'Step 2: Compile the C++ Backend with CMake',
      desc: 'Run the included automated macOS build script (or manual CMake):',
      code: 'chmod +x backend/build_macos.sh\n./backend/build_macos.sh',
    },
    {
      title: 'Step 3: Launch the C++ Crow REST Server',
      desc: 'Start the high-performance C++ backend daemon:',
      code: './backend/run_macos.sh 5050',
    },
    {
      title: 'Step 4: Test the C++ REST API with curl',
      desc: 'Verify that the C++ server responds to HTTP requests:',
      code: 'curl http://localhost:5050/api/health',
    },
    {
      title: 'Step 5: Start the Full-Stack Application',
      desc: 'Install node dependencies and launch the integrated dev server:',
      code: 'npm install\nnpm run dev',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700">
              <Apple className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">macOS Build & Execution Guide</h3>
              <p className="text-xs text-slate-400">
                Complete instructions for college project evaluation and local demonstration.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-300 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
            <strong className="block text-emerald-200 text-sm mb-1">
              Architecture Proof for Project Viva / Presentation:
            </strong>
            The C++ backend compiles natively on macOS using Clang or Apple Silicon GCC, with Crow
            handling HTTP REST endpoints and <code className="font-mono">AcademicEngine.cpp</code> acting
            as the single mathematical source of truth.
          </div>

          <div className="space-y-5">
            {steps.map((step, idx) => (
              <div key={idx} className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs sm:text-sm">{step.title}</h4>
                  <button
                    onClick={() => copyCode(step.code, idx)}
                    className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-400">{step.desc}</p>
                <pre className="p-3 rounded-lg bg-black/60 border border-slate-800/80 font-mono text-[11px] text-emerald-300 overflow-x-auto">
                  {step.code}
                </pre>
              </div>
            ))}
          </div>

          {/* Verification Tip */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
            <h5 className="font-semibold text-slate-200">How to prove C++ execution to the examiner:</h5>
            <ol className="list-decimal list-inside space-y-1 text-slate-400">
              <li>Open the &ldquo;C++ REST Engine Inspector&rdquo; tab in the sidebar.</li>
              <li>Inspect the live JSON payload and microsecond calculation timing.</li>
              <li>Notice the <code className="text-cyan-300 font-mono">_engine_transport</code> and engine version metadata returned directly from the Crow server daemon.</li>
            </ol>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
