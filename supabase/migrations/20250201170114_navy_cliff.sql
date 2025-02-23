/*
  # Initial Schema for VIT GPA Calculator

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `department` (text)
      - `registration_number` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `semesters`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `semester_number` (integer)
      - `academic_year` (text)
      - `gpa` (numeric)
      - `total_credits` (numeric)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `courses`
      - `id` (uuid, primary key)
      - `semester_id` (uuid, references semesters)
      - `course_code` (text)
      - `course_name` (text)
      - `credits` (numeric)
      - `grade_points` (numeric)
      - `grade` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  department text,
  registration_number text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create semesters table
CREATE TABLE semesters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  semester_number integer NOT NULL,
  academic_year text NOT NULL,
  gpa numeric(3,2) DEFAULT 0.00,
  total_credits numeric(5,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, semester_number)
);

-- Create courses table
CREATE TABLE courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  semester_id uuid REFERENCES semesters ON DELETE CASCADE NOT NULL,
  course_code text NOT NULL,
  course_name text NOT NULL,
  credits numeric(3,1) NOT NULL,
  grade_points numeric(3,1) NOT NULL,
  grade text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view own semesters"
  ON semesters FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own semesters"
  ON semesters FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own semesters"
  ON semesters FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own semesters"
  ON semesters FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own courses"
  ON courses FOR SELECT
  TO authenticated
  USING (semester_id IN (
    SELECT id FROM semesters WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own courses"
  ON courses FOR INSERT
  TO authenticated
  WITH CHECK (semester_id IN (
    SELECT id FROM semesters WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update own courses"
  ON courses FOR UPDATE
  TO authenticated
  USING (semester_id IN (
    SELECT id FROM semesters WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own courses"
  ON courses FOR DELETE
  TO authenticated
  USING (semester_id IN (
    SELECT id FROM semesters WHERE user_id = auth.uid()
  ));

-- Create function to update semester GPA
CREATE OR REPLACE FUNCTION update_semester_gpa()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE semesters
  SET 
    gpa = (
      SELECT COALESCE(SUM(grade_points * credits) / NULLIF(SUM(credits), 0), 0)
      FROM courses
      WHERE semester_id = NEW.semester_id
    ),
    total_credits = (
      SELECT COALESCE(SUM(credits), 0)
      FROM courses
      WHERE semester_id = NEW.semester_id
    ),
    updated_at = now()
  WHERE id = NEW.semester_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update GPA
CREATE TRIGGER update_gpa_on_course_change
  AFTER INSERT OR UPDATE OR DELETE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_semester_gpa();