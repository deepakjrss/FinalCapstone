import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ModernCard, ModernButton } from '../components/ModernComponents';
// removed unused modernDesignSystem import

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    className: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    if (formData.role === 'student' && !formData.className) {
      setErrorMessage('Please enter your class name');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    const result = await register(formData);
    
    if (result.success) {
      const userRole = result.data.user.role;
      navigate(
        userRole === 'student' ? '/student-dashboard' :
        userRole === 'teacher' ? '/teacher-dashboard' :
        '/admin-dashboard'
      );
    } else {
      setErrorMessage(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className={`w-full max-w-md transition-all duration-700 ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <ModernCard>
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Join EcoVerse 🌍</h1>
              <p className="text-gray-600">Create an account to grow your virtual forest</p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start gap-3">
                <span className="text-xl mt-0.5">⚠️</span>
                <span className="text-sm">{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100 transition"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100 transition"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100 transition pr-12"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 text-sm font-medium"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {formData.password && (
                  <p className="text-xs text-gray-600 mt-2 ml-1">
                    {formData.password.length >= 6 ? (
                      <span className="text-green-600 font-semibold">✓ Strong password</span>
                    ) : (
                      <span className="text-orange-600">{formData.password.length}/6 characters</span>
                    )}
                  </p>
                )}
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100 transition appearance-none cursor-pointer"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              {/* Class Name (only for students) */}
              {formData.role === 'student' && (
                <div className="animate-fadeIn">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Class Name</label>
                  <input
                    type="text"
                    name="className"
                    value={formData.className}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100 transition"
                    placeholder="e.g., 10-A"
                    required
                  />
                </div>
              )}

              {/* Submit Button */}
              <ModernButton
                variant="primary"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-6"
              >
                {loading ? 'Creating account...' : 'Register'}
              </ModernButton>
            </form>

            {/* Login Link */}
            <p className="text-center text-gray-600 mt-6 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-green-600 hover:text-green-700">
                Login here
              </Link>
            </p>
          </div>
        </ModernCard>

        {/* Benefits Card */}
        <div className="mt-6 bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <p className="text-sm font-bold text-green-700 mb-4">✨ Why Join EcoVerse?</p>
          <div className="space-y-3 text-xs text-gray-600">
            <div className="flex items-start gap-3">
              <span className="text-lg">🌱</span>
              <span>Learn about environmental sustainability</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">🤝</span>
              <span>Connect with eco-conscious community</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">🏆</span>
              <span>Track your green impact</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Register;
