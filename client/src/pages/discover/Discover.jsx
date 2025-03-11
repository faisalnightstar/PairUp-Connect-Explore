import React, { useEffect, useState } from "react";
import {
    FaMapMarkerAlt,
    FaHeart,
    FaCalendarAlt,
    FaUsers,
    FaCalendar,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Loader } from "../../components";
import { allTrips } from "../../features/trip/tripSlice";
import { createSelector } from "@reduxjs/toolkit";

const selectTripData = createSelector(
    (state) => state.trip,
    (tripState) => ({
        trip: tripState.trip,
        loading: tripState.loading,
        error: tripState.error,
    })
);

const Discover = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { trip, loading, error } = useSelector(selectTripData, shallowEqual);
    console.log("trip: ", trip);

    useEffect(() => {
        const fetchData = async () => {
            if (!trip || trip.length === 0) {
                await dispatch(allTrips());
            }
        };

        fetchData();
    }, [dispatch, trip]);

    if (loading) return <Loader />;

    const userLocale = navigator.language || "en-US"; // Auto-detect user locale

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

    const handleUserClick = (tripId) => {
        navigate(`/view-post-details/${tripId}`);
    };

    return (
        <>
            <main className="flex-grow mt-20 mb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
                <div className="flex space-y-1 flex-col mb-2">
                    <h1 className="text-3xl font-bold text-header-color">
                        Explore Trips
                    </h1>
                    <p className="font-poppins text-paragraph-color">
                        Find your next adventure from our curated collection of
                        trips
                    </p>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <div className="grid grid-cols-1 place-items-center md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {trip &&
                        trip.map((trip) => (
                            <div
                                key={trip._id}
                                className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md w-96 h-96 transition-shadow"
                            >
                                <img
                                    src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/fc/f0/goa.jpg?w=2400&h=1000&s=1"
                                    alt="cover image"
                                    className="w-fit h-48 object-cover rounded-lg mb-4"
                                />
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 flex items-center">
                                            <FaCalendarAlt className="mr-2 text-custom" />
                                            {tripStartDate(trip.startDate)} -{" "}
                                            {tripEndDate(trip.endDate)}
                                        </span>
                                        <span className="text-gray-600 flex items-center">
                                            <FaUsers className="mr-2 text-custom" />
                                            {trip.participants?.length} Joined
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg flex flex-row items-center font-semibold text-header-color mb-1">
                                                <FaMapMarkerAlt className="mr-2 text-lg center text-header-color" />
                                                {trip.destination}
                                            </h3>
                                            <p className="text-gray-600 items-center text-xs w-64 truncate">
                                                {trip.description}
                                            </p>
                                        </div>
                                        <button className="!rounded-button text-fonts-color p-2 hover:text-button-color hover:cursor-pointer">
                                            <FaHeart />
                                        </button>
                                    </div>
                                    <button
                                        className="rounded-full w-full bg-button-color font-roboto text-white py-2 px-4 hover:bg-button-color/90 hover:cursor-pointer"
                                        onClick={() =>
                                            handleUserClick(trip._id)
                                        }
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            </main>
        </>
    );
};

export default Discover;
