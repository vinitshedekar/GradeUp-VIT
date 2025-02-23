import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { X, Plus, Trash2 } from 'lucide-react';
import type { Grade } from '../types/database';
import { GRADES } from '../types/database';
import { useTheme } from '../context/ThemeContext';

interface AddSemesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
}

export default function AddSemesterModal({ isOpen, onClose, onAdd }: AddSemesterModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([
    { courseCode: '', courseName: '', credits: '3', grade: 'A' as Grade },
  ]);

  const [semesterNumber, setSemesterNumber] = useState('1');
  const [academicYear, setAcademicYear] = useState('2023-24');

  if (!isOpen) return null;

  const addCourse = () => {
    setCourses([
      ...courses,
      { courseCode: '', courseName: '', credits: '3', grade: 'A' as Grade },
    ]);
  };

  const removeCourse = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index));
  };

  const updateCourse = (
    index: number,
    field: 'courseCode' | 'courseName' | 'credits' | 'grade',
    value: string
  ) => {
    const newCourses = [...courses];
    newCourses[index] = { ...newCourses[index], [field]: value };
    setCourses(newCourses);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Insert semester
      const { data: semesterData, error: semesterError } = await supabase
        .from('semesters')
        .insert({
          user_id: user.id,
          semester_number: parseInt(semesterNumber),
          academic_year: academicYear,
        })
        .select()
        .single();

      if (semesterError) throw semesterError;

      // Insert courses
      const coursesData = courses.map(course => ({
        semester_id: semesterData.id,
        course_code: course.courseCode,
        course_name: course.courseName,
        credits: parseFloat(course.credits),
        grade: course.grade,
        grade_points: GRADES[course.grade as keyof typeof GRADES],
      }));

      const { error: coursesError } = await supabase
        .from('courses')
        .insert(coursesData);

      if (coursesError) throw coursesError;

      onAdd();
      onClose();
    } catch (error) {
      console.error('Error adding semester:', error);
      alert('Failed to add semester');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className={`absolute inset-0 ${isDark ? 'bg-gray-900 bg-opacity-75' : 'bg-gray-500 bg-opacity-75'}`}></div>
        </div>

        <div className={`inline-block transform overflow-hidden rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle`}>
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className={`rounded-md ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-500'}`}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
              <h3 className={`text-lg font-medium leading-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Add New Semester
              </h3>
              <div className="mt-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="semesterNumber" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Semester Number
                      </label>
                      <select
                        id="semesterNumber"
                        value={semesterNumber}
                        onChange={(e) => setSemesterNumber(e.target.value)}
                        className={`mt-1 block w-full rounded-md ${isDark
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'border-gray-300 text-gray-900'
                          } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <option key={num} value={num}>
                            Semester {num}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="academicYear" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Academic Year
                      </label>
                      <input
                        type="text"
                        id="academicYear"
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        placeholder="2023-24"
                        className={`mt-1 block w-full rounded-md ${isDark
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'border-gray-300 text-gray-900'
                          } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {courses.map((course, index) => (
                      <div key={index} className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-3">
                            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              Course Code
                            </label>
                            <input
                              type="text"
                              value={course.courseCode}
                              onChange={(e) => updateCourse(index, 'courseCode', e.target.value)}
                              placeholder="CS101"
                              className={`mt-1 block w-full rounded-md ${isDark
                                  ? 'bg-gray-600 border-gray-500 text-white'
                                  : 'border-gray-300 text-gray-900'
                                } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                            />
                          </div>
                          <div className="col-span-5">
                            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              Course Name
                            </label>
                            <input
                              type="text"
                              value={course.courseName}
                              onChange={(e) => updateCourse(index, 'courseName', e.target.value)}
                              placeholder="Python Programming"
                              className={`mt-1 block w-full rounded-md ${isDark
                                  ? 'bg-gray-600 border-gray-500 text-white'
                                  : 'border-gray-300 text-gray-900'
                                } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                            />
                          </div>
                          <div className="col-span-2">
                            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              Credits
                            </label>
                            <select
                              value={course.credits}
                              onChange={(e) => updateCourse(index, 'credits', e.target.value)}
                              className={`mt-1 block w-full rounded-md ${isDark
                                  ? 'bg-gray-600 border-gray-500 text-white'
                                  : 'border-gray-300 text-gray-900'
                                } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                            >
                              {[1, 2, 3, 4, 5].map((credit) => (
                                <option key={credit} value={credit}>
                                  {credit}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-span-2">
                            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              Grade
                            </label>
                            <select
                              value={course.grade}
                              onChange={(e) => updateCourse(index, 'grade', e.target.value)}
                              className={`mt-1 block w-full rounded-md ${isDark
                                  ? 'bg-gray-600 border-gray-500 text-white'
                                  : 'border-gray-300 text-gray-900'
                                } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                            >
                              {Object.keys(GRADES).map((grade) => (
                                <option key={grade} value={grade}>
                                  {grade}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-span-1 flex items-end justify-center">
                            {courses.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeCourse(index)}
                                className={`p-2 rounded-md ${isDark
                                    ? 'text-red-400 hover:bg-gray-600'
                                    : 'text-red-600 hover:bg-red-50'
                                  }`}
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={addCourse}
                      className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md ${isDark
                          ? 'text-indigo-400 bg-gray-700 hover:bg-gray-600'
                          : 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200'
                        }`}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Course
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      {loading ? 'Adding...' : 'Add Semester'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}