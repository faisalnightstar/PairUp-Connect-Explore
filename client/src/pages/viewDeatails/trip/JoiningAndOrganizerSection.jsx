import React, { useEffect, useState } from "react";
import { FaExclamationCircle, FaRupeeSign } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { joinTrip } from "../../../features/trip/tripSlice";

const JoiningAndOrganizerSection = ({ tripDetail, tripEndDate }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isJoined, setIsJoined] = useState(false);
    const [isOrganizer, setIsOrganizer] = useState(false);

    //console.log("isJoined: ", isJoined);

    const handleUserClick = (username) => {
        navigate(`/user/${username}`);
    };

    const { user } = useSelector((state) => state.auth);

    //console.log("user in JoiningAndOrganizerSection: ", user);

    const handleJoinTrip = async () => {
        try {
            const response = dispatch(joinTrip(tripDetail._id));
            //console.log("response: ", response);
        } catch (error) {
            if (error.response?.status === 401) {
                alert("You have already joined this trip.");
                setIsJoined(true);
            } else {
                console.error("Error joining trip:", error);
                alert("Failed to join trip. Please try again.");
            }
        }
    };
    useEffect(() => {
        if (tripDetail) {
            setIsJoined(
                tripDetail.participants.some(
                    (user) => user.username === user?.username
                )
            );
            setIsOrganizer(tripDetail.organizer.username === user.username);
        }
    });
    // console.log(
    //     "tripDetail.participants.username: ",
    //     tripDetail.participants.some((user) => user.username === user.username),
    //     "tripDetail.organizer._id === user._id",
    //     tripDetail.organizer.username === user.username,
    //     "user.name: ",
    //     user.username
    // );
    return (
        <div className="mt-1  md:mt-1 grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2  gap-6 sm:gap-1">
            {/* Organizer Card */}
            <div className="flex flex-col h-min p-4  shadow-md rounded-lg">
                <div className="flex flex-grow flex-row space-x-2 w-min">
                    <img
                        className="w-8 h-8 lg:w-12 lg:h-12 rounded-full cursor-pointer"
                        src={tripDetail.organizer.avatar}
                        alt={tripDetail.organizer.name}
                        onClick={() =>
                            handleUserClick(tripDetail.organizer.username)
                        }
                    />
                    <div className="flex flex-col  justify-center items-center pr-4">
                        <h2
                            className="flex flex-col font-roboto text-sm font-md w-min  cursor-pointer"
                            onClick={() =>
                                handleUserClick(tripDetail.organizer.username)
                            }
                        >
                            {tripDetail.organizer.name}
                            <p className="mt-0">
                                {" "}
                                <span
                                    className="text-xs font-md tracking-widest font-roboto bg-btn-bg-color rounded-full px-2 py-0.5 text-red-500 cursor-pointer"
                                    onClick={() =>
                                        handleUserClick(
                                            tripDetail.organizer.username
                                        )
                                    }
                                >
                                    @{tripDetail.organizer.username}
                                </span>{" "}
                            </p>
                        </h2>

                        <p className="text-yellow-500 text-xs">
                            ⭐ 4.8 (124 reviews)
                        </p>
                    </div>
                </div>

                <button className="mt-3 px-3 items-center bg-red-100 text-red-500 cursor-pointer  rounded-full">
                    Message Organizer
                </button>
            </div>

            {/* Joining Card */}
            <div className="p-6  shadow-md rounded-lg">
                <h3 className="flex flex-row items-center text-xs ">
                    <span className="mr-1 font-semibold">Budget:</span>
                    <FaRupeeSign />
                    {tripDetail.budget}/person
                </h3>
                <p className="text-gray-600 text-xs">
                    <span className="mr-1 font-semibold"> Seats Left: </span>{" "}
                    {tripDetail.participants?.length} of{" "}
                    {tripDetail.numberOfPeople}
                </p>
                <p className="flex text-gray-600 text-xs">
                    <span className=" mr-1 font-semibold">
                        Joining Deadline:
                    </span>
                    <span>{tripEndDate}</span>
                </p>

                {isOrganizer ? (
                    <button
                        className={`mt-3 w-full py-1 rounded-full ${"bg-red-500 text-white cursor-pointer hover:bg-red-600 active:bg-white"}`}
                        onClick={() => navigate(`/trip/edit/${tripDetail._id}`)}
                    >
                        Edit Trip
                    </button>
                ) : (
                    <button
                        className={`mt-3 w-full py-1 rounded-full ${
                            isJoined
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-red-500 text-white cursor-pointer hover:bg-red-600 active:bg-white"
                        }`}
                        onClick={handleJoinTrip}
                        disabled={isJoined}
                    >
                        {isJoined ? "Already Joined" : "Join Trip"}
                    </button>
                )}

                {/* Participants Section */}
                <div className="mt-6  w-full  rounded-lg">
                    <h3 className="text-xs text-center font-md mb-2">
                        Participants
                    </h3>
                    <div className="flex flex-col flex-wrap gap-4">
                        {tripDetail.participants?.map((participant, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-3"
                            >
                                <img
                                    className="w-10 h-10 rounded-full cursor-pointer"
                                    src={participant?.avatar}
                                    alt={participant?.name}
                                    onClick={() =>
                                        handleUserClick(participant.username)
                                    }
                                />
                                <p
                                    className="text-sm font-medium cursor-pointer"
                                    onClick={() =>
                                        handleUserClick(participant?.username)
                                    }
                                >
                                    {participant?.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                <p className="flex flex-row items-center space-x-2 text-gray-500 text-sm mt-1 md:mt-3">
                    <img className="mr-2" src="SecureConnection.svg" alt="" />
                    <FaExclamationCircle className="mr-2 text-red-500" /> Don't
                    pay anyone for this trip.
                </p>
            </div>
        </div>
    );
};

export default JoiningAndOrganizerSection;
