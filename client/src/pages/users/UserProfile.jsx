// UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Loader, Navbar } from "../../components";

import UserDetails from "./UserDetails";
import UserTripsDetails from "./UserTripsDetails";
import UserReviewsDeatils from "./UserReviewsDeatils";
import YourProfile from "./YourProfile";
import NullTrips from "./NullTrips";
import { Link } from "react-router-dom";

const UserProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [activeComponent, setActiveComponent] = useState("details");

    const userLocale = navigator.language || "en-US"; // Auto-detect user locale

    const joinedDate = (isoDate) => {
        if (!isoDate) return "N/A";
        const date = new Date(isoDate);
        return new Intl.DateTimeFormat(userLocale, {
            year: "numeric",
            month: "long",
        }).format(date);
    };

    const { user, isAuthenticated, loading, error } = useSelector(
        (state) => state.auth
    );

    console.log("user: ", user);

    // Redirect to login if not authenticated.
    useEffect(() => {
        // dispatch(getCurrentLoggedInUser());
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    if (loading) return <Loader />;
    if (!user) return <p>No user data found.</p>;

    return (
        <div className="mt-0">
            {user ? (
                <main className="max-w-8xl mx-auto p-6 mt-16">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col  mx-10 bg-background">
                            <h1 className="font-roboto text-xl font-bold sm:text-md">
                                Your Profile
                            </h1>
                            {error && <p className="text-red-500">{error}</p>}
                            <YourProfile
                                user={user}
                                joinedDate={joinedDate}
                                isCurrentUser={true}
                            />
                        </div>
                        <div className=" ">
                            <Link
                                to={{
                                    pathname: "/edit-profile",
                                    state: { userData: user },
                                }}
                                className="bg-button-color p-1 px-4 rounded-full hover:cursor-pointer hover:bg-button-color-hover text-white  text-xs"
                            >
                                Edit Profile
                            </Link>
                        </div>
                    </div>

                    <nav>
                        <div>
                            {/* Navigation Buttons */}
                            <div className="space-x-6 mb-4">
                                <button
                                    onClick={() =>
                                        setActiveComponent("details")
                                    }
                                    className={`pb-2 text-sm font-poppins font-medium hover:cursor-pointer  ${
                                        activeComponent === "details"
                                            ? "text-button-color border-b-2 "
                                            : "text-paragraph-color"
                                    }`}
                                >
                                    Details
                                </button>
                                <button
                                    onClick={() => setActiveComponent("trips")}
                                    className={`pb-2 text-sm font-poppins font-medium hover:cursor-pointer  ${
                                        activeComponent === "trips"
                                            ? "text-button-color border-b-2 "
                                            : "text-paragraph-color"
                                    }`}
                                >
                                    Trips
                                </button>
                                <button
                                    onClick={() => setActiveComponent("review")}
                                    className={`pb-2 text-sm font-poppins font-medium hover:cursor-pointer ${
                                        activeComponent === "review"
                                            ? "text-button-color border-b-2 "
                                            : "text-paragraph-color"
                                    }`}
                                >
                                    Reviews
                                </button>
                            </div>

                            {/* Render Selected Component */}
                            <div className="w-full p-4 border border-gray-200 rounded-lg shadow-md">
                                {activeComponent === "details" && (
                                    <UserDetails userDetail={user} />
                                )}
                                {/* {user ? ({activeComponent === "trips" && (
                                <UserTripsDetails />) }
                            ) : (
                                
                            )} */}
                                {activeComponent === "trips" && <NullTrips />}
                                {activeComponent === "review" && (
                                    <UserReviewsDeatils
                                        userDetail={user}
                                        joinedDate={joinedDate}
                                    />
                                )}
                            </div>
                        </div>
                    </nav>
                </main>
            ) : (
                <Loader />
            )}
        </div>
    );

    // return (
    //     <div className="user-profile">
    //         <h2>User Profile</h2>
    //         {error && <p className="error">{error}</p>}
    //         <div className="profile-details">
    //             {user.avatar && (
    //                 <img
    //                     src={user.avatar}
    //                     alt={`${user.fullName} avatar`}
    //                     style={{
    //                         width: "150px",
    //                         height: "150px",
    //                         borderRadius: "50%",
    //                         objectFit: "cover",
    //                     }}
    //                 />
    //             )}
    //             <p>
    //                 <strong>Full Name:</strong> {user.fullName}
    //             </p>
    //             <p>
    //                 <strong>Email:</strong> {user.email}
    //             </p>
    //             <p>
    //                 <strong>Username:</strong> {user.username}
    //             </p>
    //             {user.phone && (
    //                 <p>
    //                     <strong>Phone:</strong> {user.phone}
    //                 </p>
    //             )}
    //         </div>
    //         <button onClick={handleLogout}>Logout</button>
    //     </div>
    // );
};

export default UserProfile;
