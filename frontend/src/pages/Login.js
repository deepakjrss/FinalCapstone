import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ModernCard, ModernButton } from '../components/ModernComponents'
// removed unused ModernInput and modernDesignSystem imports

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [isPageLoaded, setIsPageLoaded] = useState(false)

  useEffect(() => setError(''), [email, password])
  useEffect(() => setIsPageLoaded(true), [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const result = await login(email, password)
      if (result.success) {
        const role = result.data.user.role
        navigate(role === 'student' ? '/student-dashboard' : role === 'teacher' ? '/teacher-dashboard' : '/admin-dashboard')
      } else {
        setError(result.error || 'Login failed')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
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
              <p className="text-gray-600">Grow your virtual forest by learning and taking action</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@student.example.com"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100 transition"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              </div>

              {/* Login Button */}
              <ModernButton
                variant="primary"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </ModernButton>
            </form>

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
