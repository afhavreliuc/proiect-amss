import axios from 'axios';

// You can set a default base URL for your server if needed
const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add authorization header if token is present
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
