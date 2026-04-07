import api from '../utils/api';

export const taskService = {
  // Student: Get tasks for their class
  getTasksByClass: async (className) => {
    const response = await api.get(`/tasks/${className}`);
    return response.data;
  },

  // Student: Submit proof for a task (supports text and/or image)
  submitTask: async (formData) => {
    const response = await api.post('/tasks/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Teacher: Create a new task
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Teacher: Get all submissions for their tasks
  getSubmissions: async (status = null) => {
    const params = status ? { status } : {};
    const response = await api.get('/tasks/submissions', { params });
    return response.data;
  },

  // Teacher: Review a submission
  reviewSubmission: async (submissionId, status, reviewComments = '') => {
    const response = await api.put('/tasks/review', {
      submissionId,
      status,
      reviewComments
    });
    return response.data;
  },

  // Teacher: Get submission stats for a student
  getStudentSubmissionStats: async (studentId) => {
    const response = await api.get(`/tasks/stats/student/${studentId}`);
    return response.data;
  },

  // Student: Get today's tasks
  getTodaysTasks: async () => {
    const response = await api.get('/tasks/today');
    return response.data;
  },

  // Student: Complete a task and earn points
  completeTask: async (taskId) => {
    const response = await api.post('/tasks/complete', { taskId });
    return response.data;
  }
};

export default taskService;