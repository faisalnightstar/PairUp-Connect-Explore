import React from "react";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";

const EditProfile = () => {
    const location = useLocation();
    const { user } = location.state || {}; // Get passed trip details

    console.log("edit user: ", user);
    const [formData, setFormData] = useState({
        username: "",
        fullName: "",
        email: "",
        phone: "",
    });
    const getValues = (e) => {
        let inputVal = e.target.value;
        let oldData = { ...formData };
        setFormData({ ...oldData, [e.target.name]: inputVal });
    };

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            //sending data in backend
            const response = await axios.patch(
                "http://localhost:8001/api/v1/users/update-account",
                formData,
                {
                    withCredentials: true,
                }
            );
            console.log("response: ", response);

            if (response.status === 200) {
                console.log("User Update successfully:", response.data);
                alert("Update successful!");
                navigate("/profile-details");
            } else {
                alert("Unexpected response from server. Please try again.");
            }
        } catch (error) {
            console.log("Error while updating user:", error.message);
            console.log("Error response:", error.response);
            alert("An error occurred during update. Please try again later.");
        }
    };
    return (
        <main>
            <div className="max-w-md mx-auto space-y-12 mt-20 bg-white p-8 rounded-lg shadow-md">
                <div className="flex space-y-3 flex-col items-center">
                    <h1 className="text-2xl font-bold text-center font-poppins">
                        Update Your Details
                    </h1>
                    <p className="text-paragraph-color text-center text-sm font-roboto mt-2">
                        Please fill in the information below to update your
                        profile.
                    </p>
                </div>
                <form action="" method="post" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        placeholder="Name"
                        autoComplete="name"
                        className="w-full p-2 mt-4 border-b-2 border-gray-300 shadow-sm rounded-b-md focus:outline-none focus:border-button-color"
                        required
                        onChange={getValues}
                        value={formData.fullName}
                    />
                    <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Username"
                        autoComplete="username"
                        className="w-full p-2 mt-4 border-b-2 border-gray-300 shadow-sm rounded-b-md focus:outline-none focus:border-button-color"
                        required
                        onChange={getValues}
                        value={formData.username}
                    />
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email"
                        autoComplete="email"
                        className="w-full p-2 mt-4 border-b-2 border-gray-300 shadow-sm rounded-b-md focus:outline-none focus:border-button-color"
                        required
                        onChange={getValues}
                        value={formData.email}
                    />

                    <input
                        type="tel"
                        name="phone"
                        id="phone"
                        placeholder="Phone Number"
                        autoComplete="tel"
                        className="w-full p-2 mt-4 border-b-2 border-gray-300 shadow-sm rounded-b-md focus:outline-none focus:border-button-color"
                        required
                        onChange={getValues}
                        value={formData.phone}
                    />

                    <button className="bg-button-color w-full px-8 py-3 shadow-black shadow-sm rounded-full text-white  text-xl mt-8 hover:cursor-pointer hover:bg-button-color-hover">
                        Update
                    </button>
                </form>
            </div>
        </main>
    );
};

export default EditProfile;
