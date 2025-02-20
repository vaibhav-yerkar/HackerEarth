export interface Student {
  id: string;
  name: string;
  grade: string;
  attendance: number;
  performance: {
    academic: number;
    nonAcademic: number;
  };
  Remark: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "assessment" | "event";
  importance: "low" | "medium" | "high";
}

export interface User {
  id: string;
  role: "parent" | "teacher";
  name: string;
  email: string;
}

export interface StudentProfile {
  name: string;
  dob: string;
  class_id: string;
  class_teacher: string;
  guardian_name: string;
  guardian_mob: string;
  guardian_mail: string;
  student_gender: string;
  student_id: string;
  Remark: string | null;
}

export interface StudentScore {
  date: string;
  testType: string;
  Math: number | null;
  Science: number | null;
  English: number | null;
  History: number | null;
}

export interface StudentScoreResponse {
  Scores: StudentScore[];
}

export interface ScoreEntry {
  student_id: string;
  subject: string;
  marks: number;
  test_date: string;
  test_type: string;
}

export interface ScoreResponse {
  Scores: ScoreEntry[];
}

export interface FormattedScoreData {
  date: string;
  testType: string;
  Math: number | null;
  Science: number | null;
  English: number | null;
  History: number | null;
}

export interface AttendanceEntry {
  attendance_id: string;
  student_id: string;
  attendance_date: string;
  attendance_remarks: "P" | "A";
}

export interface AttendanceResponse {
  Attendance: AttendanceEntry[];
}

export interface AttendanceSummary {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  presentRate: number;
}
