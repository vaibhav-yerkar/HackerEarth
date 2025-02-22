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

## Frontend Overview

The frontend of the Parental Engagement System is built using React, TypeScript, and Vite. The application provides an interactive user interface that supports both parent and teacher roles with a range of functionalities.

### Key Features

- **User Authentication:**  
  A dedicated [Login page](frontend/src/pages/Login.tsx) manages parent and teacher sign-ins by validating credentials and setting the user context using the [useAppStore](frontend/src/store/index) state.

- **Dashboard and Navigation:**  
  The application offers distinct dashboards:

  - **Student Dashboard:**  
    Allows parents to view attendance, performance, and remarks ([StudentDashboard](frontend/src/pages/StudentDashboard.tsx)).
  - **Admin Panel:**  
    Enables teachers to manage students, grades, and events ([AdminPanel](frontend/src/pages/AdminPanel.tsx)).

  Navigation is handled through a responsive sidebar implemented in [Navigation](frontend/src/components/Navigation.tsx), which provides quick access to key routes.

- **Calendar & Events:**  
  The [Calendar page](frontend/src/pages/Calendar.tsx) displays events and includes audio playback for audio notes. Events are fetched using dedicated API calls from [ApiService](frontend/src/services/api.ts) and cached for offline support. Users can also add events via a modal ([AddEventModal](frontend/src/components/modals/AddEventModal.tsx)).

- **Audio Notes for Announcements:**  
  Audio announcements are generated based on event details or teacher remarks. The application communicates with the backend endpoint `/generate_audio` ([backend/app.py](backend/app.py)) and manages caching via the [AudioCache](frontend/src/services/audioCache.ts) service.

- **Real-Time Updates and Offline Support:**  
  The frontend listens for cache events and handles API errors gracefully by falling back to cached data, ensuring that parents always have access to the latest available student information.

- **Email Integration:**  
  Announcements and event notifications are also integrated using EmailJS. The script is loaded on-demand in the [AddEventModal](frontend/src/components/modals/AddEventModal.tsx) to initialize email functionalities.

### Project Structure

The key directories and files are as follows:

- **Root Configuration:**

  - [index.html](frontend/index.html) – The HTML template that loads the React application.
  - [vite.config.ts](frontend/vite.config.ts) – Vite configuration for building and optimizing the application.
  - [tailwind.config.js](frontend/tailwind.config.js) – Tailwind CSS configuration for styling.

- **Source Code (src):**

  - **Pages:**

    - [Home](frontend/src/pages/Home.tsx) – Landing page with key metrics and navigation.
    - [Login](frontend/src/pages/Login.tsx) – Manages user authentication.
    - [StudentDashboard](frontend/src/pages/StudentDashboard.tsx) – Displays student details, attendance, performance charts, and audio notes.
    - [Calendar](frontend/src/pages/Calendar.tsx) – Allows viewing and interacting with school events.
    - [AdminPanel](frontend/src/pages/AdminPanel.tsx) – Teacher’s interface to manage students, scores, and events.
    - [Attendance](frontend/src/pages/Attendance.tsx) – Provides functionality to view and manage attendance records.

  - **Components:**

    - [Navigation](frontend/src/components/Navigation.tsx) – Application header and routing navigation.
    - [ChatBot](frontend/src/components/ChatBot.tsx) – Chatbot to assist with parent queries.
    - [OfflineIndicator](frontend/src/components/OfflineIndicator.tsx) – Displays when the app is running in offline mode.
    - **Modals:**
      - [AddEventModal](frontend/src/components/modals/AddEventModal.tsx) – For scheduling new events.
      - [AddStudentModal](frontend/src/components/modals/AddStudentModal.tsx) – For adding new student records.

  - **Services:**

    - [ApiService](frontend/src/services/api.ts) – Handles REST API calls, request caching, and offline fallback.
    - [AudioCache](frontend/src/services/audioCache.ts) – Manages caching of audio notes to improve performance.

  - **Store:**
    - [useAppStore](frontend/src/store/index.ts) – Global state management (likely using Zustand) for user sessions, language settings, and offline status.

- **Types and Environment:**
  - [vite-env.d.ts](frontend/src/vite-env.d.ts) – Provides typing for environmental variables such as `VITE_SUPABASE_URL`, `VITE_API_BASE_URL`, etc.
  - Type definitions in [types.ts](frontend/src/types.ts) ensure consistency across the project.

### Setup and Running the Frontend

1. **Installation:**  
   Ensure you have Node.js installed. Then, install dependencies:
   ```sh
   npm install
   ```
2. **Environment Variables:**  
   Create a `.env` file in the frontend folder with the required variables :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_KEY`
   - `VITE_EMAILJS_KEY`
   - `VITE_API_BASE_URL`
3. **Development Server:**
   Start the development server with:
   ```sh
   npm run dev
   ```
4. **Building for Production:**
   Build the application for production deployment:
   ```sh
   npm run build
   ```

### Conclusion

## The frontend is designed to interact seamlessly with the backend API (see backend/app.py), ensuring that both parents and teachers have an intuitive and responsive experience. This modular structure along with real-time updates and offline support makes it robust and scalable for future enhancements.

**Developed with a focus on keeping parents informed and connected with their child’s education.**

**This documentation can be updated further as new features are added.**
