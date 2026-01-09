import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    let token = localStorage.getItem('token');
    if (token) {
        token = token.trim().replace(/[^\x00-\x7F]/g, "");
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Response interceptor for handling 401 errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear auth data and redirect to login
            const authKeys = ['token', 'tenantId', 'userId', 'name', 'role', 'user'];
            authKeys.forEach(key => localStorage.removeItem(key));

            const currentUrl = window.location.href;
            const loginUrl = 'https://signin.tclaccord.com';
            const redirectParam = encodeURIComponent(currentUrl);
            window.location.href = `${loginUrl}/?redirect=${redirectParam}`;
        }
        return Promise.reject(error);
    }
);

const apiClientContact = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL_CONTACT || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClientContact.interceptors.request.use((config) => {
    let token = localStorage.getItem('token');
    if (token) {
        token = token.trim().replace(/[^\x00-\x7F]/g, "");
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Response interceptor for handling 401 errors
apiClientContact.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear auth data and redirect to login
            const authKeys = ['token', 'tenantId', 'userId', 'name', 'role', 'user'];
            authKeys.forEach(key => localStorage.removeItem(key));

            const currentUrl = window.location.href;
            const loginUrl = 'https://signin.tclaccord.com';
            const redirectParam = encodeURIComponent(currentUrl);
            window.location.href = `${loginUrl}/?redirect=${redirectParam}`;
        }
        return Promise.reject(error);
    }
);

export { apiClientContact };

export default apiClient;
