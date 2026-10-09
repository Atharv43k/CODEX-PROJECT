#include "../include/AcademicEngine.h"
#include <chrono>
#include <cmath>
#include <algorithm>
#include <sstream>
#include <iomanip>

namespace AcademicTracker {

AcademicEngine::AcademicEngine() {}

double AcademicEngine::gradeToPoint(const std::string& letterGrade) {
    std::string g = letterGrade;
    // Normalize string: uppercase and trim
    std::transform(g.begin(), g.end(), g.begin(), ::toupper);
    g.erase(0, g.find_first_not_of(" \t\r\n"));
    g.erase(g.find_last_not_of(" \t\r\n") + 1);

    if (g == "A+" || g == "A") return 4.00;
    if (g == "A-") return 3.70;
    if (g == "B+") return 3.30;
    if (g == "B")  return 3.00;
    if (g == "B-") return 2.70;
    if (g == "C+") return 2.30;
    if (g == "C")  return 2.00;
    if (g == "C-") return 1.70;
    if (g == "D+") return 1.30;
    if (g == "D")  return 1.00;
    if (g == "F")  return 0.00;

    return 0.00;
}

std::string AcademicEngine::classifyPerformance(double cgpa) {
    if (cgpa >= 3.80) {
        return "First Class with Distinction (High Honors)";
    } else if (cgpa >= 3.50) {
        return "Dean's List / High Academic Honors";
    } else if (cgpa >= 3.00) {
        return "First Class / Academic Honors";
    } else if (cgpa >= 2.50) {
        return "Second Class Upper / Good Standing";
    } else if (cgpa >= 2.00) {
        return "Second Class Lower / Satisfactory";
    } else {
        return "Academic Probation / Action Required";
    }
}

bool AcademicEngine::validateCreditHours(double hours) {
    return (hours >= 1.0 && hours <= 10.0);
}

bool AcademicEngine::validateGrade(const std::string& grade) {
    std::string g = grade;
    std::transform(g.begin(), g.end(), g.begin(), ::toupper);
    return (g == "A+" || g == "A" || g == "A-" ||
            g == "B+" || g == "B" || g == "B-" ||
            g == "C+" || g == "C" || g == "C-" ||
            g == "D+" || g == "D" || g == "F");
}

bool AcademicEngine::validateSemesterCount(int semesters) {
    return (semesters >= 1 && semesters <= 12);
}

std::string AcademicEngine::getCurrentTimestampIso() {
    auto now = std::chrono::system_clock::now();
    std::time_t t = std::chrono::system_clock::to_time_t(now);
    std::tm tm_buf;
#if defined(_WIN32)
    gmtime_s(&tm_buf, &t);
#else
    gmtime_r(&t, &tm_buf);
#endif
    char buf[64];
    std::strftime(buf, sizeof(buf), "%Y-%m-%dT%H:%M:%SZ", &tm_buf);
    return std::string(buf);
}

CalculationResponse AcademicEngine::calculateAcademicPerformance(const CalculationRequest& request) {
    auto start_time = std::chrono::high_resolution_clock::now();

    CalculationResponse response;
    response.success = true;
    response.message = "Academic performance computed successfully by C++ engine.";
    response.student = request.student;
    response.engine_version = "Metamorphosis C++ AcademicEngine v2.4 (Crow/REST)";
    response.calculation_timestamp = getCurrentTimestampIso();

    double total_credits_all = 0.0;
    double total_weighted_points_all = 0.0;
    int total_courses_all = 0;

    CourseResult best_course;
    CourseResult worst_course;
    bool has_any_course = false;
    double highest_course_score = -1.0;
    double lowest_course_score = 999.0;

    for (const auto& sem_input : request.semesters) {
        SemesterResult sem_res;
        sem_res.semester_number = sem_input.semester_number;
        sem_res.total_courses = 0;
        sem_res.total_credits = 0.0;
        sem_res.total_weighted_points = 0.0;
        sem_res.gpa = 0.0;

        for (const auto& course_in : sem_input.courses) {
            // Validate credit hours (1 - 10)
            double hours = course_in.credit_hours;
            if (hours < 1.0) hours = 1.0;
            if (hours > 10.0) hours = 10.0;

            double pt = gradeToPoint(course_in.letter_grade);
            double weighted = pt * hours;

            CourseResult cr;
            cr.course_id = course_in.course_id.empty() ? ("C" + std::to_string(sem_res.total_courses + 1)) : course_in.course_id;
            cr.course_name = course_in.course_name.empty() ? "Untitled Course" : course_in.course_name;
            cr.letter_grade = course_in.letter_grade;
            cr.credit_hours = hours;
            cr.grade_point = pt;
            cr.weighted_points = std::round(weighted * 1000.0) / 1000.0;
            cr.is_passing = (pt > 0.0);

            sem_res.courses.push_back(cr);
            sem_res.total_courses++;
            sem_res.total_credits += hours;
            sem_res.total_weighted_points += cr.weighted_points;

            // Track top and focus course
            // Top course: highest grade_point, tied breaker highest credit_hours
            double score_metric = pt * 100.0 + hours;
            if (!has_any_course || score_metric > highest_course_score) {
                highest_course_score = score_metric;
                best_course = cr;
            }

            // Focus course: lowest grade_point, tied breaker highest credit_hours (greater impact)
            double worst_metric = pt * 100.0 - hours;
            if (!has_any_course || worst_metric < lowest_course_score) {
                lowest_course_score = worst_metric;
                worst_course = cr;
            }

            has_any_course = true;
        }

        // Semester GPA
        if (sem_res.total_credits > 0.0) {
            sem_res.gpa = std::round((sem_res.total_weighted_points / sem_res.total_credits) * 100.0) / 100.0;
        } else {
            sem_res.gpa = 0.0;
        }

        total_courses_all += sem_res.total_courses;
        total_credits_all += sem_res.total_credits;
        total_weighted_points_all += sem_res.total_weighted_points;

        response.semesters.push_back(sem_res);
    }

    response.total_semesters = static_cast<int>(request.semesters.size());
    response.total_courses_all = total_courses_all;
    response.total_credits_all = std::round(total_credits_all * 100.0) / 100.0;
    response.total_weighted_points_all = std::round(total_weighted_points_all * 1000.0) / 1000.0;

    // Cumulative CGPA
    if (total_credits_all > 0.0) {
        response.cgpa = std::round((total_weighted_points_all / total_credits_all) * 100.0) / 100.0;
    } else {
        response.cgpa = 0.0;
    }

    response.classification = classifyPerformance(response.cgpa);

    if (has_any_course) {
        response.top_course = best_course;
        response.focus_course = worst_course;
    } else {
        response.top_course = {"", "None", "N/A", 0.0, 0.0, 0.0, false};
        response.focus_course = {"", "None", "N/A", 0.0, 0.0, 0.0, false};
    }

    auto end_time = std::chrono::high_resolution_clock::now();
    std::chrono::duration<double, std::milli> elapsed = end_time - start_time;
    response.computation_time_ms = elapsed.count();

    return response;
}

} // namespace AcademicTracker
