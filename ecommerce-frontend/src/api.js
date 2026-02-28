// Not used in frontend-only mode.
// When backend is ready, replace dummy data with real API calls using axios here.
//export default {};
//import axios from 'axios';

//const api = axios.create({
  //baseURL: 'http://localhost:5000/api', // change in production
//});

// Attach token if it exists
//api.interceptors.request.use((config) => {
  //const token = localStorage.getItem('admin_token');
  //if (token) config.headers['x-auth-token'] = token;
  //return config;
//});

//export default api;
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers['x-auth-token'] = token;
  return config;
});

export default api;