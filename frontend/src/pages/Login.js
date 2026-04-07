import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ToastNotification'
import { ModernCard, ModernButton } from '../components/ModernComponents'

export default function Login() {
  const { showSuccess } = useToast();
  // Login OTP Flow States
  const [showOTP, setShowOTP] = useState(false) // NEW: Controls OTP UI visibility
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [otpExpiry, setOtpExpiry] = useState(null)
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [resendTimer, setResendTimer] = useState(30) // NEW: Resend timer (30 seconds)
  const [canResend, setCanResend] = useState(false) // NEW: Whether resend is available
  
  const navigate = useNavigate()
  const { login, sendOTP, verifyOTP, resendOTP, user } = useAuth()

  useEffect(() => setIsPageLoaded(true), [])

  // Calculate remaining time for OTP and resend timer
  useEffect(() => {
    if (!otpExpiry) return
    const timer = setInterval(() => {
      const remaining = otpExpiry - new Date()
      if (remaining <= 0) {
        setOtp('')
        setOtpExpiry(null)
        setCanResend(true)
        setResendTimer(0)
      } else {
        // Update resend timer (30 seconds from when OTP was sent)
        const elapsed = (new Date() - (otpExpiry - 5 * 60 * 1000)) / 1000
        const remainingResend = Math.max(0, 30 - elapsed)
        setResendTimer(Math.ceil(remainingResend))
        setCanResend(remainingResend <= 0)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [otpExpiry])

  const validateEmail = (emailToValidate) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(emailToValidate)
  }

  const validateCredentials = () => {
    const e = {}
    if (!email.trim()) e.email = 'Email is required.'
    else if (!validateEmail(email)) e.email = 'Please enter a valid email address.'

    if (!password.trim()) e.password = 'Password is required.'
    else if (password.length < 6) e.password = 'Password must be at least 6 characters.'

    setErrors(e)
    return e
  }

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setErrors({})

    const validationErrors = validateCredentials()
    if (Object.keys(validationErrors).length > 0) {
      setError('Please correct the highlighted fields and try again.')
      return
    }

    setIsLoading(true)
    console.log('Attempting login...')

    try {
      const result = await login(email, password)
      console.log('Login response:', result)

      if (result.success) {
        if (result.requiresApproval) {
          // User not approved - request sent
          setSuccess(result.message || 'Request sent for approval ⏳')
          setTimeout(() => {
            navigate('/pending-approval')
          }, 2000)
          return
        }

        if (result.requiresOTP) {
          // User approved but first login - OTP sent
          setSuccess(result.message || 'OTP sent to your email 📩')
          setShowOTP(true)
          setOtpExpiry(new Date(Date.now() + 5 * 60 * 1000)) // 5 minutes expiry
          return
        }

        // Normal login successful
        showSuccess('✓ Login successful! Redirecting... 🚀')
        const dashboardPath = result.user?.role === 'admin' ? '/admin-dashboard' :
                             result.user?.role === 'teacher' ? '/teacher-dashboard' :
                             '/student-dashboard'
        setTimeout(() => {
          navigate(dashboardPath)
        }, 1500)
        return
      }

      // Login failed
      setError(result.error || 'Login failed')

    } catch (err) {
      console.error('Login error:', err)
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!otp.trim() || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    setIsLoading(true)
    try {
      const result = await verifyOTP(email, otp)
      if (result.success) {
        showSuccess('✓ Login successful! Redirecting... 🚀');
        // Redirect based on role
        const dashboardPath = user?.role === 'admin' ? '/admin-dashboard' :
                             user?.role === 'teacher' ? '/teacher-dashboard' :
                             '/student-dashboard';
        setTimeout(() => {
          navigate(dashboardPath)
        }, 1500)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToCredentials = () => {
    setShowOTP(false) // NEW: Reset to credentials view
    setOtp('')
    setOtpExpiry(null)
    setResendTimer(30)
    setCanResend(false)
    setSuccess('')
    setError('')
  }

  const handleResendOTP = async () => {
    if (!canResend || isLoading) return

    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const result = await resendOTP(email)
      if (result.success) {
        setSuccess('OTP resent to your email 📩')
        setOtpExpiry(new Date(Date.now() + 5 * 60 * 1000)) // Reset expiry
        setResendTimer(30) // Reset resend timer
        setCanResend(false)
      } else {
        setError(result.error || 'Failed to resend OTP')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className={`w-full max-w-md transition-all duration-700 ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <ModernCard>
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to EcoVerse 🌿</h1>
              <p className="text-gray-600">
                {!showOTP ? 'Enter your credentials to login' : 'Enter the OTP sent to your email'}
              </p>
            </div>

            {/* Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start gap-3">
                <span className="text-xl mt-0.5">⚠️</span>
                <span className="text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg flex items-start gap-3">
                <span className="text-xl mt-0.5">✓</span>
                <span className="text-sm">{success}</span>
              </div>
            )}

            {/* Step 1: Email & Password */}
            {!showOTP && (
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError('')
                        if (errors.email) setErrors(prev => ({ ...prev, email: '' }))
                      }}
                      required
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100 transition"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          if (error) setError('')
                          if (errors.password) setErrors(prev => ({ ...prev, password: '' }))
                        }}
                        required
                        placeholder="Enter your password"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100 transition pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 text-sm font-medium"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>

                  <ModernButton
                  variant="primary"
                  type="submit"
                  disabled={isLoading || !email.trim() || !password.trim()}
                  className="w-full"
                >
                  {isLoading ? 'Processing...' : 'Login'}
                </ModernButton>
              </form>
            )}

            {/* Step 2: OTP Input */}
            {showOTP && (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs text-green-700 font-semibold">Credentials Verified ✓</p>
                  <p className="text-sm text-gray-900 font-medium">{email}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                      if (error) setError('')
                    }}
                    maxLength="6"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100 transition text-center text-2xl letter-spacing tracking-widest font-bold"
                    placeholder="000000"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2 ml-1">
                    {otpExpiry && `Expires in ${Math.ceil((otpExpiry - new Date()) / 1000)}s`}
                  </p>
                </div>

                <div className="space-y-3">
                  <ModernButton
                    variant="primary"
                    type="submit"
                    disabled={isLoading || otp.length !== 6}
                    className="w-full"
                  >
                    {isLoading ? 'Verifying...' : 'Verify OTP & Login'}
                  </ModernButton>

                  {/* Resend OTP Button */}
                  <div className="text-center">
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={isLoading}
                        className="text-sm text-green-600 hover:text-green-700 font-semibold hover:bg-green-50 px-3 py-2 rounded-lg transition disabled:opacity-50"
                      >
                        {isLoading ? 'Sending...' : 'Resend OTP 📩'}
                      </button>
                    ) : (
                      <p className="text-xs text-gray-500">
                        Resend OTP in {resendTimer}s
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleBackToCredentials}
                    className="w-full px-4 py-3 text-green-600 font-semibold hover:text-green-700 hover:bg-green-50 rounded-lg transition"
                  >
                    Back to Credentials
                  </button>
                </div>
              </form>
            )}

            {/* Sign Up Link */}
            <p className="mt-6 text-center text-sm text-gray-600">
              New here?{' '}
              <Link to="/register" className="font-semibold text-green-600 hover:text-green-700">
                Create an account
              </Link>
            </p>
          </div>
        </ModernCard>
      </div>
    </div>
  )
}
