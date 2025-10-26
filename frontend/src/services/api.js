/**
 * API Service for AI Email Assistant
 * Handles all backend communication
 */
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Email API Service
 */
export const emailApi = {
  /**
   * Process a single email
   */
  processEmail: async (emailData) => {
    try {
      const response = await apiClient.post('/email/process', emailData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Process multiple emails in batch
   */
  processBatch: async (userId, emails) => {
    try {
      const response = await apiClient.post('/email/batch', {
        user_id: userId,
        emails: emails,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get all emails for a user
   */
  getEmails: async (userId, filters = {}) => {
    try {
      const params = { user_id: userId, ...filters };
      const response = await apiClient.get('/emails', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a specific email by ID
   */
  getEmailById: async (emailId, userId) => {
    try {
      const response = await apiClient.get(`/emails/${emailId}`, {
        params: { user_id: userId },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete an email
   */
  deleteEmail: async (emailId, userId) => {
    try {
      const response = await apiClient.delete(`/emails/${emailId}`, {
        params: { user_id: userId },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get email statistics
   */
  getStats: async (userId) => {
    try {
      const response = await apiClient.get('/stats', {
        params: { user_id: userId },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Health check
   */
  healthCheck: async () => {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

/**
 * Handle API errors
 */
function handleApiError(error) {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    return {
      status,
      message: data.error || data.message || 'An error occurred',
      details: data,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      status: 0,
      message: 'No response from server. Please check your connection.',
      details: error.message,
    };
  } else {
    // Something else happened
    return {
      status: 0,
      message: error.message || 'An unexpected error occurred',
      details: error,
    };
  }
}

export default emailApi;
