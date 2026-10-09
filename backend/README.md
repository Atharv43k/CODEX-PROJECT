# Student Academic Performance Tracker — C++ REST Backend

A high-performance C++ backend engine for the **Student Academic Performance Tracker** using modern **C++17**, **Crow** HTTP micro-framework, and **nlohmann/json**.

This backend serves as the **single source of truth** for all academic grading, weighted point computations, semester GPAs, cumulative CGPA calculations, and performance classification.

---

## Architecture Overview

- **Language:** C++17
- **HTTP Framework:** Crow (Modern C++ microframework inspired by Flask/Sinatra)
- **JSON Serialization:** nlohmann/json
- **Build System:** CMake >= 3.15
- **Communication Protocol:** REST API over HTTP (JSON payload)
- **Dual Execution Capabilities:**
  1. **Crow REST API Server Daemon** (`tracker_server` on port `8080`)
  2. **High-Performance CLI Engine** (`academic_calculator` via stdin/args)

---

## macOS Prerequisites & Installation

On macOS, install dependencies using [Homebrew](https://brew.sh):

```bash
# 1. Install CMake and build tools
brew install cmake make

# 2. Install Boost & Asio (required by Crow)
brew install boost asio

# 3. (Optional) Install nlohmann-json if not using local headers
brew install nlohmann-json
```

---

## Building on macOS

Run the automated macOS build script:

```bash
chmod +x backend/build_macos.sh
./backend/build_macos.sh
```

Or build manually with CMake:

```bash
cd backend
mkdir -p build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
make -j$(sysctl -n hw.ncpu)
```

This compiles two binaries in `backend/build/`:
- `tracker_server` (Crow REST Daemon)
- `academic_calculator` (CLI tool)

---

## Running the C++ Server on macOS

To run the REST server on port 8080 (or custom port):

```bash
./backend/run_macos.sh 8080
```

Or directly:

```bash
./backend/build/tracker_server 8080
```

---

## REST API Endpoints

### 1. Health Check
`GET http://localhost:8080/api/health`

**Sample Response:**
```json
{
  "status": "UP",
  "engine": "Metamorphosis Academic C++ Crow REST Engine",
  "version": "2.4.0",
  "architecture": "C++17 / Crow / nlohmann_json",
  "timestamp": "2026-10-09T05:07:41Z"
}
```

### 2. Calculate Academic Performance
`POST http://localhost:8080/api/calculate`

**Sample Request Body:**
```json
{
  "student": {
    "student_name": "Siddhant Santosh",
    "student_id": "STU-2024-88",
    "completed_semesters": 2
  },
  "semesters": [
    {
      "semester_number": 1,
      "courses": [
        {
          "course_id": "CS101",
          "course_name": "Introduction to Computer Science",
          "letter_grade": "A",
          "credit_hours": 4.0
        },
        {
          "course_id": "MATH101",
          "course_name": "Calculus & Linear Algebra",
          "letter_grade": "B+",
          "credit_hours": 4.0
        }
      ]
    }
  ]
}
```

**Sample Response Body:**
```json
{
  "success": true,
  "message": "Academic performance computed successfully by C++ engine.",
  "cgpa": 3.65,
  "classification": "Dean's List / High Academic Honors",
  "total_semesters": 1,
  "total_courses_all": 2,
  "total_credits_all": 8.0,
  "total_weighted_points_all": 29.2,
  "computation_time_ms": 0.12,
  "top_course": {
    "course_id": "CS101",
    "course_name": "Introduction to Computer Science",
    "letter_grade": "A",
    "credit_hours": 4.0,
    "grade_point": 4.0,
    "weighted_points": 16.0,
    "is_passing": true
  },
  "focus_course": {
    "course_id": "MATH101",
    "course_name": "Calculus & Linear Algebra",
    "letter_grade": "B+",
    "credit_hours": 4.0,
    "grade_point": 3.3,
    "weighted_points": 13.2,
    "is_passing": true
  },
  "semesters": [
    {
      "semester_number": 1,
      "total_courses": 2,
      "total_credits": 8.0,
      "total_weighted_points": 29.2,
      "gpa": 3.65,
      "courses": [ ... ]
    }
  ]
}
```

### 3. CGPA Target Simulator
`POST http://localhost:8080/api/simulate`

Simulates the required future GPA to reach a target CGPA given completed credits.

---

## Grading Scale Standard (4.00 Max)

| Letter Grade | Grade Point |
|---|---|
| A+ / A | 4.00 |
| A- | 3.70 |
| B+ | 3.30 |
| B | 3.00 |
| B- | 2.70 |
| C+ | 2.30 |
| C | 2.00 |
| C- | 1.70 |
| D+ | 1.30 |
| D | 1.00 |
| F | 0.00 |

### Mathematical Formulas Enforced in C++:
$$\text{Weighted Points} = \text{Grade Point} \times \text{Credit Hours}$$
$$\text{Semester GPA} = \frac{\sum (\text{Grade Point} \times \text{Credit Hours})}{\sum \text{Credit Hours}}$$
$$\text{Overall CGPA} = \frac{\sum_{\text{all semesters}} \text{Weighted Points}}{\sum_{\text{all semesters}} \text{Credit Hours}}$$
