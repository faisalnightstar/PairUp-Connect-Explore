import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.withCredentials = true;

// Login thunk: credentials { email, username, password }
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials, { rejectWithValue }) => {
        try {
            //sending data in backend
            const response = await axios.post(
                "http://localhost:8001/api/v1/users/login",
                credentials
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

//Registration thunk: credentials { email, username, password }
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "http://localhost:8001/api/v1/users/register",
                credentials,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Refresh token thunk: expects the refresh token value
export const refreshAccessToken = createAsyncThunk(
    "auth/refreshAccessToken",
    async (refreshToken, { rejectWithValue }) => {
        try {
            const response = await axios.post("/refresh-accessToken", {
                refreshToken,
            });
            // Expect { accessToken } in response.data
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Logout thunk: In many cases logout can be just a call to /logout endpoint
export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post("/logout");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    status: false,
    user: null,
    accessToken: null,
    refreshToken: null,
    loading: false,
    error: null,
    isAuthenticated: false,
};

// features/auth/authSlice.js (continued)
// const initialState = {
//     user: null,
//     accessToken: null,
//     refreshToken: null,
//     loading: false,
//     error: null,
//   };

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // In addition to logout thunk, you can define a manual logout action
        clearAuthState(state) {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // --- Login User ---
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.status = true;
                // Assuming response.data structure: { user, accessToken, refreshToken }
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Login failed";
            })

            // --- Register User ---
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.status = true;
                // Optionally, auto-login the user after registration
                state.user = action.payload.data;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Registration failed";
            })

            // --- Refresh Access Token ---
            .addCase(refreshAccessToken.fulfilled, (state, action) => {
                state.accessToken = action.payload.accessToken;
            })
            .addCase(refreshAccessToken.rejected, (state, action) => {
                state.error = action.payload || "Token refresh failed";
            })

            // --- Logout User ---
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
            });
    },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;
