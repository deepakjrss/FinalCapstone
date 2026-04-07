import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModernCard, ModernButton } from '../components/ModernComponents';

const PendingApproval = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect to home after 5 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <ModernCard>
          <div className="p-8 text-center">
            {/* Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Account Under Review
            </h1>

            {/* Message */}
            <p className="text-gray-600 mb-6">
              Your account is currently being reviewed by the school administration.
              You will receive an email notification once your account is approved.
            </p>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-left">
                  <p className="text-sm font-medium text-blue-900">What happens next?</p>
                  <p className="text-sm text-blue-700 mt-1">
                    A teacher or admin will review your registration and approve your account.
                    Once approved, you'll be able to login normally.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <ModernButton
                variant="primary"
                onClick={() => navigate('/')}
                className="w-full"
              >
                Go to Home Page
              </ModernButton>

              <button
                onClick={() => navigate('/login')}
                className="w-full px-4 py-3 text-gray-600 font-semibold hover:text-gray-700 hover:bg-gray-50 rounded-lg transition"
              >
                Back to Login
              </button>
            </div>

            {/* Auto redirect notice */}
            <p className="text-xs text-gray-500 mt-4">
              You will be redirected to the home page in 5 seconds...
            </p>
          </div>
        </ModernCard>
      </div>
    </div>
  );
};

export default PendingApproval;