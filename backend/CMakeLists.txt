cmake_minimum_required(VERSION 3.15)
project(StudentAcademicPerformanceTracker LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# Optimization and warnings
if(MSVC)
    add_compile_options(/W4 /O2)
else()
    add_compile_options(-Wall -Wextra -O3 -pthread)
endif()

# Include directories
include_directories(
    ${CMAKE_CURRENT_SOURCE_DIR}/include
    ${CMAKE_CURRENT_SOURCE_DIR}/include/nlohmann
)

# Boost requirement for Crow
find_package(Boost REQUIRED COMPONENTS system thread)
if(Boost_FOUND)
    include_directories(${Boost_INCLUDE_DIRS})
endif()

# Threads
find_package(Threads REQUIRED)

# Core Library: AcademicEngine
add_library(academic_engine
    src/AcademicEngine.cpp
)
target_include_directories(academic_engine PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/include)

# Executable 1: Crow REST API Server
add_executable(tracker_server
    src/main.cpp
)
target_link_libraries(tracker_server PRIVATE
    academic_engine
    Threads::Threads
    ${Boost_LIBRARIES}
)

# Executable 2: Standalone C++ Engine CLI
add_executable(academic_calculator
    src/cli_calc.cpp
)
target_link_libraries(academic_calculator PRIVATE
    academic_engine
)

message(STATUS "Configured Student Academic Performance Tracker C++ Backend")
message(STATUS "  - REST Server target: tracker_server")
message(STATUS "  - CLI Tool target:    academic_calculator")
