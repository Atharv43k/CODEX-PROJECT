import React from 'react';
import { CourseResult } from '../types/academic';
import { Trophy, AlertCircle, Sparkles, TrendingUp, Compass, CheckCircle } from 'lucide-react';

interface Props {
  topCourse?: CourseResult;
  focusCourse?: CourseResult;
}

export const TopAndFocusCourses: React.FC<Props> = ({ topCourse, focusCourse }) => {
  if (!topCourse || !focusCourse || !topCourse.course_name) {
    return null;
  }

  const isFocusCoursePassing = focusCourse.is_passing && focusCourse.grade_point >= 2.0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* TOP PERFORMING COURSE */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/30 border border-emerald-500/30 p-5 shadow-lg shadow-black/40">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Trophy className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 block">
                C++ Designated Spotlight
              </span>
              <h3 className="text-base font-bold text-white">Top Performing Course</h3>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
            Grade: {topCourse.letter_grade} ({topCourse.grade_point.toFixed(2)})
          </span>
        </div>

        <div className="mt-4">
          <h4 className="text-base font-semibold text-slate-100">{topCourse.course_name}</h4>
          <p className="text-xs text-slate-400 mt-1">
            Achieved maximum grade impact with an exceptional grade point average in this credit tier.
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="block text-[10px] font-mono uppercase text-slate-400">Credit Hours</span>
            <span className="text-xs font-mono font-bold text-slate-200">
              {topCourse.credit_hours} hrs
            </span>
          </div>

          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="block text-[10px] font-mono uppercase text-slate-400">Grade Point</span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {topCourse.grade_point.toFixed(2)}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <span className="block text-[10px] font-mono uppercase text-emerald-400">Weighted Pts</span>
            <span className="text-xs font-mono font-bold text-emerald-300">
              {topCourse.weighted_points.toFixed(1)} pts
            </span>
          </div>
        </div>
      </div>

      {/* FOCUS COURSE (LOWEST-PERFORMING COURSE) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/25 border border-amber-500/30 p-5 shadow-lg shadow-black/40">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Compass className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block">
                C++ Identified Focus Area
              </span>
              <h3 className="text-base font-bold text-white">Focus Course (Improvement Opportunity)</h3>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
            Grade: {focusCourse.letter_grade} ({focusCourse.grade_point.toFixed(2)})
          </span>
        </div>

        <div className="mt-4">
          <h4 className="text-base font-semibold text-slate-100">{focusCourse.course_name}</h4>
          <p className="text-xs text-slate-400 mt-1">
            {isFocusCoursePassing
              ? 'Currently your lowest contributing grade. Raising this in subsequent coursework will provide the highest CGPA boost.'
              : 'Requires academic review or possible grade replacement/retake to improve cumulative standing.'}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="block text-[10px] font-mono uppercase text-slate-400">Credit Hours</span>
            <span className="text-xs font-mono font-bold text-slate-200">
              {focusCourse.credit_hours} hrs
            </span>
          </div>

          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="block text-[10px] font-mono uppercase text-slate-400">Grade Point</span>
            <span className="text-xs font-mono font-bold text-amber-400">
              {focusCourse.grade_point.toFixed(2)}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <span className="block text-[10px] font-mono uppercase text-amber-400">Weighted Pts</span>
            <span className="text-xs font-mono font-bold text-amber-300">
              {focusCourse.weighted_points.toFixed(1)} pts
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
