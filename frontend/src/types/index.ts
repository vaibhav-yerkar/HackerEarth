export interface Student {
  id: string;
  name: string;
  grade: string;
  attendance: number;
  performance: {
    academic: number;
    nonAcademic: number;
  };
  remarks: Remark[];
}

export interface Remark {
  id: string;
  teacherId: string;
  content: string;
  date: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'assessment' | 'event';
  importance: 'low' | 'medium' | 'high';
}

export interface User {
  id: string;
  role: 'parent' | 'teacher' | 'admin';
  name: string;
  email: string;
}