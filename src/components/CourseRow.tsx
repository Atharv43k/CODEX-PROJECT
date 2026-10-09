import React from 'react';
import { Course, CourseResult, LetterGrade } from '../types/academic';
import { Trash2, AlertCircle, Sparkles, BookMarked, Clock, Award } from 'lucide-react';

interface Props {
  course: Course;
  index: number;
  calculatedResult?: CourseResult;
  onChange: (updated: Course) => void;
  onDelete: () => void;
}

const GRADE_OPTIONS: { grade: LetterGrade; point: number; label: string }[] = [
  { grade: 'A+', point: 4.0, label: 'A+ (4.00 - Outstanding)' },
  { grade: 'A', point: 4.0, label: 'A (4.00 - Excellent)' },
  { grade: 'A-', point: 3.7, label: 'A- (3.70 - Very Good)' },
  { grade: 'B+', point: 3.3, label: 'B+ (3.30 - Good Plus)' },
  { grade: 'B', point: 3.0, label: 'B (3.00 - Good)' },
  { grade: 'B-', point: 2.7, label: 'B- (2.70 - Above Average)' },
  { grade: 'C+', point: 2.3, label: 'C+ (2.30 - Average Plus)' },
  { grade: 'C', point: 2.0, label: 'C (2.00 - Average)' },
  { grade: 'C-', point: 1.7, label: 'C- (1.70 - Below Average)' },
  { grade: 'D+', point: 1.3, label: 'D+ (1.30 - Marginal Pass)' },
  { grade: 'D', point: 1.0, label: 'D (1.00 - Bare Pass)' },
  { grade: 'F', point: 0.0, label: 'F (0.00 - Fail)' },
];

export const CourseRow: React.FC<Props> = ({
  course,
  index,
  calculatedResult,
  onChange,
  onDelete,
}) => {
  const isHoursValid =
    !isNaN(course.credit_hours) &&
    course.credit_hours >= 1 &&
    course.credit_hours <= 10;

  const isNameValid = course.course_name.trim().length > 0;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...course, course_name: e.target.value });
  };

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...course, letter_grade: e.target.value as LetterGrade });
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (rawVal === '') {
      onChange({ ...course, credit_hours: NaN });
    } else {
      const parsed = parseFloat(rawVal);
      onChange({ ...course, credit_hours: parsed });
    }
  };

  return (
    <div className="group relative bg-slate-900/60 hover:bg-slate-900/90 rounded-xl border border-slate-800/90 hover:border-slate-700/80 p-3.5 sm:p-4 transition-all duration-200">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-start">
        {/* Course Index & Name (5 cols) */}
        <div className="md:col-span-5 space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <BookMarked className="w-3.5 h-3.5 text-emerald-400" />
            <span>Course #{index + 1} Name</span>
            <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={course.course_name}
            onChange={handleNameChange}
            placeholder="e.g. Operating Systems & Algorithms"
            className={`w-full px-3.5 py-2 rounded-lg bg-slate-950/80 border text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors ${
              !isNameValid
                ? 'border-rose-500/80 focus:border-rose-400'
                : 'border-slate-800 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30'
            }`}
          />
          {!isNameValid && (
            <p className="flex items-center gap-1 text-[11px] text-rose-400">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>Course name is required</span>
            </p>
          )}
        </div>

        {/* Course Grade (3 cols) */}
        <div className="md:col-span-3 space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <Award className="w-3.5 h-3.5 text-teal-400" />
            <span>Course Grade</span>
            <span className="text-rose-400">*</span>
          </label>
          <select
            value={course.letter_grade}
            onChange={handleGradeChange}
            className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/80 transition-colors cursor-pointer font-medium"
          >
            {GRADE_OPTIONS.map((opt) => (
              <option key={opt.grade} value={opt.grade} className="bg-slate-900 text-slate-100">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* MANDATORY Course Hours / Credit Hours (3 cols) */}
        <div className="md:col-span-3 space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Course Hours / Credits</span>
            <span className="text-rose-400 font-bold">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              max="10"
              step="0.5"
              value={isNaN(course.credit_hours) ? '' : course.credit_hours}
              onChange={handleHoursChange}
              placeholder="Enter course hours"
              className={`w-full px-3 py-2 rounded-lg bg-slate-950/80 border text-sm text-slate-100 placeholder-slate-500 font-mono focus:outline-none transition-colors ${
                !isHoursValid
                  ? 'border-rose-500/80 focus:border-rose-400'
                : 'border-slate-800 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30'
              }`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 pointer-events-none">
              hrs
            </span>
          </div>

          {!isHoursValid ? (
            <p className="flex items-center gap-1 text-[11px] text-rose-400">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>Hours must be 1 to 10</span>
            </p>
          ) : (
            <p className="text-[10px] text-slate-500 font-mono">
              Credit weighting: {course.credit_hours} hrs
            </p>
          )}
        </div>

        {/* Action Button: Delete (1 col) */}
        <div className="md:col-span-1 flex md:flex-col items-center justify-end md:justify-start pt-1 md:pt-7">
          <button
            type="button"
            onClick={onDelete}
            className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
            title="Delete this course"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* C++ Calculation Feedback Banner for this course */}
      {calculatedResult && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              ID: {calculatedResult.course_id || `C${index + 1}`}
            </span>
            <span className="text-slate-400 text-xs">
              Grade Point:{' '}
              <strong className="text-slate-200 font-mono">{calculatedResult.grade_point.toFixed(2)}</strong>
            </span>
            <span className="text-slate-500">&bull;</span>
            <span className="text-slate-400 text-xs">
              Hours:{' '}
              <strong className="text-slate-200 font-mono">{calculatedResult.credit_hours}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">
              Weighted Points:
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono font-bold text-xs">
              {calculatedResult.weighted_points.toFixed(2)} pts
            </span>
            <span
              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                calculatedResult.is_passing
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-rose-500/20 text-rose-300'
              }`}
            >
              {calculatedResult.is_passing ? 'Passed' : 'Failed'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
