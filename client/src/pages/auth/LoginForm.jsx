import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loginUser } from "../../features/auth/authSlice";

const LoginForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post("/api/login", {
                username: data.loginUsername,
                password: data.loginPassword,
            });
            dispatch(loginUser(response.data));
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <h1 className="text-3xl font-bold mb-4">Login</h1>
            <div className="relative my-6">
                <input
                    type="text"
                    placeholder="Username"
                    className="w-full p-4 pl-5 bg-gray-200 rounded-lg outline-none"
                    {...register("loginUsername", {
                        required: "Username is required",
                    })}
                />
                <i className="absolute right-5 top-1/2 transform -translate-y-1/2 bx bxs-user"></i>
                {errors.loginUsername && (
                    <p className="text-red-500 text-sm">
                        {errors.loginUsername.message}
                    </p>
                )}
            </div>
            <div className="relative my-6">
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-4 pl-5 bg-gray-200 rounded-lg outline-none"
                    {...register("loginPassword", {
                        required: "Password is required",
                    })}
                />
                <i className="absolute right-5 top-1/2 transform -translate-y-1/2 bx bxs-lock-alt"></i>
                {errors.loginPassword && (
                    <p className="text-red-500 text-sm">
                        {errors.loginPassword.message}
                    </p>
                )}
            </div>
            <div className="mb-6">
                <a href="#" className="text-sm text-gray-600">
                    Forgot Password?
                </a>
            </div>
            <button
                type="submit"
                className="w-full h-12 bg-blue-500 rounded-full shadow text-white font-semibold"
            >
                Login
            </button>
            <p className="mt-4 text-sm">or login with social platforms</p>
            <div className="flex justify-center space-x-4 mt-4">
                <a href="#" className="p-2 border border-gray-300 rounded">
                    <i className="bx bxl-google"></i>
                </a>
                <a href="#" className="p-2 border border-gray-300 rounded">
                    <i className="bx bxl-facebook"></i>
                </a>
                <a href="#" className="p-2 border border-gray-300 rounded">
                    <i className="bx bxl-github"></i>
                </a>
                <a href="#" className="p-2 border border-gray-300 rounded">
                    <i className="bx bxl-linkedin"></i>
                </a>
            </div>
        </form>
    );
};

export default LoginForm;
