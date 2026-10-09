import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StudentProfile,
  Semester,
  CalculationResponse,
  ApiHealthResponse,
  CalculationRequest,
} from './types/academic';
import { SAMPLE_STUDENT, SAMPLE_SEMESTERS } from './data/sampleData';
import { calculateAcademicPerformance, checkBackendHealth } from './services/api';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { StudentProfileForm } from './components/StudentProfileForm';
import { SemesterManager } from './components/SemesterManager';
import { AcademicSummaryCards } from './components/AcademicSummaryCards';
import { TopAndFocusCourses } from './components/TopAndFocusCourses';
import { DetailedCourseTable } from './components/DetailedCourseTable';
import { CppEngineInspector } from './components/CppEngineInspector';
import { CgpaSimulator } from './components/CgpaSimulator';
import { MacOsSetupGuideModal } from './components/MacOsSetupGuideModal';
import {
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
} from 'lucide-react';

export default function App() {
  const [student, setStudent] = useState<StudentProfile>(SAMPLE_STUDENT);
  const [semesters, setSemesters] = useState<Semester[]>(SAMPLE_SEMESTERS);
  const [results, setResults] = useState<CalculationResponse | null>(null);
  const [lastRequest, setLastRequest] = useState<CalculationRequest | null>(null);
  const [health, setHealth] = useState<ApiHealthResponse | null>(null);
  const [healthLoading, setHealthLoading] = useState<boolean>(true);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [latencyMs, setLatencyMs] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [isMacGuideOpen, setIsMacGuideOpen] = useState<boolean>(false);

  // Check health periodically
  const fetchHealth = useCallback(async () => {
    try {
      setHealthLoading(true);
      const h = await checkBackendHealth();
      setHealth(h);
    } catch {
      // Backend starting up
    } finally {
      setHealthLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  // Core trigger for C++ Calculation
  const runCalculation = useCallback(
    async (silent = false) => {
      // Basic validation
      if (!student.student_name.trim()) {
        if (!silent) setErrorMessage('Please enter a valid Student Name.');
        return;
      }
      if (!student.student_id.trim()) {
        if (!silent) setErrorMessage('Please enter a valid Student ID.');
        return;
      }

      // Validate courses and hours
      let hasHoursError = false;
      semesters.forEach((sem) => {
        sem.courses.forEach((c) => {
          if (isNaN(c.credit_hours) || c.credit_hours < 1 || c.credit_hours > 10) {
            hasHoursError = true;
          }
        });
      });

      if (hasHoursError) {
        if (!silent) {
          setErrorMessage(
            'Course Hours / Credit Hours must be a valid number between 1 and 10 for every course.'
          );
        }
        return;
      }

      setIsCalculating(true);
      setErrorMessage(null);

      const requestPayload: CalculationRequest = {
        student,
        semesters,
      };
      setLastRequest(requestPayload);

      try {
        const { data, latencyMs: measuredLatency } = await calculateAcademicPerformance(
          requestPayload
        );
        setResults(data);
        setLatencyMs(measuredLatency);
        if (!silent) {
          setSuccessBanner(`Academic performance computed by C++ in ${data.computation_time_ms ? data.computation_time_ms.toFixed(2) + ' ms' : '<1ms'}!`);
          setTimeout(() => setSuccessBanner(null), 3500);
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'C++ calculation request failed.');
      } finally {
        setIsCalculating(false);
      }
    },
    [student, semesters]
  );

  // Initial calculation on mount
  const initialCalculated = useRef(false);
  useEffect(() => {
    if (!initialCalculated.current) {
      initialCalculated.current = true;
      runCalculation(true);
    }
  }, [runCalculation]);

  // Adjust semesters when count changes in profile
  const handleUpdateSemesterCount = (targetCount: number) => {
    if (targetCount < 1 || targetCount > 12) return;
    setSemesters((prev) => {
      const currentCount = prev.length;
      if (targetCount === currentCount) return prev;
      if (targetCount > currentCount) {
        const additions: Semester[] = [];
        for (let i = currentCount + 1; i <= targetCount; i++) {
          additions.push({
            semester_number: i,
            courses: [
              {
                course_id: 'C1',
                course_name: '',
                letter_grade: 'A',
                credit_hours: 3.0,
              },
            ],
          });
        }
        return [...prev, additions].flat();
      } else {
        return prev.slice(0, targetCount);
      }
    });
  };

  // Reset all data to empty slate
  const handleReset = () => {
    if (window.confirm('Reset all courses and start with a fresh academic record?')) {
      const emptyStudent: StudentProfile = {
        student_name: '',
        student_id: '',
        completed_semesters: 1,
      };
      const emptySemesters: Semester[] = [
        {
          semester_number: 1,
          courses: [
            {
              course_id: 'C1',
              course_name: 'Introduction to Programming',
              letter_grade: 'A',
              credit_hours: 3,
            },
          ],
        },
      ];
      setStudent(emptyStudent);
      setSemesters(emptySemesters);
      setResults(null);
      setErrorMessage(null);
      setSuccessBanner('Form reset to initial state.');
      setTimeout(() => setSuccessBanner(null), 3000);
    }
  };

  // Load sample record
  const handleLoadSample = () => {
    setStudent(SAMPLE_STUDENT);
    setSemesters(SAMPLE_SEMESTERS);
    setSuccessBanner('Loaded sample 3-semester academic records.');
    setTimeout(() => {
      setSuccessBanner(null);
      runCalculation(true);
    }, 200);
  };

  const totalCourses = semesters.reduce((acc, sem) => acc + sem.courses.length, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navigation */}
      <Navbar
        health={health}
        healthLoading={healthLoading}
        student={student}
        cgpa={results?.cgpa}
        isCalculating={isCalculating}
        onRecalculate={() => runCalculation(false)}
        onLoadSample={handleLoadSample}
        onReset={handleReset}
        onOpenMacGuide={() => setIsMacGuideOpen(true)}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          totalCourses={totalCourses}
          totalSemesters={semesters.length}
          cgpa={results?.cgpa}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Notification Banners */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start justify-between gap-3 shadow-lg shadow-rose-950/20">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-rose-200">Validation or C++ Engine Error</p>
                  <p className="text-xs text-rose-300/90 mt-0.5">{errorMessage}</p>
                </div>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-rose-400 hover:text-white text-xs font-mono"
              >
                Dismiss
              </button>
            </div>
          )}

          {successBanner && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-lg shadow-emerald-950/20 animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successBanner}</span>
              </div>
            </div>
          )}

          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <AcademicSummaryCards results={results} latencyMs={latencyMs} />

              {/* Top Course & Focus Course */}
              {results && (
                <TopAndFocusCourses
                  topCourse={results.top_course}
                  focusCourse={results.focus_course}
                />
              )}

              {/* Quick Jump to Semester & Course Management */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Manage Your Semesters & Course Credits</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Currently tracking {semesters.length} semesters with {totalCourses} courses.
                    Edit grades and mandatory credit hours in real time.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('courses')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Open Course Manager</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Detailed Course Audit Table Preview */}
              <DetailedCourseTable results={results} />
            </div>
          )}

          {/* TAB 2: STUDENT INFORMATION */}
          {activeTab === 'student' && (
            <div className="space-y-6">
              <StudentProfileForm
                profile={student}
                onChangeProfile={setStudent}
                onUpdateSemesterCount={handleUpdateSemesterCount}
                totalSemesters={semesters.length}
              />

              {/* Quick Navigation to Courses */}
              <div className="flex justify-end">
                <button
                  onClick={() => setActiveTab('courses')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-colors flex items-center gap-2"
                >
                  <span>Proceed to Course & Hours Manager</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: COURSE & HOURS MANAGER */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <SemesterManager
                semesters={semesters}
                calculatedSemesters={results?.semesters}
                onChangeSemesters={setSemesters}
                onRecalculate={() => runCalculation(false)}
                isCalculating={isCalculating}
              />
            </div>
          )}

          {/* TAB 4: DETAILED COURSE AUDIT TABLE */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <DetailedCourseTable results={results} />
            </div>
          )}

          {/* TAB 5: TARGET CGPA SIMULATOR */}
          {activeTab === 'simulator' && (
            <div className="space-y-6">
              <CgpaSimulator
                currentCgpa={results?.cgpa || 3.0}
                currentCredits={results?.total_credits_all || 30.0}
              />
            </div>
          )}

          {/* TAB 6: C++ REST ENGINE INSPECTOR */}
          {activeTab === 'inspector' && (
            <div className="space-y-6">
              <CppEngineInspector
                lastRequest={lastRequest}
                lastResponse={results}
                health={health}
              />
            </div>
          )}
        </main>
      </div>

      {/* macOS Setup & Run Guide Modal */}
      <MacOsSetupGuideModal
        isOpen={isMacGuideOpen}
        onClose={() => setIsMacGuideOpen(false)}
      />
    </div>
  );
}
