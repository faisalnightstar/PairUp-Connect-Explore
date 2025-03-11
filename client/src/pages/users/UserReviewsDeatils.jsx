import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { MdStarRate } from "react-icons/md";

const UserReviewsDeatils = ({ userDetail, joinedDate }) => {
    return (
        <main className="flex-grow mt-10 mb-20 max-w-8xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {/* Review Card 1 */}
                <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md w-72 transition-shadow">
                    <div className="flex flex-row items-start space-x-4 mb-2">
                        <img
                            src={userDetail?.avatar}
                            alt="avatar"
                            className="h-10 w-10 object-cover rounded-full justify-center items-center"
                        />
                        <div className="flex flex-col space-x-2">
                            <div>
                                <h3 className="text-md font-roboto font-semibold text-gray-900">
                                    {userDetail?.fullName}
                                </h3>
                                <p className="text-gray-600 flex items-center text-xs">
                                    <MdStarRate className="mr-2" />4
                                    {/* hardcoded */}
                                </p>
                            </div>
                            <span className="text-gray-600 flex items-center text-xs">
                                <FaCalendarAlt className="mr-2 text-custom" />
                                {joinedDate(userDetail?.createdAt)}
                            </span>
                        </div>
                    </div>
                    <p className="text-xs ">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Architecto omnis ad, nisi enim accusamus doloremque.
                        Libero dolorem quam cum laboriosam? Libero at autem hic
                        quo excepturi omnis quibusdam error unde natus. Nihil
                    </p>
                </div>

                {/* Review Card 2 */}
                <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md w-72 transition-shadow">
                    <div className="flex flex-row items-start space-x-4 mb-2">
                        <img
                            src={userDetail?.avatar}
                            alt="avatar"
                            className="h-10 w-10 object-cover rounded-full justify-center items-center"
                        />
                        <div className="flex flex-col space-x-2">
                            <div>
                                <h3 className="text-md font-roboto font-semibold text-gray-900">
                                    {userDetail?.fullName}
                                </h3>
                                <p className="text-gray-600 flex items-center text-xs">
                                    <MdStarRate className="mr-2" />4
                                    {/* hardcoded */}
                                </p>
                            </div>
                            <span className="text-gray-600 flex items-center text-xs">
                                <FaCalendarAlt className="mr-2 text-custom" />
                                {joinedDate(userDetail?.createdAt)}
                            </span>
                        </div>
                    </div>
                    <p className="text-xs ">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Architecto omnis ad, nisi enim accusamus doloremque.
                        Libero dolorem quam cum laboriosam? Libero at autem hic
                        quo excepturi omnis quibusdam error unde natus. Nihil
                    </p>
                </div>
                {/* Trip Card 3 */}
                <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md w-72 transition-shadow">
                    <div className="flex flex-row items-start space-x-4 mb-2">
                        <img
                            src={userDetail?.avatar}
                            alt="avatar"
                            className="h-10 w-10 object-cover rounded-full justify-center items-center"
                        />
                        <div className="flex flex-col space-x-2">
                            <div>
                                <h3 className="text-md font-roboto font-semibold text-gray-900">
                                    {userDetail?.fullName}
                                </h3>
                                <p className="text-gray-600 flex items-center text-xs">
                                    <MdStarRate className="mr-2" />4
                                    {/* hardcoded */}
                                </p>
                            </div>
                            <span className="text-gray-600 flex items-center text-xs">
                                <FaCalendarAlt className="mr-2 text-custom" />
                                {joinedDate(userDetail?.createdAt)}
                            </span>
                        </div>
                    </div>
                    <p className="text-xs ">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Architecto omnis ad, nisi enim accusamus doloremque.
                        Libero dolorem quam cum laboriosam? Libero at autem hic
                        quo excepturi omnis quibusdam error unde natus. Nihil
                    </p>
                </div>
                {/* Trip Card 4 */}
                <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md w-72 transition-shadow">
                    <div className="flex flex-row items-start space-x-4 mb-2">
                        <img
                            src={userDetail?.avatar}
                            alt="avatar"
                            className="h-10 w-10 object-cover rounded-full justify-center items-center"
                        />
                        <div className="flex flex-col space-x-2">
                            <div>
                                <h3 className="text-md font-roboto font-semibold text-gray-900">
                                    {userDetail?.fullName}
                                </h3>
                                <p className="text-gray-600 flex items-center text-xs">
                                    <MdStarRate className="mr-2" />4
                                    {/* hardcoded */}
                                </p>
                            </div>
                            <span className="text-gray-600 flex items-center text-xs">
                                <FaCalendarAlt className="mr-2 text-custom" />
                                {joinedDate(userDetail?.createdAt)}
                            </span>
                        </div>
                    </div>
                    <p className="text-xs ">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Architecto omnis ad, nisi enim accusamus doloremque.
                        Libero dolorem quam cum laboriosam? Libero at autem hic
                        quo excepturi omnis quibusdam error unde natus. Nihil
                    </p>
                </div>
            </div>
        </main>
    );
};

export default UserReviewsDeatils;
