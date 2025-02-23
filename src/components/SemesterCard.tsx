import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, GraduationCap, BookOpen } from 'lucide-react';
import type { Semester, Course } from '../types/database';
import { useTheme } from '../context/ThemeContext';

interface SemesterCardProps {
  semester: Semester & { courses: Course[] };
  onUpdate: () => void;
}

export default function SemesterCard({ semester, onUpdate }: SemesterCardProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { theme } = useTheme();

  async function handleDelete() {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('semesters')
        .delete()
        .eq('id', semester.id);

      if (error) throw error;
      onUpdate();
    } catch (error) {
      console.error('Error deleting semester:', error);
      alert('Failed to delete semester');
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  }

  const isDark = theme === 'dark';

  return (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} overflow-hidden shadow-lg rounded-2xl border hover:shadow-xl transition-shadow duration-300`}>
      <div className="px-6 py-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className={`${isDark ? 'bg-gray-700' : 'bg-gradient-to-r from-indigo-100 to-purple-100'} p-2 rounded-lg`}>
              <GraduationCap className={`h-5 w-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
            </div>
            <div className="ml-3">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Semester {semester.semester_number}
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {semester.academic_year}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {showConfirm ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className={`px-3 py-1 text-xs font-medium ${isDark ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'} rounded-md`}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                disabled={loading}
                className={`p-1.5 text-red-600 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-red-50'} rounded-lg transition-colors duration-200`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className={`${isDark ? 'bg-gray-700' : 'bg-gradient-to-br from-indigo-50 to-purple-50'} rounded-xl p-3`}>
            <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>GPA</p>
            <p className={`text-2xl font-bold ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
              {semester.gpa.toFixed(2)}
            </p>
          </div>
          <div className={`${isDark ? 'bg-gray-700' : 'bg-gradient-to-br from-purple-50 to-pink-50'} rounded-xl p-3`}>
            <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Credits</p>
            <p className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
              {semester.total_credits}
            </p>
          </div>
        </div>
      </div>
      
      <div className={`px-6 py-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="space-y-3">
          {semester.courses.map((course) => (
            <div key={course.id} className={`flex justify-between items-center ${isDark ? 'bg-gray-800' : 'bg-white'} p-3 rounded-xl shadow-sm`}>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <BookOpen className={`h-4 w-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{course.course_code}</p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{course.course_name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{course.credits} cr</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isDark ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-800'}`}>
                  {course.grade}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}