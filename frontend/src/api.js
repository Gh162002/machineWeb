import axios from 'axios';

// Remove trailing slash to avoid double-slash issues with path concatenation
const baseURL = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');

const api = axios.create({
  baseURL,
});

export default api;
