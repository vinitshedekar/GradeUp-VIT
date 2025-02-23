// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { supabase } from '../lib/supabase';
// import { GraduationCap, ArrowLeft } from 'lucide-react';
// import Navbar from '../components/Navbar';

// export default function Register() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);
//     const email = formData.get('email') as string;
//     const password = formData.get('password') as string;
//     const name = formData.get('name') as string;
//     const department = formData.get('department') as string;
//     const registrationNumber = formData.get('registrationNumber') as string;

//     try {
//       setLoading(true);
//       setError(null);

//       const { data: authData, error: signUpError } = await supabase.auth.signUp({
//         email,
//         password,
//       });

//       if (signUpError) throw signUpError;
//       if (!authData.user) throw new Error('Failed to create user account');

//       await new Promise(resolve => setTimeout(resolve, 500));

//       const { error: profileError } = await supabase
//         .from('profiles')
//         .insert({
//           id: authData.user.id,
//           name,
//           department,
//           registration_number: registrationNumber,
//         });

//       if (profileError) {
//         console.error('Profile creation failed:', profileError);
//         await supabase.auth.signOut();
//         throw new Error('Failed to create user profile. Please try again.');
//       }

//       navigate('/dashboard');
//     } catch (err) {
//       console.error('Registration error:', err);
//       setError(err instanceof Error ? err.message : 'Failed to create account. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
//       <Navbar showAuthButtons={false} />
//       <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//         <div className="sm:mx-auto sm:w-full sm:max-w-md">
//           <Link 
//             to="/" 
//             className="flex items-center text-indigo-600 hover:text-indigo-500 mb-6 mx-auto w-fit"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to home
//           </Link>
//           <div className="flex justify-center">
//             <div className="bg-white p-2 rounded-2xl shadow-lg">
//               <GraduationCap className="h-12 w-12 text-indigo-600" />
//             </div>
//           </div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Create your account
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Already have an account?{' '}
//             <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
//               Sign in
//             </Link>
//           </p>
//         </div>

//         <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//           <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100">
//             <form className="space-y-6" onSubmit={handleSubmit}>
//               {error && (
//                 <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
//                   <div className="flex">
//                     <div className="ml-3">
//                       <p className="text-sm text-red-700">{error}</p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div>
//                 <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                   Full Name
//                 </label>
//                 <div className="mt-1">
//                   <input
//                     id="name"
//                     name="name"
//                     type="text"
//                     required
//                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                     placeholder="John Doe"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                   Email address
//                 </label>
//                 <div className="mt-1">
//                   <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     autoComplete="email"
//                     required
//                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                     placeholder="you@example.com"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="department" className="block text-sm font-medium text-gray-700">
//                   Department
//                 </label>
//                 <div className="mt-1">
//                   <select
//                     id="department"
//                     name="department"
//                     required
//                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   >
//                     <option value="">Select Department</option>
//                     <option value="Computer Science">Computer Science</option>
//                     <option value="Information Technology">Information Technology</option>
//                     <option value="Electronics">Electronics</option>
//                     <option value="Mechanical">Mechanical</option>
//                     <option value="Civil">Civil</option>
//                     <option value="Chemical">Chemical</option>
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
//                   Registration Number
//                 </label>
//                 <div className="mt-1">
//                   <input
//                     id="registrationNumber"
//                     name="registrationNumber"
//                     type="text"
//                     required
//                     pattern="[0-9]{2}[A-Z]{3}[0-9]{4}"
//                     title="Please enter a valid registration number (e.g., 21BCE1234)"
//                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                     placeholder="21BCE1234"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                   Password
//                 </label>
//                 <div className="mt-1">
//                   <input
//                     id="password"
//                     name="password"
//                     type="password"
//                     autoComplete="new-password"
//                     required
//                     minLength={6}
//                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                     placeholder="••••••••"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02]"
//                 >
//                   {loading ? 'Creating account...' : 'Create account'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }









import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // ... keep existing submit logic unchanged ... 
    e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const name = formData.get('name') as string;
        const department = formData.get('department') as string;
        const registrationNumber = formData.get('registrationNumber') as string;

        try {
          setLoading(true);
          setError(null);

          const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
          });

          if (signUpError) throw signUpError;
          if (!authData.user) throw new Error('Failed to create user account');

          await new Promise(resolve => setTimeout(resolve, 500));

          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              name,
              department,
              registration_number: registrationNumber,
            });

          if (profileError) {
            console.error('Profile creation failed:', profileError);
            await supabase.auth.signOut();
            throw new Error('Failed to create user profile. Please try again.');
          }

          navigate('/dashboard');
        } catch (err) {
          console.error('Registration error:', err);
          setError(err instanceof Error ? err.message : 'Failed to create account. Please try again.');
        } finally {
          setLoading(false);
        }
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar showAuthButtons={false} />
      <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link
            to="/"
            className={`flex items-center ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'} mb-6 mx-auto w-fit`}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>
          <div className="flex justify-center">
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'} p-2 rounded-2xl shadow-lg border`}>
              <GraduationCap className={`h-12 w-12 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
            </div>
          </div>
          <h2 className={`mt-6 text-center text-3xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Create your account
          </h2>
          <p className={`mt-2 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Already have an account?{' '}
            <Link to="/login" className={`font-medium ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'}`}>
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'} py-8 px-4 shadow sm:rounded-lg sm:px-10 border`}>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className={`${isDark ? 'bg-red-900/50 border-red-500' : 'bg-red-50 border-red-200'} border text-red-600 px-4 py-3 rounded-md text-sm`}>
                  {error}
                </div>
              )}

              {/* Name Input */}
              <div>
                <label htmlFor="name" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className={`appearance-none block w-full px-3 py-2 border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`appearance-none block w-full px-3 py-2 border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Department Select */}
              <div>
                <label htmlFor="department" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Department
                </label>
                <div className="mt-1">
                  <select
                    id="department"
                    name="department"
                    required
                    className={`appearance-none block w-full px-3 py-2 border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                    <option value="Chemical">Chemical</option>
                  </select>
                </div>
              </div>

              {/* Registration Number Input */}
              <div>
                <label htmlFor="registrationNumber" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Registration Number
                </label>
                <div className="mt-1">
                  <input
                    id="registrationNumber"
                    name="registrationNumber"
                    type="text"
                    required
                    pattern="[0-9]{2}[A-Z]{3}[0-9]{4}"
                    title="Please enter a valid registration number (e.g., 21BCE1234)"
                    className={`appearance-none block w-full px-3 py-2 border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="21BCE1234"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    className={`appearance-none block w-full px-3 py-2 border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
