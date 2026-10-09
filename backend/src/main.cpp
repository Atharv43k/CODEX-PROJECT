#include "crow_all.h"
#include "../include/AcademicEngine.h"
#include <nlohmann/json.hpp>
#include <iostream>
#include <string>

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
    int port = 8080;
    if (argc > 1) {
        try {
            port = std::stoi(argv[1]);
        } catch (...) {
            port = 8080;
        }
    }

    crow::SimpleApp app;
    AcademicTracker::AcademicEngine engine;

    std::cout << "======================================================" << std::endl;
    std::cout << " METAMORPHOSIS ACADEMIC PERFORMANCE TRACKER (C++ REST)" << std::endl;
    std::cout << " Backend Engine Powered by Crow & Modern C++17" << std::endl;
    std::cout << " Listening on http://0.0.0.0:" << port << std::endl;
    std::cout << "======================================================" << std::endl;

    // CORS Middleware / Helper
    auto setCors = [](crow::response& res) {
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.add_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    };

    // Health check endpoint
    CROW_ROUTE(app, "/api/health")
    .methods("GET"_method, "OPTIONS"_method)
    ([&setCors](const crow::request& req) {
        crow::response res;
        setCors(res);
        if (req.method == "OPTIONS"_method) {
            res.code = 204;
            return res;
        }

        json h;
        h["status"] = "UP";
        h["engine"] = "Metamorphosis Academic C++ Crow REST Engine";
        h["version"] = "2.4.0";
        h["architecture"] = "C++17 / Crow / nlohmann_json";
        h["timestamp"] = AcademicTracker::AcademicEngine::getCurrentTimestampIso();
        
        res.code = 200;
        res.set_header("Content-Type", "application/json");
        res.body = h.dump();
        return res;
    });

    // Core Calculation endpoint
    CROW_ROUTE(app, "/api/calculate")
    .methods("POST"_method, "OPTIONS"_method)
    ([&engine, &setCors](const crow::request& req) {
        crow::response res;
        setCors(res);
        if (req.method == "OPTIONS"_method) {
            res.code = 204;
            return res;
        }

        try {
            auto body_json = json::parse(req.body);
            auto calculation_req = parseRequest(body_json);
            auto calculation_res = engine.calculateAcademicPerformance(calculation_req);
            auto output_json = serializeResponse(calculation_res);

            res.code = 200;
            res.set_header("Content-Type", "application/json");
            res.body = output_json.dump(2);
        } catch (const std::exception& e) {
            json err;
            err["success"] = false;
            err["error"] = "Invalid JSON or Calculation Request: " + std::string(e.what());
            res.code = 400;
            res.set_header("Content-Type", "application/json");
            res.body = err.dump();
        }

        return res;
    });

    // Future CGPA Target Simulator endpoint (calculated in C++)
    CROW_ROUTE(app, "/api/simulate")
    .methods("POST"_method, "OPTIONS"_method)
    ([&engine, &setCors](const crow::request& req) {
        crow::response res;
        setCors(res);
        if (req.method == "OPTIONS"_method) {
            res.code = 204;
            return res;
        }

        try {
            auto j = json::parse(req.body);
            double current_cgpa = j.value("current_cgpa", 3.0);
            double current_credits = j.value("current_credits", 30.0);
            double target_cgpa = j.value("target_cgpa", 3.5);
            double future_credits = j.value("future_credits", 15.0);

            double current_pts = current_cgpa * current_credits;
            double total_credits_future = current_credits + future_credits;
            double required_total_pts = target_cgpa * total_credits_future;
            double required_future_pts = required_total_pts - current_pts;
            double required_gpa = future_credits > 0 ? (required_future_pts / future_credits) : 0.0;

            bool is_achievable = (required_gpa <= 4.00 && required_gpa >= 0.0);

            json sim_res;
            sim_res["success"] = true;
            sim_res["current_cgpa"] = current_cgpa;
            sim_res["current_credits"] = current_credits;
            sim_res["target_cgpa"] = target_cgpa;
            sim_res["future_credits"] = future_credits;
            sim_res["required_gpa"] = std::round(required_gpa * 100.0) / 100.0;
            sim_res["is_achievable"] = is_achievable;
            
            if (required_gpa > 4.00) {
                sim_res["advice"] = "Target CGPA cannot be achieved in " + std::to_string(static_cast<int>(future_credits)) + " credit hours because it requires a GPA above 4.00. Consider taking more credit hours to distribute the points.";
            } else if (required_gpa < 2.00) {
                sim_res["advice"] = "Target is easily within reach. Maintaining a standard passing performance will suffice.";
            } else {
                sim_res["advice"] = "Achievable! You need an average grade of around " + std::to_string(std::round(required_gpa * 10.0) / 10.0) + " GPA across your next " + std::to_string(static_cast<int>(future_credits)) + " credits.";
            }

            res.code = 200;
            res.set_header("Content-Type", "application/json");
            res.body = sim_res.dump(2);
        } catch (const std::exception& e) {
            json err;
            err["success"] = false;
            err["error"] = e.what();
            res.code = 400;
            res.set_header("Content-Type", "application/json");
            res.body = err.dump();
        }

        return res;
    });

    app.port(port).multithreaded().run();
    return 0;
}
