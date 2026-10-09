#ifndef ACADEMIC_ENGINE_H
#define ACADEMIC_ENGINE_H

#include "Models.h"
#include <string>

namespace AcademicTracker {

class AcademicEngine {
public:
    AcademicEngine();

    // Core Calculation API (Single Source of Truth)
    CalculationResponse calculateAcademicPerformance(const CalculationRequest& request);

    // Letter Grade to Grade Point Mapping (Standard 4.0 Scale)
    static double gradeToPoint(const std::string& letterGrade);

    // Classification determination based on CGPA
    static std::string classifyPerformance(double cgpa);

    // Validation helpers
    static bool validateCreditHours(double hours);
    static bool validateGrade(const std::string& grade);
    static bool validateSemesterCount(int semesters);

    // Formatter
    static std::string getCurrentTimestampIso();
};

} // namespace AcademicTracker

#endif // ACADEMIC_ENGINE_H
