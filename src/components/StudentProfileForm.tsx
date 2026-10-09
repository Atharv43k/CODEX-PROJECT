import React, { useState } from 'react';
import {
  User,
  Hash,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Plus,
  Minus,
  Sparkles,
  Save,
} from 'lucide-react';
import { StudentProfile } from '../types/academic';

interface Props {
  profile: StudentProfile;
  onChangeProfile: (updated: StudentProfile) => void;
  onUpdateSemesterCount: (count: number) => void;
  totalSemesters: number;
}

export const StudentProfileForm: React.FC<Props> = ({
  profile,
  onChangeProfile,
  onUpdateSemesterCount,
  totalSemesters,
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [saveFeedback, setSaveFeedback] = useState(false);

  const validateField = (field: keyof StudentProfile, value: any): string => {
    if (field === 'student_name') {
      if (!value || typeof value !== 'string' || value.trim().length === 0) {
        return 'Student Name is required.';
      }
      if (value.trim().length < 2) {
        return 'Student Name must be at least 2 characters.';
      }
    }
    if (field === 'student_id') {
      if (!value || typeof value !== 'string' || value.trim().length === 0) {
        return 'Student ID is required.';
      }
      if (value.trim().length < 3) {
        return 'Student ID must be at least 3 characters.';
      }
    }
    if (field === 'completed_semesters') {
      const num = Number(value);
      if (isNaN(num) || num < 1 || num > 12) {
        return 'Completed semesters must be an integer between 1 and 12.';
      }
    }
    return '';
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChangeProfile({ ...profile, student_name: val });
    const err = validateField('student_name', val);
    setErrors((prev) => ({ ...prev, student_name: err }));
  };

  const handleChangeId = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChangeProfile({ ...profile, student_id: val });
    const err = validateField('student_id', val);
    setErrors((prev) => ({ ...prev, student_id: err }));
  };

  const handleSemesterCountChange = (newCount: number) => {
    if (newCount < 1 || newCount > 12) return;
    onChangeProfile({ ...profile, completed_semesters: newCount });
    onUpdateSemesterCount(newCount);
    setErrors((prev) => ({ ...prev, completed_semesters: '' }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const nameErr = validateField('student_name', profile.student_name);
    const idErr = validateField('student_id', profile.student_id);
    const semErr = validateField('completed_semesters', profile.completed_semesters);

    if (nameErr || idErr || semErr) {
      setErrors({
        student_name: nameErr,
        student_id: idErr,
        completed_semesters: semErr,
      });
      return;
    }

    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2500);
  };

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 sm:p-7 shadow-lg shadow-black/40 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800/80 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-100">Student Profile & Academic Configuration</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Specify student identification and total completed academic semesters (1–12).
          </p>
        </div>

        {saveFeedback && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs animate-fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Profile Validated</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="mt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Student Name */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Student Full Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={profile.student_name}
                onChange={handleChangeName}
                placeholder="e.g. Siddhant Santosh"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors ${
                  errors.student_name
                    ? 'border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-800 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30'
                }`}
              />
            </div>
            {errors.student_name ? (
              <p className="flex items-center gap-1 text-xs text-rose-400 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.student_name}</span>
              </p>
            ) : (
              <p className="text-[11px] text-slate-500">Official name as listed in university records.</p>
            )}
          </div>

          {/* Student ID */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Student ID / Roll No <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Hash className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={profile.student_id}
                onChange={handleChangeId}
                placeholder="e.g. CS-2024-8890"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border text-sm text-slate-100 placeholder-slate-500 font-mono focus:outline-none transition-colors ${
                  errors.student_id
                    ? 'border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-800 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30'
                }`}
              />
            </div>
            {errors.student_id ? (
              <p className="flex items-center gap-1 text-xs text-rose-400 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.student_id}</span>
              </p>
            ) : (
              <p className="text-[11px] text-slate-500">Unique student registration or matriculation ID.</p>
            )}
          </div>

          {/* Completed Semesters (1 to 12) */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Completed Semesters (1–12) <span className="text-rose-400">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={profile.completed_semesters}
                  onChange={(e) => handleSemesterCountChange(parseInt(e.target.value, 10) || 1)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border text-sm text-slate-100 font-mono focus:outline-none transition-colors ${
                    errors.completed_semesters
                      ? 'border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-800 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30'
                  }`}
                />
              </div>

              {/* Quick Stepper Buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleSemesterCountChange(profile.completed_semesters - 1)}
                  disabled={profile.completed_semesters <= 1}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 transition-colors"
                  title="Decrease Semester Count"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleSemesterCountChange(profile.completed_semesters + 1)}
                  disabled={profile.completed_semesters >= 12}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 transition-colors"
                  title="Increase Semester Count"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {errors.completed_semesters ? (
              <p className="flex items-center gap-1 text-xs text-rose-400 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.completed_semesters}</span>
              </p>
            ) : (
              <p className="text-[11px] text-slate-500">
                Allocates {totalSemesters} editable semester tabs below.
              </p>
            )}
          </div>
        </div>

        {/* Validation / Summary bar */}
        <div className="pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>
              Configured: <strong className="text-slate-200">{profile.student_name || 'Student'}</strong> &bull;{' '}
              <span className="font-mono text-emerald-400">{totalSemesters}</span> active semesters
            </span>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 hover:border-slate-600 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile Information</span>
          </button>
        </div>
      </form>
    </div>
  );
};
