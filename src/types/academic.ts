export type LetterGrade =
  | 'A+'
  | 'A'
  | 'A-'
  | 'B+'
  | 'B'
  | 'B-'
  | 'C+'
  | 'C'
  | 'C-'
  | 'D+'
  | 'D'
  | 'F';

export interface Course {
  course_id: string;
  course_name: string;
  letter_grade: LetterGrade;
  credit_hours: number; // Mandatory, 1 to 10
}

export interface CourseResult {
  course_id: string;
  course_name: string;
  letter_grade: LetterGrade;
  credit_hours: number;
  grade_point: number;
  weighted_points: number;
  is_passing: boolean;
}

export interface Semester {
  semester_number: number;
  courses: Course[];
}

export interface SemesterResult {
  semester_number: number;
  total_courses: number;
  total_credits: number;
  total_weighted_points: number;
  gpa: number;
  courses: CourseResult[];
}

export interface StudentProfile {
  student_name: string;
  student_id: string;
  completed_semesters: number; // 1 to 12
}

export interface CalculationRequest {
  student: StudentProfile;
  semesters: Semester[];
}

export interface CalculationResponse {
  success: boolean;
  message: string;
  student: StudentProfile;
  total_semesters: number;
  total_courses_all: number;
  total_credits_all: number;
  total_weighted_points_all: number;
  cgpa: number;
  classification: string;
  top_course: CourseResult;
  focus_course: CourseResult;
  semesters: SemesterResult[];
  engine_version: string;
  calculation_timestamp: string;
  computation_time_ms: number;
  _engine_transport?: string;
  error?: string;
}

export interface ApiHealthResponse {
  status: string;
  app: string;
  cpp_crow_server: {
    active: boolean;
    port: number;
    endpoint: string;
  };
  cpp_native_cli: {
    available: boolean;
    path: string;
  };
  single_source_of_truth: string;
  timestamp: string;
}

export interface SimulationResult {
  success: boolean;
  current_cgpa: number;
  current_credits: number;
  target_cgpa: number;
  future_credits: number;
  required_gpa: number;
  is_achievable: boolean;
  advice: string;
  _engine_transport?: string;
}
