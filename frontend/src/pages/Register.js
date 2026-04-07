import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastNotification';
import { ModernCard, ModernButton } from '../components/ModernComponents';
import axios from 'axios';

const Register = () => {
  const { showSuccess } = useToast();
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: form
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpExpiry, setOtpExpiry] = useState(null);

  // Registration Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    schoolId: '',
    inviteCode: '',
    classId: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Load schools on component mount
  useEffect(() => {
    loadSchools();
  }, []);

  // Load classes when school is selected
  useEffect(() => {
    if (formData.schoolId) {
      loadClasses(formData.schoolId);
    }
  }, [formData.schoolId]);

  // Calculate remaining time for OTP
  useEffect(() => {
    if (!otpExpiry) return;
    const timer = setInterval(() => {
      const remaining = otpExpiry - new Date();
      if (remaining <= 0) {
        setOtp('');
        setOtpExpiry(null);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [otpExpiry]);

  const loadSchools = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/schools/all');
      setSchools(response.data);
    } catch (error) {
      console.error('Failed to load schools:', error);
    }
  };

  const loadClasses = async (schoolId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/schools/classes/${schoolId}`);
      setClasses(response.data);
    } catch (error) {
      console.error('Failed to load classes:', error);
    }
  };

  const validateEmail = (emailToValidate) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailToValidate);
  };

  const validateForm = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Name is required.';
    if (!formData.password) e.password = 'Password is required.';
    else if (formData.password.length < 6) e.password = 'Password must be at least 6 characters.';
    if (!formData.schoolId) e.schoolId = 'Please select a school.';
    if (!formData.inviteCode.trim()) e.inviteCode = 'Invite code is required.';
    if (formData.role === 'student' && !formData.classId) e.classId = 'Class is required for students.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSendRegisterOTP = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/send-register-otp', {
        email
      });

      if (response.data.success) {
        showSuccess('✓ OTP sent to your email. Valid for 5 minutes. 📧');
        setStep(2);
        setOtpExpiry(new Date(Date.now() + 5 * 60 * 1000));
        setFormData(prev => ({ ...prev, email }));
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyRegisterOTP = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!otp.trim() || otp.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-register-otp', {
        email,
        otp
      });

      if (response.data.success) {
        showSuccess('✓ Email verified successfully!');
        setStep(3);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) {
      setErrorMessage('Please correct the form errors.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);

      if (response.data.success) {
        showSuccess('Request sent for approval ⏳');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSchoolChange = (e) => {
    const schoolId = e.target.value;
    setFormData(prev => ({ ...prev, schoolId, classId: '' })); // Reset class when school changes
    setClasses([]);
  };

  const renderStep1 = () => (
    <ModernCard className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Join EcoVerse</h2>
        <p className="text-gray-600">Enter your email to get started</p>
      </div>

      <form onSubmit={handleSendRegisterOTP} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="your@email.com"
            required
          />
        </div>

        <ModernButton
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Sending...' : 'Send Verification Code'}
        </ModernButton>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </ModernCard>
  );

  const renderStep2 = () => (
    <ModernCard className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
        <p className="text-gray-600">Enter the 6-digit code sent to {email}</p>
      </div>

      <form onSubmit={handleVerifyRegisterOTP} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-lg tracking-widest"
            placeholder="000000"
            maxLength="6"
            required
          />
        </div>

        <ModernButton
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className="w-full"
        >
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </ModernButton>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={() => setStep(1)}
          className="text-sm text-green-600 hover:text-green-700"
        >
          Change email address
        </button>
      </div>
    </ModernCard>
  );

  const renderStep3 = () => (
    <ModernCard className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Registration</h2>
        <p className="text-gray-600">Fill in your details to join</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Your full name"
            required
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Create a password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
          <select
            name="schoolId"
            value={formData.schoolId}
            onChange={handleSchoolChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.schoolId ? 'border-red-500' : 'border-gray-300'}`}
            required
          >
            <option value="">Select your school</option>
            {schools.map(school => (
              <option key={school._id} value={school._id}>{school.name}</option>
            ))}
          </select>
          {errors.schoolId && <p className="text-red-500 text-sm mt-1">{errors.schoolId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Invite Code</label>
          <input
            type="text"
            name="inviteCode"
            value={formData.inviteCode}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.inviteCode ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter school invite code"
            required
          />
          {errors.inviteCode && <p className="text-red-500 text-sm mt-1">{errors.inviteCode}</p>}
        </div>

        {formData.role === 'student' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select
              name="classId"
              value={formData.classId}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.classId ? 'border-red-500' : 'border-gray-300'}`}
              required
            >
              <option value="">Select your class</option>
              {classes.map(cls => (
                <option key={cls._id} value={cls._id}>
                  {cls.name} (Teacher: {cls.teacher?.name || 'Unknown'})
                </option>
              ))}
            </select>
            {errors.classId && <p className="text-red-500 text-sm mt-1">{errors.classId}</p>}
          </div>
        )}

        <ModernButton
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Submitting...' : 'Submit Request'}
        </ModernButton>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={() => setStep(1)}
          className="text-sm text-green-600 hover:text-green-700"
        >
          Start over
        </button>
      </div>
    </ModernCard>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default Register;
