#ifndef MODELS_H
#define MODELS_H

#include <string>
#include <vector>

namespace AcademicTracker {

struct CourseInput {
    std::string course_id;
    std::string course_name;
    std::string letter_grade;
    double credit_hours; // Validated 1 to 10
};

struct CourseResult {
    std::string course_id;
    std::string course_name;
    std::string letter_grade;
    double credit_hours;
    double grade_point;      // e.g., 4.0, 3.7
    double weighted_points;  // grade_point * credit_hours
    bool is_passing;
};

struct SemesterInput {
    int semester_number;
    std::vector<CourseInput> courses;
};

struct SemesterResult {
    int semester_number;
    int total_courses;
    double total_credits;
    double total_weighted_points;
    double gpa; // Semester GPA
    std::vector<CourseResult> courses;
};

struct StudentProfile {
    std::string student_name;
    std::string student_id;
    int completed_semesters;
};

struct CalculationRequest {
    StudentProfile student;
    std::vector<SemesterInput> semesters;
};

struct CalculationResponse {
    bool success;
    std::string message;
    StudentProfile student;
    int total_semesters;
    int total_courses_all;
    double total_credits_all;
    double total_weighted_points_all;
    double cgpa; // Cumulative Grade Point Average
    std::string classification;
    CourseResult top_course;
    CourseResult focus_course;
    std::vector<SemesterResult> semesters;
    std::string engine_version;
    std::string calculation_timestamp;
    double computation_time_ms;
};

} // namespace AcademicTracker

#endif // MODELS_H
