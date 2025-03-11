import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Loader } from "../components/index.js";
import { getCurrentLoggedInUser } from "../features/auth/authSlice.js";

const ProtectedRoute = ({ children }) => {
    const dispatch = useDispatch();
    const { isAuthenticated, loading, initialized } = useSelector(
        (state) => state.auth
    );

    // Wait until the authentication state has been checked
    if (!initialized || loading) {
        return <Loader />;
    }
    // If not authenticated after loading, redirect to login
    if (!isAuthenticated) {
        //dispatch(getCurrentLoggedInUser());
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
