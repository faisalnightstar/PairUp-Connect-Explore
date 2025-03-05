import axios from "axios";
import store from "./store"; // Import your Redux store
import { logoutUser, setUserData } from "./features/user/userSlice";

const api = axios.create({
    baseURL: "http://localhost:8001/api/v1", // Your API base URL
});

// Request interceptor to add access token to headers
api.interceptors.request.use(
    (config) => {
        const { user } = store.getState().user;
        if (user && user.accessToken) {
            config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration and refresh
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const { user } = store.getState().user;
            if (user && user.refreshToken) {
                try {
                    const response = await axios.post("/refresh-token", {
                        refreshToken: user.refreshToken,
                    });
                    const { accessToken } = response.data;
                    store.dispatch(setUserData({ ...user, accessToken })); // Update Redux state with new access token
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest); // Retry the original request
                } catch (refreshError) {
                    store.dispatch(logoutUser()); // Refresh token expired, log out user
                    return Promise.reject(refreshError);
                }
            } else {
                store.dispatch(logoutUser()); // No refresh token, log out user
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
