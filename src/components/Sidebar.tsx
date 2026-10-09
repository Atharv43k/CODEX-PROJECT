import React from 'react';
import {
  LayoutDashboard,
  UserCheck,
  GraduationCap,
  TableProperties,
  Calculator,
  TerminalSquare,
  Sparkles,
} from 'lucide-react';

export type NavTab =
  | 'overview'
  | 'student'
  | 'courses'
  | 'audit'
  | 'simulator'
  | 'inspector';

interface Props {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  totalCourses: number;
  totalSemesters: number;
  cgpa?: number;
}

export const Sidebar: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  totalCourses,
  totalSemesters,
  cgpa,
}) => {
  const navItems = [
    {
      id: 'overview' as NavTab,
      label: 'Performance Dashboard',
      icon: LayoutDashboard,
      badge: cgpa !== undefined ? `CGPA ${cgpa.toFixed(2)}` : undefined,
    },
    {
      id: 'student' as NavTab,
      label: 'Student Information',
      icon: UserCheck,
      badge: `${totalSemesters} Sem${totalSemesters > 1 ? 's' : ''}`,
    },
    {
      id: 'courses' as NavTab,
      label: 'Course & Hours Manager',
      icon: GraduationCap,
      badge: `${totalCourses} Courses`,
    },
    {
      id: 'audit' as NavTab,
      label: 'Detailed Course Audit',
      icon: TableProperties,
      badge: 'Tables',
    },
    {
      id: 'simulator' as NavTab,
      label: 'Target CGPA Simulator',
      icon: Calculator,
      badge: 'What-If',
    },
    {
      id: 'inspector' as NavTab,
      label: 'C++ REST Engine Inspector',
      icon: TerminalSquare,
      badge: 'C++ API',
    },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-slate-900/60 lg:min-h-[calc(100vh-4rem)] border-b lg:border-b-0 lg:border-r border-slate-800/80 p-4">
      {/* Metamorphosis Subheader */}
      <div className="mb-4 px-2 hidden lg:block">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Academic Navigation</span>
        </div>
      </div>

      <nav className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-950/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full ml-1 shrink-0 ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* College Project Badge footer in sidebar */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 hidden lg:block">
        <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800 text-xs">
          <p className="font-semibold text-slate-300">College Project Architecture</p>
          <p className="text-[11px] text-slate-400 mt-1">
            Separated frontend (React+TS) with single source of truth in C++ Crow HTTP daemon.
          </p>
          <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-emerald-400">
            <span>C++ Engine 2.4</span>
            <span className="text-slate-500">CMake 3.25</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
