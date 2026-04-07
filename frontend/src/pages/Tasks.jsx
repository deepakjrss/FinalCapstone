import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastNotification';
import taskService from '../services/taskService';
import CreateTaskModal from '../components/CreateTaskModal';

const TaskSubmissionForm = ({ taskId, onSubmit, submitting }) => {
  const { showError } = useToast();
  const [proof, setProof] = useState('');
  const [proofImage, setProofImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!proof.trim() && !proofImage) {
      showError('Please provide either text proof or upload an image');
      return;
    }
    onSubmit(taskId, proof, proofImage);
    setProof('');
    setProofImage(null);
    setImagePreview(null);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div>
        <label htmlFor={`proof-${taskId}`} className="block text-sm font-medium text-gray-700 mb-1">
          Submit Proof (Text or Image)
        </label>
        <textarea
          id={`proof-${taskId}`}
          value={proof}
          onChange={(e) => setProof(e.target.value)}
          placeholder="Describe what you did or provide additional details..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor={`image-${taskId}`} className="block text-sm font-medium text-gray-700 mb-1">
          Upload Image Proof (Optional)
        </label>
        <input
          type="file"
          id={`image-${taskId}`}
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
        />
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-full h-32 object-cover rounded-md border"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Submitting...
          </>
        ) : (
          'Submit Proof'
        )}
      </button>
    </form>
  );
};

const Tasks = () => {
  const { user } = useAuth();
  const { showSuccess } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(null);
  const [success, setSuccess] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await taskService.getTasksByClass(user.className);

      if (response.success && response.tasks) {
        setTasks(response.tasks);
      } else {
        setError('Unable to load tasks. Please try again later.');
      }
    } catch (err) {
      setError('Something went wrong while loading tasks.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Reset to first page when tasks change
  useEffect(() => {
    setCurrentPage(1);
  }, [tasks]);

  const handleSubmitProof = async (taskId, proof, proofImage) => {
    if (!proof.trim() && !proofImage) {
      setError('Please provide either text proof or upload an image');
      return;
    }

    try {
      setSubmitting(taskId);
      setError('');
      setSuccess('');

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('taskId', taskId);
      if (proof.trim()) {
        formData.append('proof', proof);
      }
      if (proofImage) {
        formData.append('proofImage', proofImage);
      }

      await taskService.submitTask(formData);

      showSuccess('Proof submitted successfully! Awaiting teacher review. 📝');
      // Refresh tasks to update submission status
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit proof');
      console.error('Error submitting proof:', err);
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Real-World Tasks</h1>
            <p className="text-gray-600">Complete tasks to earn ecoPoints and help the environment!</p>
          </div>
          {user && ["teacher", "admin"].includes(user?.role?.toLowerCase()) && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow-md transition"
            >
              <span className="mr-2">+</span>
              Create Task
            </button>
          )}
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
          {tasks?.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No tasks available</h3>
              <p className="text-gray-500">Check back later for new tasks from your teacher.</p>
            </div>
          ) : (
            (() => {
              // Calculate pagination
              const indexOfLast = currentPage * tasksPerPage;
              const indexOfFirst = indexOfLast - tasksPerPage;
              const currentTasks = tasks.slice(indexOfFirst, indexOfLast);

              return (
                <>
                  {/* Pagination Info */}
                  <div className="text-sm text-gray-600 mb-4">
                    Showing {Math.min((currentPage - 1) * tasksPerPage + 1, tasks.length)} - {Math.min(currentPage * tasksPerPage, tasks.length)} of {tasks.length} tasks
                  </div>

                  {/* Tasks List */}
                  {currentTasks.map((task) => (
                    <div key={task._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h3>
                          <p className="text-gray-600 mb-3">{task.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>🌱 {task.points} ecoPoints</span>
                            <span>📅 Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Available</span>
                        </div>
                      </div>

                      <TaskSubmissionForm
                        taskId={task._id}
                        onSubmit={handleSubmitProof}
                        submitting={submitting === task._id}
                      />
                    </div>
                  ))}

                  {/* Pagination Controls */}
                  {(() => {
                    const totalPages = Math.ceil(tasks.length / tasksPerPage);
                    if (totalPages <= 1) return null;

                    return (
                      <div className="flex items-center justify-between mt-8">
                        <button
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>

                        <div className="flex gap-2">
                          {Array.from({ length: totalPages }, (_, i) => (
                            <button
                              key={i}
                              onClick={() => setCurrentPage(i + 1)}
                              className={`px-3 py-2 rounded-xl shadow-md transition ${
                                currentPage === i + 1
                                  ? "bg-green-600 text-white"
                                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    );
                  })()}
                </>
              );
            })()
          )}
        </div>
      </div>

      {/* Task Creation Modal */}
      <CreateTaskModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTaskCreated={fetchTasks}
      />
    </div>
  );
};

export default Tasks;