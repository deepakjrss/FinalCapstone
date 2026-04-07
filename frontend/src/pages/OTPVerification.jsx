import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ToastNotification'
import { ModernCard, ModernButton, ModernInput } from '../components/ModernComponents'

export default function OTPVerification() {
  const { showSuccess, showError } = useToast();
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [otpExpiry, setOtpExpiry] = useState(null)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  const navigate = useNavigate()
  const location = useLocation()
  const { sendOTP, verifyOTP, user } = useAuth()

  // Get email from navigation state or URL params
  useEffect(() => {
    const stateEmail = location.state?.email
    const urlEmail = new URLSearchParams(location.search).get('email')
    const prefilledEmail = stateEmail || urlEmail || ''
    setEmail(prefilledEmail)
  }, [location])

  // Calculate remaining time for OTP
  useEffect(() => {
    if (!otpExpiry) return
    const timer = setInterval(() => {
      const remaining = otpExpiry - new Date()
      if (remaining <= 0) {
        setOtp('')
        setOtpExpiry(null)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [otpExpiry])

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setResendDisabled(false)
    }
  }, [resendTimer])

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    setIsLoading(true)
    try {
      const result = await sendOTP(email)
      if (result.success) {
        setSuccess('OTP sent successfully! Check your email.')
        setOtpExpiry(new Date(Date.now() + 5 * 60 * 1000))
        setResendDisabled(true)
        setResendTimer(30) // 30 seconds cooldown
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to send OTP')
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
        showSuccess('Login successful! Redirecting...')
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
      setError('OTP verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <ModernCard className="w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Account</h2>
          <p className="text-gray-600">Enter the OTP sent to your email</p>
        </div>

        <form onSubmit={handleVerifyOTP} className="space-y-4">
          {/* Email Input */}
          <ModernInput
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={isLoading}
          />

          {/* Send OTP Button */}
          <ModernButton
            type="button"
            onClick={handleSendOTP}
            disabled={isLoading || resendDisabled}
            variant="outline"
            className="w-full"
          >
            {isLoading ? 'Sending...' : resendDisabled ? `Resend OTP in ${resendTimer}s` : 'Send OTP'}
          </ModernButton>

          {/* OTP Input */}
          <ModernInput
            label="OTP Code"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            required
            disabled={isLoading}
          />

          {/* Verify Button */}
          <ModernButton
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </ModernButton>
        </form>

        {/* Error/Success Messages */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Back to Login
          </button>
        </div>
      </ModernCard>
    </div>
  )
}