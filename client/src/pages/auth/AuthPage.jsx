import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import TogglePanel from "./TogglePanel";

const AuthPage = () => {
    // active === true means registration view is active
    const [active, setActive] = useState(false);

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-gray-200 to-blue-200">
            <div className="relative w-[850px] h-[550px] bg-white rounded-[30px] shadow-lg overflow-hidden">
                {/* Login Form (visible when not active) */}
                <div
                    className={`absolute w-1/2 h-full flex flex-col items-center justify-center text-center p-10 transition-all duration-700 ${
                        active ? "right-1/2" : "right-0"
                    }`}
                >
                    <LoginForm />
                </div>

                {/* Registration Form (visible when active) */}
                <div
                    className={`absolute w-1/2 h-full flex flex-col items-center justify-center text-center p-10 transition-all duration-700 ${
                        active ? "right-0 visible" : "right-0 invisible"
                    }`}
                >
                    <RegisterForm />
                </div>

                {/* Toggle Box with animated background circle and panels */}
                <div className="absolute w-full h-full top-0 left-0">
                    <div className="relative w-full h-full">
                        {/* Animated Background Circle */}
                        <div
                            className={`absolute transition-all duration-[1800ms] ease-in-out z-10 left-[-250%] w-[300%] h-full bg-blue-500 rounded-[150px] ${
                                active ? "left-[50%]" : ""
                            }`}
                        ></div>
                        {/* Left Toggle Panel */}
                        <TogglePanel
                            position={active ? "left-[-50%]" : "left-0"}
                            title="Hello, Welcome!"
                            text="Don't have an account?"
                            buttonText="Register"
                            onClick={() => setActive(true)}
                        />
                        {/* Right Toggle Panel */}
                        <TogglePanel
                            position={active ? "right-0" : "right-[-50%]"}
                            title="Welcome Back!"
                            text="Already have an account?"
                            buttonText="Login"
                            onClick={() => setActive(false)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
