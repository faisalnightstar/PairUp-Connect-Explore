import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider, useSelector, useDispatch } from "react-redux";
import store from "./store/store.js";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import {
    AuthPage,
    Discover,
    Home,
    LoginPage,
    MessagePage,
    ProfilesDetails,
    RegisterPage,
    TripForm,
    UserProfile,
} from "./pages/index.js";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/register",
                element: <RegisterPage />,
            },
            {
                path: "/login",
                element: <LoginPage />,
            },

            {
                path: "/discover",
                element: <Discover />,
            },
            {
                path: "/post-trip",
                element: (
                    <ProtectedRoute>
                        <TripForm />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/msg",

                element: (
                    <ProtectedRoute>
                        <MessagePage />,
                    </ProtectedRoute>
                ),
            },
            {
                path: "/profile",

                element: (
                    <ProtectedRoute>
                        <UserProfile />,
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </StrictMode>
);
