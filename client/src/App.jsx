import "../axiosConfig.js";
import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { LoginPage, RegisterPage } from "./pages/index.js";
import { Navbar } from "./components/index.js";

function App() {
    return (
        <div>
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
