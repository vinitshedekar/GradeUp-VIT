import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, FileSpreadsheet, Github, Linkedin, Instagram } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`${isDark ? 'bg-gray-900' : 'bg-white'} min-h-screen flex flex-col`}>
      <Navbar />
      <div className={`flex-1 relative isolate ${isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-indigo-100/20'}`}>
        <div className="mx-auto h-full max-w-7xl px-6 lg:px-8 grid lg:grid-cols-2 items-center py-12">
          {/* Left Column - Content */}
          <div className="lg:pr-8">
            <div className="inline-flex space-x-6">
              <span className={`rounded-full ${isDark ? 'bg-indigo-500/10 text-indigo-400 ring-indigo-500/20' : 'bg-indigo-600/10 text-indigo-600 ring-indigo-600/10'} px-3 py-1 text-sm font-semibold leading-6 ring-1 ring-inset`}>
                VIT Chennai
              </span>
            </div>
            <h1 className={`mt-6 text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'} sm:text-6xl`}>
              Calculate your GPA with ease
            </h1>
            <p className={`mt-6 text-lg leading-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Track your academic progress, calculate semester GPA and CGPA, and visualize your performance over time with our comprehensive GPA calculator.
            </p>
            <div className="mt-8 flex items-center gap-x-6">
              <Link
                to="/register"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </Link>
              <Link to="/login" className={`text-sm font-semibold leading-6 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                Sign in <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Right Column - Features */}
          <div className="mt-0">
            <div className="grid grid-cols-1 gap-6">
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                <div className="flex items-center gap-4">
                  <div className={`${isDark ? 'bg-indigo-500/10' : 'bg-indigo-100'} p-3 rounded-lg`}>
                    <Calculator className={`h-6 w-6 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Easy Calculation</h3>
                    <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Calculate your GPA instantly with our intuitive interface</p>
                  </div>
                </div>
              </div>

              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                <div className="flex items-center gap-4">
                  <div className={`${isDark ? 'bg-purple-500/10' : 'bg-purple-100'} p-3 rounded-lg`}>
                    <TrendingUp className={`h-6 w-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Progress Tracking</h3>
                    <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Visualize your academic journey with interactive charts</p>
                  </div>
                </div>
              </div>

              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                <div className="flex items-center gap-4">
                  <div className={`${isDark ? 'bg-pink-500/10' : 'bg-pink-100'} p-3 rounded-lg`}>
                    <FileSpreadsheet className={`h-6 w-6 ${isDark ? 'text-pink-400' : 'text-pink-600'}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Detailed Reports</h3>
                    <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Download comprehensive performance reports with insights</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`${isDark ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t border-gray-200'}`}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              © {new Date().getFullYear()} Made by Vinit Shedekar. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="#github"
                className={`${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#linkedin"
                className={`${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#instagram"
                className={`${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}