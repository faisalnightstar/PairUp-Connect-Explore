import React from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers } from "react-icons/fa";

const UserTripsDetails = () => {
    return (
        <main className="flex-grow mt-10 max-w-8xl mx-auto sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Total Trips!
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {/* Trip Card 1 */}
                <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md w-64 transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                Goa Beach Paradise
                            </h3>
                            <p className="text-gray-600 flex items-center">
                                <FaMapMarkerAlt className="mr-2 text-custom" />
                                Goa, India
                            </p>
                        </div>
                    </div>
                    <img
                        src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/fc/f0/goa.jpg?w=2400&h=1000&s=1"
                        alt="Goa Trip"
                        className="w-fit h-48 object-cover rounded-lg mb-4"
                    />
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 flex items-center">
                                <FaCalendarAlt className="mr-2 text-custom" />
                                Dec 30, 2024
                            </span>
                            <span className="text-gray-600 flex items-center">
                                <FaUsers className="mr-2 text-custom" />2 Joined
                            </span>
                        </div>
                        {/* Join Trip Button */}
                        <p className="rounded-md bg-paragraph-color text-center text-white">
                            Cancelled
                        </p>
                    </div>
                </div>

                {/* Trip Card 2 */}
                <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md w-64 transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                Goa Beach Paradise
                            </h3>
                            <p className="text-gray-600 flex items-center">
                                <FaMapMarkerAlt className="mr-2 text-custom" />
                                Goa, India
                            </p>
                        </div>
                    </div>
                    <img
                        src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/fc/f0/goa.jpg?w=2400&h=1000&s=1"
                        alt="Goa Trip"
                        className="w-fit h-48 object-cover rounded-lg mb-4"
                    />
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 flex items-center">
                                <FaCalendarAlt className="mr-2 text-custom" />
                                Dec 30, 2024
                            </span>
                            <span className="text-gray-600 flex items-center">
                                <FaUsers className="mr-2 text-custom" />2 Joined
                            </span>
                        </div>
                        {/* Join Trip Button */}
                        <p className="rounded-md bg-paragraph-color text-center text-white">
                            Completed
                        </p>
                    </div>
                </div>

                {/* Trip Card 3 */}
                <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md w-64 transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                Goa Beach Paradise
                            </h3>
                            <p className="text-gray-600 flex items-center">
                                <FaMapMarkerAlt className="mr-2 text-custom" />
                                Goa, India
                            </p>
                        </div>
                    </div>
                    <img
                        src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/fc/f0/goa.jpg?w=2400&h=1000&s=1"
                        alt="Goa Trip"
                        className="w-fit h-48 object-cover rounded-lg mb-4"
                    />
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 flex items-center">
                                <FaCalendarAlt className="mr-2 text-custom" />
                                Dec 30, 2024
                            </span>
                            <span className="text-gray-600 flex items-center">
                                <FaUsers className="mr-2 text-custom" />2 Joined
                            </span>
                        </div>
                        {/* Join Trip Button */}
                        <p className="rounded-md bg-paragraph-color text-center text-white">
                            Cancelled
                        </p>
                    </div>
                </div>

                {/* Trip Card 4 */}
                <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md w-64 transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                Goa Beach Paradise
                            </h3>
                            <p className="text-gray-600 flex items-center">
                                <FaMapMarkerAlt className="mr-2 text-custom" />
                                Goa, India
                            </p>
                        </div>
                    </div>
                    <img
                        src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/fc/f0/goa.jpg?w=2400&h=1000&s=1"
                        alt="Goa Trip"
                        className="w-fit h-48 object-cover rounded-lg mb-4"
                    />
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 flex items-center">
                                <FaCalendarAlt className="mr-2 text-custom" />
                                Dec 30, 2024
                            </span>
                            <span className="text-gray-600 flex items-center">
                                <FaUsers className="mr-2 text-custom" />2 Joined
                            </span>
                        </div>
                        {/* Join Trip Button */}
                        <p className="rounded-md bg-paragraph-color text-center text-white">
                            Completed
                        </p>
                    </div>
                </div>
                {/* Trip Card 5 */}
                <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md w-64 transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                Goa Beach Paradise
                            </h3>
                            <p className="text-gray-600 flex items-center">
                                <FaMapMarkerAlt className="mr-2 text-custom" />
                                Goa, India
                            </p>
                        </div>
                    </div>
                    <img
                        src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/fc/f0/goa.jpg?w=2400&h=1000&s=1"
                        alt="Goa Trip"
                        className="w-fit h-48 object-cover rounded-lg mb-4"
                    />
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 flex items-center">
                                <FaCalendarAlt className="mr-2 text-custom" />
                                Dec 30, 2024
                            </span>
                            <span className="text-gray-600 flex items-center">
                                <FaUsers className="mr-2 text-custom" />2 Joined
                            </span>
                        </div>
                        {/* Join Trip Button */}
                        <p className="rounded-md bg-paragraph-color text-center text-red-500">
                            Cancelled
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default UserTripsDetails;
