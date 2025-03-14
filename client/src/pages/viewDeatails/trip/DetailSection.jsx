import React from "react";
import {
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaExclamationCircle,
} from "react-icons/fa";

const DetailSection = ({ tripDetail }) => {
    return (
        <div className="mt-6 sm:mt-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Trip Details</h2>
            <p className="text-gray-600">{tripDetail.description}</p>

            <div className="mt-4 sm:mt-1">
                <h3 className="text-lg font-semibold flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-red-500" /> Meeting
                    Point
                </h3>
                <p className="text-gray-600">
                    {tripDetail.meetingPoint ||
                        "Ngurah Rai International Airport, Denpasar"}
                </p>
            </div>

            {/* Itinerary */}
            <div className="mt-4 sm:mt-1">
                <h3 className="text-lg font-semibold flex items-center">
                    <FaCalendarAlt className="mr-2 text-red-500" /> Schedule
                    Overview
                </h3>
                <ul className="list-disc pl-5 text-gray-600">
                    {tripDetail.itinerary.map((dayPlan, index) => (
                        <li key={index}>
                            <strong>Day {index + 1}:</strong> {dayPlan.activity}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Important Notes */}
            <div className="mt-4 sm:mt-1">
                <h3 className="text-lg font-semibold flex items-center">
                    <FaExclamationCircle className="mr-2 text-red-500" />{" "}
                    Important Notes
                </h3>
                <p className="text-gray-600">
                    Please bring comfortable walking shoes, swimwear, and sun
                    protection. All accommodations and local transportation
                    included.
                </p>
            </div>
        </div>
    );
};

export default DetailSection;
