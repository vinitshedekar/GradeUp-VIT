export interface Profile {
  id: string;
  name: string;
  department: string | null;
  registration_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface Semester {
  id: string;
  user_id: string;
  semester_number: number;
  academic_year: string;
  gpa: number;
  total_credits: number;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  semester_id: string;
  course_code: string;
  course_name: string;
  credits: number;
  grade_points: number;
  grade: string;
  created_at: string;
  updated_at: string;
}

export const GRADES = {
  'S': 10,
  'A': 9,
  'B': 8,
  'C': 7,
  'D': 6,
  'E': 5,
  'F': 0,
} as const;

export type Grade = keyof typeof GRADES;