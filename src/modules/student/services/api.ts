const API_BASE_URL = 'http://localhost:5000/api';

const getAuthToken = () => localStorage.getItem('token');

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: getAuthHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'API request failed');
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

export const complaintAPI = {
  create: async (complaintData: any) => apiRequest('/student/complaints', { method: 'POST', body: JSON.stringify(complaintData) }),
  getAll: async (page = 1, limit = 10) => apiRequest(`/student/complaints?page=${page}&limit=${limit}`),
  getStats: async () => apiRequest('/student/complaints/stats'),
  getRecent: async (limit = 5) => apiRequest(`/student/complaints/recent?limit=${limit}`),
  getById: async (complaintId: string) => apiRequest(`/student/complaints/${complaintId}`),
};

export const noticeAPI = {
  getAll: async (limit = 10) => apiRequest(`/student/notices?limit=${limit}`),
};

export const notificationAPI = {
  getAll: async (limit = 20) => apiRequest(`/student/notifications?limit=${limit}`),
  markAsRead: async (id: string) => apiRequest(`/student/notifications/${id}/read`, { method: 'PUT' }),
  markAllAsRead: async () => apiRequest('/student/notifications/read-all', { method: 'PUT' }),
};

export const dashboardAPI = {
  getDashboardData: async () => apiRequest('/student/dashboard'),
  
  // NEW: Update function added here
  updateProfile: async (userData: { fullName: string; mobileNumber: string; username: string }) => {
    return apiRequest('/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }
};

export default {
  complaint: complaintAPI,
  notice: noticeAPI,
  notification: notificationAPI,
  dashboard: dashboardAPI,
};