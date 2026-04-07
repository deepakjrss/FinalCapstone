import api from '../utils/api';

// Certificate Service
const certificateService = {
  /**
   * Download eco excellence certificate (PDF)
   * @returns {Promise} Downloads PDF file
   */
  downloadCertificate: async () => {
    try {
      const response = await api.get('/certificates/download', {
        responseType: 'blob'
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Eco-Excellence-Certificate.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();

      return {
        success: true,
        message: 'Certificate downloaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },
};

export default certificateService;