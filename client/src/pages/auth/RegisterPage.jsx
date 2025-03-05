import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loginUser, registerUser } from "../../features/auth/authSlice.js";

const AuthPage = () => {
    // active === true means "registration" is shown (container has .active)
    const [active, setActive] = useState(false);
    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // API call for login
    const onSubmitLogin = async (data) => {
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

    // API call for registration
    const onSubmitRegister = async (data) => {
        try {
            const response = await axios.post("/api/register", {
                username: data.regUsername,
                email: data.email,
                password: data.regPassword,
            });
            dispatch(registerUser(response.data));
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-gray-200 to-blue-200">
            <div className="relative w-[850px] h-[550px] bg-white rounded-[30px] shadow-lg overflow-hidden">
                {/* Login Form (initially visible) */}
                <div
                    className={`absolute w-1/2 h-full flex flex-col items-center justify-center text-center p-10 transition-all duration-700 ${
                        active ? "right-1/2" : "right-0"
                    }`}
                >
                    <form
                        onSubmit={handleSubmit(onSubmitLogin)}
                        className="w-full"
                    >
                        <h1 className="text-3xl font-bold mb-4">Login</h1>
                        <div className="relative my-6">
                            <input
                                type="text"
                                placeholder="Username"
                                className="w-full p-4 pl-5 bg-gray-200 rounded-lg outline-none"
                                {...registerField("loginUsername", {
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
                                {...registerField("loginPassword", {
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
                            className="w-full h-12 bg-blue-500 rounded-lg shadow text-white font-semibold"
                        >
                            Login
                        </button>
                        <p className="mt-4 text-sm">
                            or login with social platforms
                        </p>
                        <div className="flex justify-center space-x-4 mt-4">
                            <a
                                href="#"
                                className="p-2 border border-gray-300 rounded"
                            >
                                <i className="bx bxl-google"></i>
                            </a>
                            <a
                                href="#"
                                className="p-2 border border-gray-300 rounded"
                            >
                                <i className="bx bxl-facebook"></i>
                            </a>
                            <a
                                href="#"
                                className="p-2 border border-gray-300 rounded"
                            >
                                <i className="bx bxl-github"></i>
                            </a>
                            <a
                                href="#"
                                className="p-2 border border-gray-300 rounded"
                            >
                                <i className="bx bxl-linkedin"></i>
                            </a>
                        </div>
                    </form>
                </div>

                {/* Registration Form (initially hidden) */}
                <div
                    className={`absolute w-1/2 h-full flex flex-col items-center justify-center text-center p-10 transition-all duration-700 ${
                        active ? "right-0 visible" : "right-0 invisible"
                    }`}
                >
                    <form
                        onSubmit={handleSubmit(onSubmitRegister)}
                        className="w-full"
                    >
                        <h1 className="text-3xl font-bold mb-4">
                            Registration
                        </h1>
                        <div className="relative my-6">
                            <input
                                type="text"
                                placeholder="Username"
                                className="w-full p-4 pl-5 bg-gray-200 rounded-lg outline-none"
                                {...registerField("regUsername", {
                                    required: "Username is required",
                                })}
                            />
                            <i className="absolute right-5 top-1/2 transform -translate-y-1/2 bx bxs-user"></i>
                            {errors.regUsername && (
                                <p className="text-red-500 text-sm">
                                    {errors.regUsername.message}
                                </p>
                            )}
                        </div>
                        <div className="relative my-6">
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full p-4 pl-5 bg-gray-200 rounded-lg outline-none"
                                {...registerField("email", {
                                    required: "Email is required",
                                })}
                            />
                            <i className="absolute right-5 top-1/2 transform -translate-y-1/2 bx bxs-envelope"></i>
                            {errors.email && (
                                <p className="text-red-500 text-sm">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className="relative my-6">
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full p-4 pl-5 bg-gray-200 rounded-lg outline-none"
                                {...registerField("regPassword", {
                                    required: "Password is required",
                                })}
                            />
                            <i className="absolute right-5 top-1/2 transform -translate-y-1/2 bx bxs-lock-alt"></i>
                            {errors.regPassword && (
                                <p className="text-red-500 text-sm">
                                    {errors.regPassword.message}
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full h-12 bg-blue-500 rounded-lg shadow text-white font-semibold"
                        >
                            Register
                        </button>
                        <p className="mt-4 text-sm">
                            or register with social platforms
                        </p>
                        <div className="flex justify-center space-x-4 mt-4">
                            <a
                                href="#"
                                className="p-2 border border-gray-300 rounded"
                            >
                                <i className="bx bxl-google"></i>
                            </a>
                            <a
                                href="#"
                                className="p-2 border border-gray-300 rounded"
                            >
                                <i className="bx bxl-facebook"></i>
                            </a>
                            <a
                                href="#"
                                className="p-2 border border-gray-300 rounded"
                            >
                                <i className="bx bxl-github"></i>
                            </a>
                            <a
                                href="#"
                                className="p-2 border border-gray-300 rounded"
                            >
                                <i className="bx bxl-linkedin"></i>
                            </a>
                        </div>
                    </form>
                </div>

                {/* Toggle Box (with background circle and panels) */}
                <div className="absolute w-full h-full top-0 left-0">
                    <div className="relative w-full h-full">
                        {/* Background Circle (mimics .toggle-box::before) */}
                        <div
                            className={`absolute transition-all duration-[1800ms] ease-in-out z-10 left-[-250%] w-[300%] h-full bg-blue-500 rounded-[150px] ${
                                active ? "left-[50%]" : ""
                            }`}
                        ></div>
                        {/* Left Toggle Panel */}
                        <div
                            className={`absolute w-1/2 h-full flex flex-col justify-center items-center z-20 transition-all duration-700 ${
                                active ? "left-[-50%]" : "left-0"
                            }`}
                        >
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Hello, Welcome!
                            </h1>
                            <p className="text-white mb-4">
                                Don't have an account?
                            </p>
                            <button
                                onClick={() => setActive(true)}
                                className="w-40 h-12 bg-transparent border-2 border-white text-white rounded hover:bg-white hover:text-blue-500 transition-colors duration-300"
                            >
                                Register
                            </button>
                        </div>
                        {/* Right Toggle Panel */}
                        <div
                            className={`absolute w-1/2 h-full flex flex-col justify-center items-center z-20 transition-all duration-700 ${
                                active ? "right-0" : "right-[-50%]"
                            }`}
                        >
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Welcome Back!
                            </h1>
                            <p className="text-white mb-4">
                                Already have an account?
                            </p>
                            <button
                                onClick={() => setActive(false)}
                                className="w-40 h-12 bg-transparent border-2 border-white text-white rounded hover:bg-white hover:text-blue-500 transition-colors duration-300"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
