# Parental Engagement System

## Overview

The Parental Engagement System is designed to keep parents informed and engaged with their child's academic and extracurricular activities within the school. It includes features for maintaining records of students, grades, attendance, and events, along with interactive functionalities such as a chatbot and audio notes.

## Features

### Chatbot for Parent Queries
- Provides instant answers to parents' questions.
- Interacts with the database to fetch required details such as student grades, attendance records, and event information.

### Audio Notes for Announcements
- Converts teacher announcements into multiple languages.
- Allows parents and students to listen to announcements in their preferred language.

### Real-Time Updates
- Parents receive notifications for important events, attendance updates, and academic progress.

## Database Schema

The database consists of four primary tables:

### 1. Students Table (`students`)
**Purpose:** Stores personal and academic details of students.

**Fields:**
- `student_id` (Primary Key): Unique identifier for each student.
- `name`: Full name of the student.
- `dob`: Date of birth.
- `class_id`: Class the student belongs to.
- `class_teacher`: Name of the class teacher.
- `guardian_name`: Name of the guardian.
- `guardian_mob`: Guardian's mobile number.
- `guardian_mail`: Guardian's email.
- `student_gender`: Gender of the student.
- `remark`: Additional remarks about the student.

### 2. Grade Table (`grade`)
**Purpose:** Stores student grades and test-related data.

**Fields:**
- `grade_id` (Primary Key): Unique identifier for each grade entry.
- `student_id` (Foreign Key): References the `students` table.
- `subject`: Subject name.
- `marks`: Marks obtained in the test.
- `test_date`: Date of the test.
- `test_type`: Type of test (e.g., quiz, mid-term, final exam).

### 3. Attendance Table (`attendance`)
**Purpose:** Stores attendance records of students.

**Fields:**
- `attendance_id` (Primary Key): Unique identifier for each attendance entry.
- `student_id` (Foreign Key): References the `students` table.
- `attendance_date`: Date of attendance.
- `attendance_remarks`: Remarks regarding attendance (e.g., present, absent, late).

### 4. Events Table (`events`)
**Purpose:** Stores details about school events.

**Fields:**
- `id` (Primary Key): Unique identifier for each event.
- `title`: Title of the event.
- `event_desc`: Description of the event.
- `date`: Date of the event.
- `time`: Time of the event.

## Relationships
- The `students` table is the central entity, referenced by both the `grades` and `attendance` tables through `student_id`.
- The `grades` table records test results for students.
- The `attendance` table tracks student attendance over time.
- The `events` table logs all school-related activities and important events.

## Usage
This database can be used in a parental engagement system to:
- Keep parents updated on their child’s academic performance through grades.
- Provide real-time attendance updates.
- Notify parents of upcoming events and activities.
- Maintain personal and guardian information for effective communication.

## Future Enhancements
- Implement a `teacher` table to track faculty members.
- Introduce a `class_schedule` table to organize daily lectures.
- Add automated notifications for attendance, grades, and events.
- Develop a mobile application for parents to access updates easily.

## Scalability
This database structure ensures efficient data organization, easy retrieval, and adaptability for future enhancements. It serves as a robust foundation for a comprehensive parental engagement system.

---
**Developed with a focus on keeping parents informed and connected with their child’s education.**

