import React from 'react';
import { Award, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

interface Props {
  classification: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ClassificationBadge: React.FC<Props> = ({ classification, size = 'md' }) => {
  let colorClasses = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
  let icon = <Award className="w-4 h-4 shrink-0 text-emerald-400" />;

  if (classification.includes('Distinction') || classification.includes('High Honors')) {
    colorClasses = 'bg-cyan-500/15 text-cyan-200 border-cyan-400/40 shadow-sm shadow-cyan-500/20';
    icon = <Award className="w-4 h-4 shrink-0 text-cyan-300" />;
  } else if (classification.includes("Dean's List")) {
    colorClasses = 'bg-teal-500/15 text-teal-200 border-teal-400/40 shadow-sm shadow-teal-500/20';
    icon = <Award className="w-4 h-4 shrink-0 text-teal-300" />;
  } else if (classification.includes('First Class')) {
    colorClasses = 'bg-emerald-500/15 text-emerald-200 border-emerald-400/40';
    icon = <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-300" />;
  } else if (classification.includes('Second Class Upper')) {
    colorClasses = 'bg-blue-500/15 text-blue-200 border-blue-400/40';
    icon = <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-300" />;
  } else if (classification.includes('Second Class Lower')) {
    colorClasses = 'bg-amber-500/15 text-amber-200 border-amber-400/40';
    icon = <AlertTriangle className="w-4 h-4 shrink-0 text-amber-300" />;
  } else if (classification.includes('Probation') || classification.includes('Action Required')) {
    colorClasses = 'bg-rose-500/20 text-rose-200 border-rose-400/50 shadow-sm shadow-rose-500/20';
    icon = <ShieldAlert className="w-4 h-4 shrink-0 text-rose-300" />;
  }

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 gap-1.5',
    md: 'text-sm px-3.5 py-1.5 gap-2',
    lg: 'text-base px-4 py-2 gap-2.5 font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border backdrop-blur-md transition-all ${colorClasses} ${sizeClasses}`}
    >
      {icon}
      <span>{classification || 'Awaiting Calculation'}</span>
    </span>
  );
};
