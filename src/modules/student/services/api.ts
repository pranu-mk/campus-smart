const API_BASE_URL = 'http://localhost:5000/api';

const getAuthToken = () => localStorage.getItem('token');

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: any = getAuthHeaders();

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
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
  create: async (complaintData: any) => apiRequest('/student/complaints', { 
    method: 'POST', 
    body: complaintData 
  }),
  getAll: async (page = 1, limit = 10) => apiRequest(`/student/complaints?page=${page}&limit=${limit}`),
  getStats: async () => apiRequest('/student/complaints/stats'),
  getRecent: async (limit = 5) => apiRequest(`/student/complaints/recent?limit=${limit}`),
  getById: async (complaintId: string) => apiRequest(`/student/complaints/${complaintId}`),
};

// FIXED: Added getNotices to match your Digital Notice Board page
export const noticeAPI = {
  getNotices: async (limit = 20) => apiRequest(`/student/notices?limit=${limit}`),
  getAll: async (limit = 10) => apiRequest(`/student/notices?limit=${limit}`),
};

export const notificationAPI = {
  getAll: async (limit = 20) => apiRequest(`/student/notifications?limit=${limit}`),
  markAsRead: async (id: string) => apiRequest(`/student/notifications/${id}/read`, { method: 'PUT' }),
  markAllAsRead: async () => apiRequest('/student/notifications/read-all', { method: 'PUT' }),
};

export const dashboardAPI = {
  getDashboardData: async () => apiRequest('/student/dashboard'),
  
  updateProfile: async (userData: { fullName: string; mobileNumber: string; username: string }) => {
    return apiRequest('/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
  // Add this to your dashboardAPI object
getPlacements: async () => {
  const response = await fetch('http://localhost:5000/api/placements/upcoming');
  return response.json();
},
  changePassword: async (passwordData: { oldPassword: string; newPassword: any }) => {
    return apiRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }
};

export const clubAPI = {
  getAll: async () => apiRequest('/student/clubs'),
  join: async (clubId: string) => apiRequest('/student/clubs/join', {
    method: 'POST',
    body: JSON.stringify({ clubId }),
  }),
  leave: async (clubId: string) => apiRequest(`/student/clubs/leave/${clubId}`, {
    method: 'DELETE',
  }),
};

export const pollAPI = {
  getAll: async () => apiRequest('/student/polls'),
  submitVote: async (pollId: string, optionId: string) => apiRequest('/student/polls/vote', {
    method: 'POST',
    body: JSON.stringify({ pollId, optionId }),
  }),
};

export const placementAPI = {
  getAll: async () => apiRequest('/student/placements'),
  getStats: async () => apiRequest('/student/placements/stats'),
  apply: async (placementId: string) => apiRequest('/student/placements/apply', {
    method: 'POST',
    body: JSON.stringify({ placementId }),
  }),
};

export const eventAPI = {
  getAll: async () => apiRequest('/student/events'),
  getUpcoming: async () => apiRequest('/student/events/upcoming'),
  register: async (eventId: string) => apiRequest('/student/events/register', {
    method: 'POST',
    body: JSON.stringify({ eventId }),
  }),
};

export const lostFoundAPI = {
  getAll: async () => apiRequest('/student/lost-found'),
  claim: async (id: string) => apiRequest(`/student/lost-found/${id}/claim`, { 
    method: 'PUT' 
  }),
  create: async (itemData: { 
    type: string; 
    title: string; 
    description: string; 
    category: string; 
    item_date: string 
  }) => {
    return apiRequest('/student/lost-found', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  }
};

export default {
  complaint: complaintAPI,
  notice: noticeAPI,
  notification: notificationAPI,
  dashboard: dashboardAPI,
  lostFound: lostFoundAPI,
  event: eventAPI,
  club: clubAPI,
  poll: pollAPI,
  placement: placementAPI,
};