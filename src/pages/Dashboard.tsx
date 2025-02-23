import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PlusCircle, LogOut, TrendingUp, BookOpen, User, Award, Download, Sun, Moon } from 'lucide-react';
import html2canvas from 'html2canvas';
import type { Semester, Course, Profile } from '../types/database';
import AddSemesterModal from '../components/AddSemesterModal';
import SemesterCard from '../components/SemesterCard';
import { generatePDFReport } from '../components/PDFReport';
import { useTheme } from '../context/ThemeContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProfile();
    fetchSemesters();
  }, []);

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setProfile(data);
    }
  }

  async function fetchSemesters() {
    const { data } = await supabase
      .from('semesters')
      .select(`
        *,
        courses (*)
      `)
      .order('semester_number', { ascending: true });

    if (data) {
      setSemesters(data);
    }
    setLoading(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate('/login');
  }

  async function handleDownloadReport() {
    if (!profile || !chartRef.current) return;

    // Convert chart to image
    const chartElement = chartRef.current;
    const canvas = await html2canvas(chartElement);
    const chartDataURL = canvas.toDataURL('image/png');

    const doc = generatePDFReport({
      semesters,
      studentName: profile.name,
      department: profile.department || 'Not Specified',
      registrationNumber: profile.registration_number || 'Not Specified',
      chartDataURL,
    });

    doc.save(`${profile.name.replace(/\s+/g, '_')}_academic_report.pdf`);
  }

  const cgpa = semesters.length > 0
    ? semesters.reduce((acc, sem) => acc + (sem.gpa * sem.total_credits), 0) /
      semesters.reduce((acc, sem) => acc + sem.total_credits, 0)
    : 0;

  const chartData = semesters.map(sem => ({
    name: `Sem ${sem.semester_number}`,
    gpa: sem.gpa
  }));

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'}`}>
      <nav className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow-sm border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <BookOpen className={`h-8 w-8 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                <span className={`ml-2 text-xl font-bold bg-gradient-to-r ${theme === 'dark' ? 'from-indigo-400 to-purple-400' : 'from-indigo-600 to-purple-600'} text-transparent bg-clip-text`}>
                  GradeUp VIT
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <span className="font-medium">{profile?.name}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:scale-[1.02]"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Profile and CGPA Section */}
        <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl p-6 mb-6 border`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{profile?.name}</h2>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{profile?.department}</p>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{profile?.registration_number}</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className={`h-5 w-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} mr-2`} />
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Current CGPA</p>
                </div>
                <p className={`text-4xl font-bold bg-gradient-to-r ${theme === 'dark' ? 'from-indigo-400 to-purple-400' : 'from-indigo-600 to-purple-600'} text-transparent bg-clip-text`}>
                  {cgpa.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <button
                onClick={handleDownloadReport}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </button>
            </div>
          </div>
        </div>

        {/* GPA Trend Chart */}
        <div ref={chartRef} className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl p-6 mb-6 border`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className={`h-5 w-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>GPA Trend</h3>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
                <XAxis dataKey="name" stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                <YAxis domain={[0, 10]} stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1F2937' : 'white',
                    border: theme === 'dark' ? '1px solid #374151' : '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    color: theme === 'dark' ? '#F9FAFB' : 'inherit'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="gpa"
                  stroke="url(#colorGradient)"
                  strokeWidth={3}
                  dot={{ fill: theme === 'dark' ? '#818CF8' : '#4F46E5', stroke: theme === 'dark' ? '#1F2937' : 'white', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8 }}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={theme === 'dark' ? '#818CF8' : '#4F46E5'} />
                    <stop offset="100%" stopColor={theme === 'dark' ? '#A78BFA' : '#7C3AED'} />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Semesters Section */}
        <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl p-6 border`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Semesters</h3>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:scale-[1.02]"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Semester
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : semesters.length === 0 ? (
            <div className="text-center py-12">
              <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl p-8`}>
                <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-indigo-600" />
                </div>
                <p className={theme === 'dark' ? 'text-gray-300 mb-4' : 'text-gray-600 mb-4'}>No semesters added yet.</p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add your first semester
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {semesters.map((semester) => (
                <SemesterCard
                  key={semester.id}
                  semester={semester}
                  onUpdate={fetchSemesters}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <AddSemesterModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={fetchSemesters}
      />
    </div>
  );
}