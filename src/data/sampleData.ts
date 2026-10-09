import { Semester, StudentProfile } from '../types/academic';

export const SAMPLE_STUDENT: StudentProfile = {
  student_name: 'Alexandria Mercer',
  student_id: 'CS-2024-4091',
  completed_semesters: 3,
};

export const SAMPLE_SEMESTERS: Semester[] = [
  {
    semester_number: 1,
    courses: [
      {
        course_id: 'CS101',
        course_name: 'Data Structures & Algorithms',
        letter_grade: 'A',
        credit_hours: 4,
      },
      {
        course_id: 'MATH101',
        course_name: 'Calculus I & Analytical Geometry',
        letter_grade: 'A-',
        credit_hours: 4,
      },
      {
        course_id: 'PHY101',
        course_name: 'Engineering Physics & Electromagnetism',
        letter_grade: 'B+',
        credit_hours: 3,
      },
      {
        course_id: 'ENG101',
        course_name: 'Technical Writing & Academic Communication',
        letter_grade: 'A',
        credit_hours: 2,
      },
    ],
  },
  {
    semester_number: 2,
    courses: [
      {
        course_id: 'CS201',
        course_name: 'Object-Oriented Programming (C++)',
        letter_grade: 'A',
        credit_hours: 4,
      },
      {
        course_id: 'CS202',
        course_name: 'Computer Organization & Architecture',
        letter_grade: 'B',
        credit_hours: 3,
      },
      {
        course_id: 'MATH201',
        course_name: 'Discrete Mathematics & Graph Theory',
        letter_grade: 'A-',
        credit_hours: 3,
      },
      {
        course_id: 'ENV101',
        course_name: 'Environmental Science & Sustainability',
        letter_grade: 'B+',
        credit_hours: 2,
      },
    ],
  },
  {
    semester_number: 3,
    courses: [
      {
        course_id: 'CS301',
        course_name: 'Operating Systems & Kernel Architecture',
        letter_grade: 'A',
        credit_hours: 4,
      },
      {
        course_id: 'CS302',
        course_name: 'Database Management Systems & SQL',
        letter_grade: 'B+',
        credit_hours: 3,
      },
      {
        course_id: 'CS303',
        course_name: 'Design & Analysis of Algorithms',
        letter_grade: 'A-',
        credit_hours: 4,
      },
      {
        course_id: 'STAT301',
        course_name: 'Probability & Engineering Statistics',
        letter_grade: 'C+',
        credit_hours: 3,
      },
    ],
  },
];

export const COURSE_TEMPLATES = [
  { name: 'Computer Networks & Protocols', defaultCredits: 3, defaultGrade: 'A-' as const },
  { name: 'Software Engineering Principles', defaultCredits: 3, defaultGrade: 'B+' as const },
  { name: 'Artificial Intelligence & Heuristics', defaultCredits: 4, defaultGrade: 'A' as const },
  { name: 'Distributed Systems & Cloud Computing', defaultCredits: 4, defaultGrade: 'A' as const },
  { name: 'Cybersecurity & Cryptography', defaultCredits: 3, defaultGrade: 'B' as const },
  { name: 'Compiler Design & Formal Languages', defaultCredits: 4, defaultGrade: 'B+' as const },
];
