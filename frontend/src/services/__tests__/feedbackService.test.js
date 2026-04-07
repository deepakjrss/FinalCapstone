import axios from 'axios';
import feedbackService from '../feedbackService';

jest.mock('axios');

describe('feedbackService', () => {
  let apiClient;

  beforeEach(() => {
    apiClient = {
      get: jest.fn(),
      post: jest.fn()
    };
    axios.create.mockReturnValue(apiClient);
  });

  it('should fetch teacher feedback', async () => {
    const data = [{ _id: 'f1', teacher: 't1', student: { name: 'S1' }, rating: 5, comment: 'Great' }];
    apiClient.get.mockResolvedValue({ data });

    const result = await feedbackService.getTeacherFeedback();

    expect(apiClient.get).toHaveBeenCalledWith('/feedback/teacher');
    expect(result).toEqual({ success: true, data });
  });

  it('should fetch all feedback', async () => {
    const data = [{ _id: 'f2', teacher: { name: 'T2' }, student: { name: 'S2' }, rating: 4, comment: 'Nice' }];
    apiClient.get.mockResolvedValue({ data });

    const result = await feedbackService.getAllFeedback();

    expect(apiClient.get).toHaveBeenCalledWith('/feedback/admin');
    expect(result).toEqual({ success: true, data });
  });

  it('should handle feedback API errors', async () => {
    apiClient.get.mockRejectedValue({ response: { data: { message: 'Bad Request' } } });

    const result = await feedbackService.getTeacherFeedback();

    expect(result).toEqual({ success: false, error: 'Bad Request' });
  });
});
