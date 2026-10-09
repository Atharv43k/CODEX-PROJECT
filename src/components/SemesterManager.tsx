import React, { useState } from 'react';
import { Semester, SemesterResult, Course, LetterGrade } from '../types/academic';
import { CourseRow } from './CourseRow';
import { COURSE_TEMPLATES } from '../data/sampleData';
import {
  Plus,
  PlusCircle,
  GraduationCap,
  Sparkles,
  BookOpen,
  Trash2,
  AlertTriangle,
  Layers,
} from 'lucide-react';

interface Props {
  semesters: Semester[];
  calculatedSemesters?: SemesterResult[];
  onChangeSemesters: (updated: Semester[]) => void;
  onRecalculate: () => void;
  isCalculating: boolean;
}

export const SemesterManager: React.FC<Props> = ({
  semesters,
  calculatedSemesters,
  onChangeSemesters,
  onRecalculate,
  isCalculating,
}) => {
  const [activeTab, setActiveTab] = useState<number>(1);

  const currentSemester = semesters.find((s) => s.semester_number === activeTab) || semesters[0];
  const currentCalcResult = calculatedSemesters?.find(
    (s) => s.semester_number === currentSemester?.semester_number
  );

  const handleUpdateCourse = (courseIndex: number, updatedCourse: Course) => {
    const nextSemesters = semesters.map((sem) => {
      if (sem.semester_number === currentSemester.semester_number) {
        const nextCourses = [...sem.courses];
        nextCourses[courseIndex] = updatedCourse;
        return { ...sem, courses: nextCourses };
      }
      return sem;
    });
    onChangeSemesters(nextSemesters);
  };

  const handleDeleteCourse = (courseIndex: number) => {
    const nextSemesters = semesters.map((sem) => {
      if (sem.semester_number === currentSemester.semester_number) {
        return {
          ...sem,
          courses: sem.courses.filter((_, idx) => idx !== courseIndex),
        };
      }
      return sem;
    });
    onChangeSemesters(nextSemesters);
  };

  const handleAddCourse = () => {
    const nextSemesters = semesters.map((sem) => {
      if (sem.semester_number === currentSemester.semester_number) {
        const newCourse: Course = {
          course_id: `C${sem.courses.length + 1}`,
          course_name: '',
          letter_grade: 'A' as LetterGrade,
          credit_hours: 3.0,
        };
        return { ...sem, courses: [...sem.courses, newCourse] };
      }
      return sem;
    });
    onChangeSemesters(nextSemesters);
  };

  const handleAddPreset = (template: { name: string; defaultCredits: number; defaultGrade: LetterGrade }) => {
    const nextSemesters = semesters.map((sem) => {
      if (sem.semester_number === currentSemester.semester_number) {
        const newCourse: Course = {
          course_id: `C${sem.courses.length + 1}`,
          course_name: template.name,
          letter_grade: template.defaultGrade,
          credit_hours: template.defaultCredits,
        };
        return { ...sem, courses: [...sem.courses, newCourse] };
      }
      return sem;
    });
    onChangeSemesters(nextSemesters);
  };

  const handleAddNewSemester = () => {
    const nextNum = semesters.length + 1;
    if (nextNum > 12) return;
    const newSem: Semester = {
      semester_number: nextNum,
      courses: [
        {
          course_id: 'C1',
          course_name: '',
          letter_grade: 'A',
          credit_hours: 3.0,
        },
      ],
    };
    onChangeSemesters([...semesters, newSem]);
    setActiveTab(nextNum);
  };

  const handleDeleteCurrentSemester = () => {
    if (semesters.length <= 1) return;
    const filtered = semesters.filter((s) => s.semester_number !== currentSemester.semester_number);
    // Renumber semesters cleanly
    const reindexed = filtered.map((s, idx) => ({
      ...s,
      semester_number: idx + 1,
    }));
    onChangeSemesters(reindexed);
    setActiveTab(Math.min(activeTab, reindexed.length));
  };

  const hasInvalidCourseHours = currentSemester?.courses.some(
    (c) => isNaN(c.credit_hours) || c.credit_hours < 1 || c.credit_hours > 10
  );

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 sm:p-7 shadow-lg shadow-black/40 backdrop-blur-md">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800/80 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-teal-400" />
            <h2 className="text-lg font-bold text-slate-100">Semester & Course Management</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure courses with their required letter grades and independent credit hours.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddNewSemester}
            disabled={semesters.length >= 12}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 disabled:opacity-40 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Semester</span>
          </button>
        </div>
      </div>

      {/* Semester Selector Tabs */}
      <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
        {semesters.map((sem) => {
          const semRes = calculatedSemesters?.find((s) => s.semester_number === sem.semester_number);
          const isActive = sem.semester_number === activeTab;
          return (
            <button
              key={sem.semester_number}
              onClick={() => setActiveTab(sem.semester_number)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all border ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-950/40'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Semester {sem.semester_number}</span>
              {semRes && (
                <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700/80 text-emerald-400">
                  {semRes.gpa.toFixed(2)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Semester Overview Banner */}
      {currentSemester && (
        <div className="mt-5 p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-slate-100 text-base">
                Semester {currentSemester.semester_number}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                {currentSemester.courses.length} Course{currentSemester.courses.length !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              All credit hours and grades are sent directly to C++ Crow backend for computation.
            </p>
          </div>

          {/* C++ Computed Semester Metrics */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
              <span className="block text-[10px] uppercase font-mono text-slate-500">Total Credits</span>
              <span className="text-sm font-mono font-bold text-cyan-300">
                {currentCalcResult ? `${currentCalcResult.total_credits} hrs` : '—'}
              </span>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
              <span className="block text-[10px] uppercase font-mono text-slate-500">Weighted Pts</span>
              <span className="text-sm font-mono font-bold text-teal-300">
                {currentCalcResult ? currentCalcResult.total_weighted_points.toFixed(1) : '—'}
              </span>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center">
              <span className="block text-[10px] uppercase font-mono text-emerald-400">Semester GPA</span>
              <span className="text-sm sm:text-base font-mono font-extrabold text-emerald-300">
                {currentCalcResult ? currentCalcResult.gpa.toFixed(2) : '—'}
              </span>
            </div>

            {semesters.length > 1 && (
              <button
                type="button"
                onClick={handleDeleteCurrentSemester}
                className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 border border-slate-800 transition-colors"
                title={`Delete Semester ${currentSemester.semester_number}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Validation warning if course hours are missing */}
      {hasInvalidCourseHours && (
        <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>
            <strong>Attention:</strong> Every course must have valid Course Hours / Credit Hours
            between 1 and 10. Empty or invalid hours will block accurate C++ GPA calculation.
          </span>
        </div>
      )}

      {/* Courses List */}
      <div className="mt-6 space-y-3.5">
        {currentSemester?.courses.map((course, idx) => {
          const calcCourse = currentCalcResult?.courses[idx];
          return (
            <CourseRow
              key={course.course_id || idx}
              course={course}
              index={idx}
              calculatedResult={calcCourse}
              onChange={(updated) => handleUpdateCourse(idx, updated)}
              onDelete={() => handleDeleteCourse(idx)}
            />
          );
        })}

        {currentSemester?.courses.length === 0 && (
          <div className="p-8 text-center rounded-xl bg-slate-950/50 border border-dashed border-slate-800">
            <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400 font-medium">No courses in Semester {currentSemester.semester_number}</p>
            <p className="text-xs text-slate-600 mt-1">Add courses to calculate semester GPA</p>
          </div>
        )}
      </div>

      {/* Add Course & Quick Presets */}
      <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddCourse}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/50 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Course</span>
          </button>

          {/* Quick CS Template dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Insert Common Course</span>
            </button>
            <div className="hidden group-hover:block absolute left-0 bottom-full mb-1.5 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-20">
              <p className="text-[10px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                Select Course to Add:
              </p>
              {COURSE_TEMPLATES.map((tpl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAddPreset(tpl)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-emerald-300 flex items-center justify-between transition-colors"
                >
                  <span className="truncate">{tpl.name}</span>
                  <span className="text-[10px] font-mono text-slate-500 ml-2">
                    {tpl.defaultCredits}h
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recalculate button trigger */}
        <button
          type="button"
          onClick={onRecalculate}
          disabled={isCalculating}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors disabled:opacity-50"
        >
          <span>Calculate Semester with C++</span>
        </button>
      </div>
    </div>
  );
};
