import axios from 'axios';

const API = axios.create({
  baseURL: 'https://lms-backend-pa1w.onrender.com/api'
});

export default API;