import React, { useState } from 'react';
import { CalculationResponse } from '../types/academic';
import {
  Table,
  Download,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Layers,
  Award,
} from 'lucide-react';

interface Props {
  results: CalculationResponse | null;
}

export const DetailedCourseTable: React.FC<Props> = ({ results }) => {
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!results || !results.semesters || results.semesters.length === 0) {
    return (
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-8 text-center text-slate-400">
        <Table className="w-10 h-10 text-slate-600 mx-auto mb-2" />
        <p className="text-sm font-medium">No calculated semester records to display yet.</p>
        <p className="text-xs text-slate-500 mt-1">Configure courses and trigger C++ calculation.</p>
      </div>
    );
  }

  const exportCsv = () => {
    let csv = 'Semester,Course ID,Course Name,Grade,Grade Point,Credit Hours,Weighted Points,Status\n';
    results.semesters.forEach((sem) => {
      sem.courses.forEach((c) => {
        csv += `${sem.semester_number},"${c.course_id}","${c.course_name.replace(/"/g, '""')}","${c.letter_grade}",${c.grade_point},${c.credit_hours},${c.weighted_points},"${c.is_passing ? 'Passed' : 'Failed'}"\n`;
      });
      csv += `Semester ${sem.semester_number} Summary,,,Subtotal,,${sem.total_credits},${sem.total_weighted_points},GPA: ${sem.gpa}\n`;
    });
    csv += `Cumulative CGPA Summary,,,,Grand Total,${results.total_credits_all},${results.total_weighted_points_all},CGPA: ${results.cgpa}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `academic_record_${results.student.student_id || 'student'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSemesters = results.semesters.filter((sem) => {
    if (selectedSemesterFilter === 'all') return true;
    return sem.semester_number === parseInt(selectedSemesterFilter, 10);
  });

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 shadow-lg shadow-black/40 backdrop-blur-md overflow-hidden">
      {/* Header and Controls */}
      <div className="p-5 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-100">Detailed Academic Audit Table</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete breakdown of course grade points, mandatory credit hours, and C++ weighted points.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Semester Filter */}
          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedSemesterFilter}
              onChange={(e) => setSelectedSemesterFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-slate-100">
                All Semesters ({results.semesters.length})
              </option>
              {results.semesters.map((s) => (
                <option
                  key={s.semester_number}
                  value={s.semester_number}
                  className="bg-slate-900 text-slate-100"
                >
                  Semester {s.semester_number} (GPA {s.gpa.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {/* Export to CSV Button */}
          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Course Tables by Semester */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-950/90 text-slate-400 border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Sem</th>
              <th className="py-3 px-4">Course Code / Name</th>
              <th className="py-3 px-4 text-center">Grade</th>
              <th className="py-3 px-4 text-right">Grade Point</th>
              <th className="py-3 px-4 text-right">Credit Hours</th>
              <th className="py-3 px-4 text-right">Weighted Pts</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredSemesters.map((sem) => (
              <React.Fragment key={sem.semester_number}>
                {sem.courses.map((course, cIdx) => (
                  <tr
                    key={course.course_id || cIdx}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-slate-400 text-xs">
                      S{sem.semester_number}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-200">{course.course_name}</div>
                      <div className="text-[10px] font-mono text-slate-500">
                        {course.course_id || `C-${cIdx + 1}`}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-bold">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 font-mono text-xs">
                        {course.letter_grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-300">
                      {course.grade_point.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-cyan-400">
                      {course.credit_hours.toFixed(1)} hrs
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                      {course.weighted_points.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          course.is_passing
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {course.is_passing ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                  </tr>
                ))}

                {/* Semester Subtotal Summary Row */}
                <tr className="bg-slate-950/60 font-semibold border-b border-t border-slate-800/90 text-xs">
                  <td colSpan={2} className="py-2.5 px-4 text-slate-300">
                    <span className="text-emerald-400 font-bold">Semester {sem.semester_number} Subtotal</span>
                    <span className="text-slate-500 ml-2 font-mono">({sem.total_courses} courses)</span>
                  </td>
                  <td className="py-2.5 px-4 text-center font-mono text-slate-400">—</td>
                  <td className="py-2.5 px-4 text-right font-mono text-slate-400">—</td>
                  <td className="py-2.5 px-4 text-right font-mono text-cyan-300 font-bold">
                    {sem.total_credits.toFixed(1)} hrs
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-emerald-300 font-bold">
                    {sem.total_weighted_points.toFixed(2)} pts
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs border border-emerald-500/30">
                      GPA: {sem.gpa.toFixed(2)}
                    </span>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>

          {/* Grand Cumulative Footer Row */}
          <tfoot>
            <tr className="bg-slate-950 text-slate-100 font-extrabold border-t-2 border-emerald-500/40 text-xs sm:text-sm">
              <td colSpan={2} className="py-4 px-4 text-white">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>OVERALL CUMULATIVE SUMMARY (ALL SEMESTERS)</span>
                </div>
              </td>
              <td className="py-4 px-4 text-center font-mono text-slate-400">—</td>
              <td className="py-4 px-4 text-right font-mono text-slate-400">—</td>
              <td className="py-4 px-4 text-right font-mono text-cyan-300">
                {results.total_credits_all.toFixed(1)} hrs
              </td>
              <td className="py-4 px-4 text-right font-mono text-emerald-300">
                {results.total_weighted_points_all.toFixed(2)} pts
              </td>
              <td className="py-4 px-4 text-center">
                <div className="inline-block px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-extrabold text-sm">
                  CGPA: {results.cgpa.toFixed(2)}
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
