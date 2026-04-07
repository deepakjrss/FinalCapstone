import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../components/ToastNotification';
import taskService from '../services/taskService';

const TaskReview = () => {
  const { showSuccess } = useToast();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('pending');
  const [reviewing, setReviewing] = useState(null);

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await taskService.getSubmissions(filter === 'all' ? null : filter);
      setSubmissions(data);
    } catch (err) {
      setError('Failed to load submissions');
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleReview = async (submissionId, status, reviewComments = '') => {
    try {
      setReviewing(submissionId);
      setError('');
      setSuccess('');

      await taskService.reviewSubmission(submissionId, status, reviewComments);

      showSuccess(`Submission ${status} successfully! ${status === 'approved' ? '✅' : '❌'}`);
      // Refresh submissions
      await fetchSubmissions();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${status} submission`);
      console.error('Error reviewing submission:', err);
    } finally {
      setReviewing(null);
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    if (filter === 'all') return true;
    return submission.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Review</h1>
          <p className="text-gray-600">Review student submissions and award ecoPoints.</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'pending', label: 'Pending Review', count: submissions.filter(s => s.status === 'pending').length },
                { key: 'approved', label: 'Approved', count: submissions.filter(s => s.status === 'approved').length },
                { key: 'rejected', label: 'Rejected', count: submissions.filter(s => s.status === 'rejected').length },
                { key: 'all', label: 'All Submissions', count: submissions.length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <div className="space-y-6">
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No submissions found</h3>
              <p className="text-gray-500">
                {filter === 'pending'
                  ? 'No submissions are currently pending review.'
                  : `No submissions with status "${filter}".`
                }
              </p>
            </div>
          ) : (
            filteredSubmissions.map((submission) => (
              <SubmissionCard
                key={submission._id}
                submission={submission}
                onReview={handleReview}
                reviewing={reviewing === submission._id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const SubmissionCard = ({ submission, onReview, reviewing }) => {
  const { showError } = useToast();
  const [reviewComments, setReviewComments] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleApprove = () => {
    onReview(submission._id, 'approved', reviewComments);
  };

  const handleReject = () => {
    if (!reviewComments.trim()) {
      showError('Please provide review comments when rejecting a submission.'); // eslint-disable-line no-undef
      return;
    }
    onReview(submission._id, 'rejected', reviewComments);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{submission.task.title}</h3>
            <span className="text-sm text-gray-500">by {submission.student.name}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <span>📅 Submitted: {new Date(submission.submittedAt).toLocaleDateString()}</span>
            <span>🌱 {submission.task.points} ecoPoints</span>
            <span>📚 Class: {submission.student.className}</span>
          </div>
        </div>
        <div className="ml-4">
          {submission.status === 'pending' ? (
            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
              Pending Review
            </span>
          ) : (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              submission.status === 'approved'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
            </span>
          )}
        </div>
      </div>

      {/* Proof Section */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Student Proof:</h4>
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          {/* Text Proof */}
          {submission.proof && (
            <div>
              <p className="text-gray-700 whitespace-pre-wrap">{submission.proof}</p>
            </div>
          )}

          {/* Image Proof */}
          {submission.proofImage && (
            <div>
              <img
                src={submission.proofImage}
                alt="Student proof"
                className="max-w-full h-auto max-h-96 rounded-lg shadow-sm border"
                onError={(e) => {
                  console.error('Failed to load image:', e.target.src);
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <p className="text-red-600 text-sm mt-1" style={{ display: 'none' }}>
                Failed to load image
              </p>
            </div>
          )}

          {/* No proof message */}
          {!submission.proof && !submission.proofImage && (
            <p className="text-gray-500 italic">No proof provided</p>
          )}
        </div>
      </div>

      {/* Review Comments */}
      {submission.reviewComments && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Review Comments:</h4>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-blue-800 text-sm">{submission.reviewComments}</p>
          </div>
        </div>
      )}

      {/* Review Actions */}
      {submission.status === 'pending' && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <button
                onClick={() => setShowComments(!showComments)}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                {showComments ? 'Hide' : 'Add'} review comments
              </button>
              {showComments && (
                <textarea
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  placeholder="Optional comments for the student..."
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  rows={2}
                />
              )}
            </div>
            <div className="flex gap-3 ml-4">
              <button
                onClick={handleReject}
                disabled={reviewing}
                className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reviewing ? 'Rejecting...' : 'Reject'}
              </button>
              <button
                onClick={handleApprove}
                disabled={reviewing}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reviewing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Approving...
                  </>
                ) : (
                  'Approve'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskReview;