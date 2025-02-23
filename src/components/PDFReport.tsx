import { jsPDF } from 'jspdf';
import type { Semester, Course } from '../types/database';

interface GenerateReportProps {
  semesters: (Semester & { courses: Course[] })[];
  studentName: string;
  department: string;
  registrationNumber: string;
}

export function generatePDFReport({
  semesters,
  studentName,
  department,
  registrationNumber,
}: GenerateReportProps) {
  const doc = new jsPDF();
  let yPos = 20;
  const lineHeight = 7;

  // Helper function to add text
  const addText = (text: string, size = 12, isBold = false) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.text(text, 20, yPos);
    yPos += lineHeight;
  };

  // Title
  addText('Academic Performance Report', 20, true);
  yPos += 10;

  // Student Information
  addText(`Student: ${studentName}`, 14);
  addText(`Department: ${department}`, 12);
  addText(`ID: ${registrationNumber}`, 12);
  yPos += 10;

  // CGPA Calculation
  const totalCredits = semesters.reduce((acc, sem) => acc + sem.total_credits, 0);
  const weightedGPA = semesters.reduce((acc, sem) => acc + (sem.gpa * sem.total_credits), 0);
  const cgpa = (weightedGPA / totalCredits).toFixed(2);
  addText(`Cumulative GPA: ${cgpa}`, 14, true);
  yPos += 15;

  // Semester Summary
  addText('Semester Overview:', 14, true);
  semesters.forEach((semester) => {
    addText(`Semester ${semester.semester_number}: GPA ${semester.gpa.toFixed(2)} (Credits: ${semester.total_credits})`, 12);
  });
  yPos += 10;

  // Performance Analysis
  addText('Performance Insights:', 14, true);
  const cgpaNum = parseFloat(cgpa);

  if (cgpaNum >= 9.0) {
    addText('Consistent Excellence:', 12, true);
    addText('- Maintain depth in core subjects through advanced projects', 12);
    addText('- Explore interdisciplinary research opportunities', 12);
    addText('- Lead peer learning initiatives', 12);
  }
  else if (cgpaNum >= 8.0) {
    addText('Strong Foundation:', 12, true);
    addText('- Focus on practical implementation of theoretical knowledge', 12);
    addText('- Develop technical communication skills through presentations', 12);
    addText('- Participate in industry-relevant workshops', 12);
  }
  else if (cgpaNum >= 7.0) {
    addText('Growth Potential:', 12, true);
    addText('- Identify patterns in academic strengths/weaknesses', 12);
    addText('- Implement spaced repetition for better retention', 12);
    addText('- Utilize office hours for conceptual clarity', 12);
  }
  else {
    addText('Improvement Strategy:', 12, true);
    addText('- Conduct weekly self-assessment of learning outcomes', 12);
    addText('- Prioritize foundational course revision', 12);
    addText('- Establish study routines with accountability checks', 12);
  }

  yPos += 15;

  // Strategic Recommendations
  addText('Action Plan:', 14, true);
  addText('1. Skill Development:', 12, true);
  addText('   - Technical: Practice problem-solving frameworks', 12);
  addText('   - Soft Skills: Join debate/discussion groups', 12);

  addText('2. Resource Utilization:', 12, true);
  addText('   - Library resources for supplementary learning', 12);
  addText('   - Online learning platforms for skill enhancement', 12);

  addText('3. Goal Setting:', 12, true);
  addText('   - Set SMART goals for each semester', 12);
  addText('   - Track progress with academic journals', 12);

  return doc;
}
