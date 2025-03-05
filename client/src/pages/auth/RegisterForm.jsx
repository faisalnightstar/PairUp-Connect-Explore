import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { registerUser } from "../../features/auth/authSlice";

const RegisterForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
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
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <h1 className="text-3xl font-bold mb-4">Registration</h1>
            <div className="relative my-6">
                <input
                    type="text"
                    placeholder="Username"
                    className="w-full p-4 pl-5 bg-gray-200 rounded-lg outline-none"
                    {...register("regUsername", {
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
                    {...register("email", { required: "Email is required" })}
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
                    {...register("regPassword", {
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
            <p className="mt-4 text-sm">or register with social platforms</p>
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

export default RegisterForm;
