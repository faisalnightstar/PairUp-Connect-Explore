import React from "react";
import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";
import { logoutUser } from "../features/auth/authSlice";

const LogoutBtn = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate("/login");
    };
    return (
        <button
            className="bg-button-color p-1 px-4 rounded-full hover:cursor-pointer hover:bg-button-color-hover text-white  text-xs"
            onClick={handleLogout}
        >
            Logout
        </button>
    );
};

export default LogoutBtn;
