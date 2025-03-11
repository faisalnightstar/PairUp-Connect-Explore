import { configureStore } from "@reduxjs/toolkit";
//import { authSlice } from "../features";
import authReducer from "../features/auth/authSlice.js";
import tripReducer from "../features/trip/tripSlice.js";

const store = configureStore({
    reducer: { auth: authReducer, trip: tripReducer },
});
export default store;
