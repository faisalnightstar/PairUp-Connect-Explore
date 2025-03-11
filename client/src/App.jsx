import "../axiosConfig.js";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { Header, Navbar } from "./components/index.js";
import { getCurrentLoggedInUser } from "./features/auth/authSlice.js";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        // Fetch authenticated user on app load
        dispatch(getCurrentLoggedInUser());
    }, [dispatch]);
    return (
        <div>
            <Header />
            <main>
                <Outlet />
            </main>
            <Navbar />
        </div>
    );
}

export default App;

// <Routes>
//             <Route path="/login" element={<LoginPage />} />
//             <Route path="/register" element={<RegisterPage />} />
//             <Route
//                 path="/trip"
//                 element={
//                     <ProtectedRoute>
//                         <TripPage />
//                     </ProtectedRoute>
//                 }
//             />
//              <Route
//                 path="/user-profile"
//                 element={
//                     <ProtectedRoute>
//                         <UserProfile />
//                     </ProtectedRoute>
//                 }
//             />
//         </Routes>
