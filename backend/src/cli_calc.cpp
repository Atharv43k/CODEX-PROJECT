#include "../include/AcademicEngine.h"
#include <nlohmann/json.hpp>
#include <iostream>
#include <string>
#include <sstream>

using json = nlohmann::json;
using namespace AcademicTracker;

AcademicTracker::CalculationRequest parseRequest(const json& j) {
    AcademicTracker::CalculationRequest req;

    if (j.contains("student")) {
        const auto& s = j["student"];
        req.student.student_name = s.value("student_name", "Unknown Student");
        req.student.student_id = s.value("student_id", "STU-0000");
        req.student.completed_semesters = s.value("completed_semesters", 1);
    }

    if (j.contains("semesters") && j["semesters"].is_array()) {
        for (const auto& sem_item : j["semesters"]) {
            AcademicTracker::SemesterInput sem;
            sem.semester_number = sem_item.value("semester_number", 1);

            if (sem_item.contains("courses") && sem_item["courses"].is_array()) {
                for (const auto& c_item : sem_item["courses"]) {
                    AcademicTracker::CourseInput c;
                    c.course_id = c_item.value("course_id", "");
                    c.course_name = c_item.value("course_name", "");
                    c.letter_grade = c_item.value("letter_grade", "A");
                    
                    if (c_item.contains("credit_hours")) {
                        if (c_item["credit_hours"].is_number()) {
                            c.credit_hours = c_item["credit_hours"].get<double>();
                        } else if (c_item["credit_hours"].is_string()) {
                            try {
                                c.credit_hours = std::stod(c_item["credit_hours"].get<std::string>());
                            } catch (...) {
                                c.credit_hours = 3.0;
                            }
                        } else {
                            c.credit_hours = 3.0;
                        }
                    } else {
                        c.credit_hours = 3.0;
                    }

                    sem.courses.push_back(c);
                }
            }
            req.semesters.push_back(sem);
        }
    }

    return req;
}

json serializeResponse(const AcademicTracker::CalculationResponse& res) {
    json j;
    j["success"] = res.success;
    j["message"] = res.message;
    j["engine_version"] = res.engine_version;
    j["calculation_timestamp"] = res.calculation_timestamp;
    j["computation_time_ms"] = res.computation_time_ms;

    j["student"] = {
        {"student_name", res.student.student_name},
        {"student_id", res.student.student_id},
        {"completed_semesters", res.student.completed_semesters}
    };

    j["total_semesters"] = res.total_semesters;
    j["total_courses_all"] = res.total_courses_all;
    j["total_credits_all"] = res.total_credits_all;
    j["total_weighted_points_all"] = res.total_weighted_points_all;
    j["cgpa"] = res.cgpa;
    j["classification"] = res.classification;

    j["top_course"] = {
        {"course_id", res.top_course.course_id},
        {"course_name", res.top_course.course_name},
        {"letter_grade", res.top_course.letter_grade},
        {"credit_hours", res.top_course.credit_hours},
        {"grade_point", res.top_course.grade_point},
        {"weighted_points", res.top_course.weighted_points},
        {"is_passing", res.top_course.is_passing}
    };

    j["focus_course"] = {
        {"course_id", res.focus_course.course_id},
        {"course_name", res.focus_course.course_name},
        {"letter_grade", res.focus_course.letter_grade},
        {"credit_hours", res.focus_course.credit_hours},
        {"grade_point", res.focus_course.grade_point},
        {"weighted_points", res.focus_course.weighted_points},
        {"is_passing", res.focus_course.is_passing}
    };

    json sems = json::array();
    for (const auto& sem : res.semesters) {
        json s;
        s["semester_number"] = sem.semester_number;
        s["total_courses"] = sem.total_courses;
        s["total_credits"] = sem.total_credits;
        s["total_weighted_points"] = sem.total_weighted_points;
        s["gpa"] = sem.gpa;

        json courses = json::array();
        for (const auto& c : sem.courses) {
            courses.push_back({
                {"course_id", c.course_id},
                {"course_name", c.course_name},
                {"letter_grade", c.letter_grade},
                {"credit_hours", c.credit_hours},
                {"grade_point", c.grade_point},
                {"weighted_points", c.weighted_points},
                {"is_passing", c.is_passing}
            });
        }
        s["courses"] = courses;
        sems.push_back(s);
    }
    j["semesters"] = sems;

    return j;
}

int main(int argc, char* argv[]) {
    try {
        std::string input_str;
        if (argc > 1) {
            input_str = argv[1];
        } else {
            std::stringstream buffer;
            buffer << std::cin.rdbuf();
            input_str = buffer.str();
        }

        if (input_str.empty()) {
            json err;
            err["success"] = false;
            err["error"] = "Empty input payload provided to C++ CLI calculator.";
            std::cout << err.dump() << std::endl;
            return 1;
        }

        json j = json::parse(input_str);
        AcademicEngine engine;
        auto req = parseRequest(j);
        auto res = engine.calculateAcademicPerformance(req);
        json out = serializeResponse(res);

        std::cout << out.dump(2) << std::endl;
        return 0;
    } catch (const std::exception& e) {
        json err;
        err["success"] = false;
        err["error"] = e.what();
        std::cout << err.dump() << std::endl;
        return 1;
    }
}
