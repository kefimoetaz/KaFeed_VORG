import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});

// Add token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data)
};

export const userAPI = {
  getProfile: (id) => API.get(`/users/${id}`),
  updateProfile: (data) => API.put('/users/profile', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  follow: (id) => API.post(`/users/${id}/follow`),
  unfollow: (id) => API.delete(`/users/${id}/follow`),
  search: (query) => API.get(`/users/search?q=${query}`),
  getSuggested: () => API.get('/users/suggested')
};

export const postAPI = {
  create: (data) => API.post('/posts', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getFeed: () => API.get('/posts/feed'),
  getExploreFeed: () => API.get('/posts/explore'),
  getUserPosts: (userId) => API.get(`/posts/user/${userId}`),
  delete: (id) => API.delete(`/posts/${id}`),
  like: (id) => API.post(`/posts/${id}/like`),
  repost: (id, data) => API.post(`/posts/${id}/repost`, data)
};

export const commentAPI = {
  create: (postId, data) => API.post(`/comments/${postId}`, data),
  get: (postId) => API.get(`/comments/${postId}`),
  delete: (id) => API.delete(`/comments/${id}`)
};

export const messageAPI = {
  send: (data) => API.post('/messages', data),
  getConversations: () => API.get('/messages/conversations'),
  getConversation: (userId) => API.get(`/messages/${userId}`),
  getUnreadCount: () => API.get('/messages/unread-count')
};

export const storyAPI = {
  create: (data) => API.post('/stories', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAll: () => API.get('/stories'),
  delete: (id) => API.delete(`/stories/${id}`)
};

export default API;
