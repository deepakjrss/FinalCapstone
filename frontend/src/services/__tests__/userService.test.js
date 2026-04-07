import axios from 'axios';
import userService from '../userService';

jest.mock('axios');

describe('userService', () => {
  let apiClient;

  beforeEach(() => {
    apiClient = {
      get: jest.fn(),
      post: jest.fn(),
      delete: jest.fn()
    };
    axios.create.mockReturnValue(apiClient);
  });

  it('should fetch deleted users', async () => {
    const responseData = [{ _id: '1', name: 'Deleted User' }];
    apiClient.get.mockResolvedValue({ data: responseData });

    const result = await userService.getDeletedUsers();

    expect(apiClient.get).toHaveBeenCalledWith('/users/deleted');
    expect(result).toEqual({ success: true, data: responseData });
  });

  it('should handle deleted users fetch failure', async () => {
    apiClient.get.mockRejectedValue({ response: { data: { message: 'Failed' } } });

    const result = await userService.getDeletedUsers();

    expect(result).toEqual({ success: false, error: 'Failed' });
  });

  it('should restore a user', async () => {
    apiClient.post.mockResolvedValue({ data: { success: true } });

    const result = await userService.restoreUser('123');

    expect(apiClient.post).toHaveBeenCalledWith('/users/restore/123');
    expect(result).toEqual({ success: true, data: { success: true } });
  });

  it('should fetch teachers', async () => {
    apiClient.get.mockResolvedValue({ data: [{ _id: 't1', name: 'Teacher1', email: 't1@example.com' }] });

    const result = await userService.getTeachers();

    expect(apiClient.get).toHaveBeenCalledWith('/users/teachers');
    expect(result).toEqual({ success: true, data: [{ _id: 't1', name: 'Teacher1', email: 't1@example.com' }] });
  });
});
