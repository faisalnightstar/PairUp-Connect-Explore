// Signup.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "../../components";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../features/auth/authSlice";

const RegisterPage = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    // Watch password for confirm password validation
    const password = watch("password", "");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onSubmit = async (credentials) => {
        console.log("Signup data:", credentials);

        try {
            // Dispatch the registration thunk
            const regResult = await dispatch(registerUser(credentials));
            if (registerUser.fulfilled.match(regResult)) {
                navigate("/login");
                // If registration was successful, dispatch login using the same credentials.
                // const loginResult = await dispatch(
                //     loginUser({
                //         // Use the same credentials or a subset required for login
                //         email: credentials.email,
                //         password: credentials.password,
                //     })
                // );

                // if (loginUser.fulfilled.match(loginResult)) {
                //     // If login was successful, navigate to the home page
                //     navigate("/");
                // } else {
                //     // Handle login failure if needed
                //     console.error("Login failed after registration");
                // }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Input
                        label="Full Name"
                        placeholder="Enter your full name"
                        {...register("fullName", {
                            required: "Full Name is required",
                        })}
                    />
                    {errors.fullName && (
                        <p className="text-red-500 text-sm">
                            {errors.fullName.message}
                        </p>
                    )}
                </div>

                <div>
                    <Input
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        {...register("email", {
                            required: "Email is required",
                        })}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div>
                    <Input
                        label="Phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        {...register("phone", {
                            required: "Phone number is required",
                        })}
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-sm">
                            {errors.phone.message}
                        </p>
                    )}
                </div>

                <div>
                    <Input
                        label="Username"
                        placeholder="Enter your username"
                        {...register("username", {
                            required: "Username is required",
                        })}
                    />
                    {errors.username && (
                        <p className="text-red-500 text-sm">
                            {errors.username.message}
                        </p>
                    )}
                </div>

                <div>
                    <Input
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message:
                                    "Password must be at least 6 characters long",
                            },
                        })}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <div>
                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="Confirm your password"
                        {...register("confirmPassword", {
                            required: "Confirm Password is required",
                            validate: (value) =>
                                value === password || "Passwords do not match",
                        })}
                    />
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
