import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaCalendarAlt, FaUsers } from "react-icons/fa";

import { Loader } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import { singleTrip } from "../../../features/trip/tripSlice";
import DetailSection from "./DetailSection";
import JoiningAndOrganizerSection from "./JoiningAndOrganizerSection";

const ViewPostDetails = () => {
    const { tripId } = useParams();
    const dispatch = useDispatch();

    let tripDetail = useSelector((state) =>
        state.trip.trip.find((t) => t._id === tripId)
    );

    const { selectedTrip, loading, error } = useSelector((state) => state.trip);

    useEffect(() => {
        if (tripDetail == undefined) {
            dispatch(singleTrip(tripId));
        }
    }, [tripId]);

    if (tripDetail == undefined) {
        tripDetail = selectedTrip;
    }

    if (loading || !tripDetail) return <Loader />;
    if (error) {
        return (
            <p className="text-red-500 mt-36">Something went wrong: {error}</p>
        );
    }
    // Rendering the trip details

    const userLocale = navigator.language || "en-US"; // Auto-detect currentUser locale

    const tripStartDate = (isoDate) => {
        if (!isoDate) return "N/A";
        const date = new Date(isoDate);
        return new Intl.DateTimeFormat(userLocale, {
            day: "2-digit",
            month: "short",
        }).format(date);
    };
    const tripEndDate = (isoDate) => {
        if (!isoDate) return "N/A";
        const date = new Date(isoDate);
        return new Intl.DateTimeFormat(userLocale, {
            year: "numeric",
            day: "2-digit",
            month: "short",
        }).format(date);
    };

    return (
        <>
            <div className="min-w-screen mx-auto mt-16 mb-20 overflow-hidden ">
                {/* Header Image */}
                <div className="relative">
                    <img
                        src={tripDetail.coverImage}
                        alt={tripDetail.destination}
                        className="w-full h-[32rem] overflow-hidden p-0 object-cover"
                    />
                    <h1 className="absolute bottom-4 left-6 text-4xl bg-blur-sm text-button-color font-bold">
                        {tripDetail.destination}
                    </h1>
                </div>

                {/* Trip Info */}
                <div className="flex justify-between items-cente max-w-8xl mx-auto shadow-lg bg-white  sm:mt-1 p-12 sm:p-1">
                    <div className="flex items-center text-gray-600">
                        <FaCalendarAlt className="mr-2" />{" "}
                        {tripStartDate(tripDetail.startDate)} -{" "}
                        {tripEndDate(tripDetail.endDate)}
                        <span className="flex flex-row justify-center items-center ml-2">
                            <FaUsers className="mr-1" />{" "}
                            {tripDetail.numberOfPeople} seats left
                        </span>
                    </div>

                    {isJoiningOpen(tripDetail.startDate) ? (
                        <span className="px-3 py-1 text-xs text-green-600 bg-green-100 rounded-full">
                            Joining Open
                        </span>
                    ) : (
                        <span className="px-3 py-1 text-xs text-white bg-gray-400 rounded-full">
                            Joining Closed
                        </span>
                    )}
                </div>
                {/* Main Content */}
                <div className="flex flex-col justify-center md:flex-row  sm:gap-1 gap-6 px-2 md:px-2">
                    {/* Trip Details Section */}
                    <DetailSection tripDetail={tripDetail} />
                    {/* Organizer and Booking Section */}
                    <JoiningAndOrganizerSection
                        tripDetail={tripDetail}
                        tripEndDate={tripEndDate(tripDetail.endDate)}
                    />
                </div>
            </div>
        </>
    );
};

export default ViewPostDetails;

function isJoiningOpen(tripStartDate) {
    const currentDate = new Date();
    const startDate = new Date(tripStartDate);

    currentDate.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);

    return currentDate <= startDate;
}
