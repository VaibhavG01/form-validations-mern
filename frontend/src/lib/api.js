import axios from 'axios';

const api = axios.create({
    baseURL: 'https://form-validations-mern.onrender.com/api',
    timeout: 5000,  // Increased timeout to 5 seconds
    withCredentials: true,  // Enable sending cookies with requests
});

export default api;
