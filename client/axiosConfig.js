// axiosConfig.js
import axios from "axios";
import store from "./src/store/store.js";
import {
    refreshAccessToken,
    clearAuthState,
} from "./src/features/auth/authSlice.js";

axios.defaults.withCredentials = true; // ensure cookies are sent if needed

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error status is 401 and we haven't retried yet
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            try {
                const state = store.getState();
                const refreshToken = state.auth.refreshToken;
                if (!refreshToken)
                    throw new Error("No refresh token available");
                const result = await store.dispatch(
                    refreshAccessToken(refreshToken)
                );
                if (result.error) throw new Error("Refresh token expired");
                // Set the new token in the default headers and retry the request
                axios.defaults.headers.common["Authorization"] =
                    `Bearer ${result.payload.accessToken}`;
                originalRequest.headers["Authorization"] =
                    `Bearer ${result.payload.accessToken}`;
                return axios(originalRequest);
            } catch (err) {
                // Clear auth state or redirect to login if refresh fails
                store.dispatch(clearAuthState());
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default axios;
