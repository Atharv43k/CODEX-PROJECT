# Student Academic Performance Tracker

A C++-powered academic performance tracking system with a modern web interface built using React and TypeScript. The application allows students to manage semesters and courses, calculate Semester GPA and Overall CGPA, and analyze academic performance through a professional dashboard featuring the **Metamorphosis UI theme**.

## Overview

The Student Academic Performance Tracker simplifies academic grade management by allowing students to enter their course grades and individual course hours (credit hours). The C++ backend processes the academic data and returns accurate results through a REST API.

The system follows an Object-Oriented Programming (OOP) architecture using three core C++ classes: `Course`, `Semester`, and `Student`.

## Features

- **Student Information Management:** Enter student name and student ID.
- **Semester Management:** Manage between 1 and 12 semesters.
- **Course Management:** Add, edit, and remove courses within each semester.
- **Course Hours / Credit Hours:** Assign individual credit hours to every course.
- **Grade Selection:** Support for O, A+, A, B+, B, C, D, and F.
- **Grade Point Calculation:** Convert course grades into grade points using the specified grading scale.
- **Weighted Grade Points:** Calculate grade points multiplied by course hours.
- **Semester GPA:** Calculate GPA for each semester.
- **Overall CGPA:** Calculate cumulative academic performance across all semesters.
- **Performance Classification:** Categorize academic performance based on CGPA.
- **Top Course Identification:** Identify the course with the highest grade point.
- **Focus Course Identification:** Identify the course with the lowest grade point.
- **REST API Integration:** Connect the React frontend to the C++ backend using JSON.
- **Input Validation:** Validate grades, course hours, semester counts, and course counts.
- **Responsive Dashboard:** Present academic results in a clean, modern interface.
- **Metamorphosis Theme:** Maintain a professional, modern, and slightly futuristic UI design.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React |
| Programming Language | TypeScript |
| UI Styling | CSS |
| Backend | C++ |
| HTTP Framework | Crow |
| JSON Processing | nlohmann/json |
| Build System | CMake |
| API Architecture | REST API |
| Data Exchange | JSON |
| Version Control | Git and GitHub |

## System Architecture

The application separates the user interface from the academic calculation logic.

```text
Student
   |
   v
React + TypeScript Frontend
   |
   v
REST API Request (JSON)
   |
   v
C++ Backend using Crow
   |
   v
Course / Semester / Student
   |
   v
Academic Calculations
   |
   v
JSON Response
   |
   v
Metamorphosis Dashboard
```

**Important:** All academic calculations are performed by the C++ backend. The frontend collects input and displays the results returned by the API.

## Grading System

The application uses the following grade-to-grade-point mapping:

| Grade | Grade Point |
|---|---:|
| O | 10 |
| A+ | 9 |
| A | 8 |
| B+ | 7 |
| B | 6 |
| C | 5 |
| D | 4 |
| F | 0 |

## Academic Calculation Formulas

### 1. Weighted Grade Points

Weighted Grade Points = Course Hours × Grade Point

Example:

- Grade: A+
- Course Hours: 4
- Grade Point: 9
- Weighted Grade Points: 4 × 9 = 36

### 2. Semester GPA

Semester GPA = Total Weighted Grade Points in the Semester ÷ Total Course Hours in the Semester

### 3. Overall CGPA

Overall CGPA = Total Weighted Grade Points Across All Semesters ÷ Total Course Hours Across All Semesters

The overall CGPA is calculated using total weighted grade points and total course hours, not by taking a simple average of semester GPAs.

### 4. Academic Performance Classification

| CGPA Range | Performance |
|---|---|
| 9.00 and above | Outstanding |
| 8.00 to below 9.00 | Excellent |
| 7.00 to below 8.00 | Very Good |
| 6.00 to below 7.00 | Good |
| 5.00 to below 6.00 | Satisfactory |
| Below 5.00 | Needs Improvement |

## C++ Object-Oriented Design

### Course Class

Represents an individual academic course.

Responsibilities:
- Store the course name.
- Store the assigned grade.
- Store course hours / credit hours.
- Calculate the grade point.
- Calculate weighted grade points.

### Semester Class

Represents a semester containing multiple courses.

Responsibilities:
- Store the semester number.
- Maintain a collection of courses.
- Calculate total course hours.
- Calculate total weighted grade points.
- Calculate semester GPA.

### Student Class

Represents a student and their academic history.

Responsibilities:
- Store student name and student ID.
- Maintain multiple semesters.
- Calculate total course hours.
- Calculate total weighted grade points.
- Calculate overall CGPA.
- Determine academic performance.
- Identify the Top Course and Focus Course.

## Input Limits

| Input | Allowed Values |
|---|---|
| Number of semesters | 1–12 |
| Courses per semester | 1–15 |
| Course hours / credit hours | 1–10 |
| Supported grades | O, A+, A, B+, B, C, D, F |

The application does not currently accept marks or convert marks into grades. Students select their existing course grades directly.

## REST API

The C++ backend exposes the following endpoint.

**Endpoint:** `POST /api/calculate`

**Local URL:** `http://localhost:18080/api/calculate`

### Example Request

```json
{
  "name": "Rahul Sharma",
  "studentId": "CS101",
  "semesters": [
    {
      "semesterNumber": 1,
      "courses": [
        {
          "name": "Data Structures",
          "grade": "A+",
          "credits": 4
        },
        {
          "name": "Mathematics",
          "grade": "O",
          "credits": 3
        }
      ]
    }
  ]
}
```

The `credits` field represents Course Hours / Credit Hours.

### Expected Results for the Example

- Total courses: 2
- Total course hours: 7
- Total weighted grade points: 66
- Semester GPA: 9.43
- Overall CGPA: 9.43
- Performance: Outstanding
- Top Course: Mathematics
- Focus Course: Data Structures

These values are expected for the example input when processed using the specified grading rules.

## Project Structure

```text
student-academic-performance-tracker/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   └── .env.example
│
├── backend/
│   ├── main.cpp
│   ├── Course.h
│   ├── Course.cpp
│   ├── Semester.h
│   ├── Semester.cpp
│   ├── Student.h
│   ├── Student.cpp
│   ├── CMakeLists.txt
│   └── README.md
│
├── .gitignore
└── README.md
```

The actual filenames may vary depending on the implementation.

## Installation and Setup
