import React, { forwardRef, useId } from "react";

const Input = ({ label, type = "text", className = "", ...props }, ref) => {
    const id = useId();
    return (
        <div>
            {label && (
                <label
                    className="inline-block justify-start text-start mb-1 pl-1"
                    htmlFor={id}
                >
                    {label}
                </label>
            )}

            <input
                type={type}
                className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-200 duration-200 border border-gray-200 w-full ${className}`}
                ref={ref}
                {...props}
                id={id}
            />
        </div>
    );
};

export default forwardRef(Input);
