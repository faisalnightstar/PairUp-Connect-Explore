import React from "react";

const TogglePanel = ({ position, title, text, buttonText, onClick }) => {
    return (
        <div
            className={`absolute w-1/2 h-full flex flex-col justify-center items-center z-20 transition-all duration-700 ${position}`}
        >
            <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
            <p className="text-white mb-4">{text}</p>
            <button
                onClick={onClick}
                className="w-40 h-12 bg-transparent border-2 border-white text-white rounded hover:bg-white hover:text-blue-500 transition-colors duration-300"
            >
                {buttonText}
            </button>
        </div>
    );
};

export default TogglePanel;
