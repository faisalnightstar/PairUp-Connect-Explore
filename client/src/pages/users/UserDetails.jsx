import React from "react";

const UserDetails = ({ userDetail }) => {
    return (
        <>
            {userDetail ? (
                <div className="flex flex-row flex-wrap justify-between space-y-2  p-4">
                    <div className=" space-y-4 w-1/2">
                        <h1 className="font-roboto text-xl font-bold">
                            Personal Information
                        </h1>
                        <div>
                            <h2 className="font-roboto text-sm font-semibold">
                                Full Name
                            </h2>
                            <h2 className="flex flex-row  items-center font-normal font-roboto   text-profile-details text-sm">
                                {userDetail.fullName}
                            </h2>
                        </div>

                        <div>
                            <h2 className="font-roboto text-sm font-semibold">
                                Email
                            </h2>
                            <h2 className="flex flex-row  items-center font-normal font-roboto   text-profile-details text-sm">
                                {userDetail.email}
                            </h2>
                        </div>
                        <div>
                            <h2 className="font-roboto text-sm font-semibold">
                                Phone Number
                            </h2>
                            <h2 className="flex flex-row  items-center font-normal font-roboto   text-profile-details text-sm">
                                {userDetail.phone}
                            </h2>
                        </div>
                        <div>
                            <h2 className="font-roboto font-paragraph-color text-sm font-semibold">
                                Address
                            </h2>
                            <h2 className="flex flex-row  items-center font-normal font-roboto   text-profile-details text-sm">
                                Delhi, India
                            </h2>
                        </div>
                    </div>
                    <div className=" space-y-4 w-1/2">
                        <h1 className="font-roboto text-xl font-bold">
                            Travel Preferences
                        </h1>
                        <div className="flex felx-row flex-wrap space-y-2 space-x-2">
                            <p className="text-xs font-roboto bg-btn-bg-color rounded-full px-2 text-button-color">
                                Adventure
                            </p>
                            <p className="text-xs font-roboto bg-btn-bg-color rounded-full px-2 text-button-color">
                                Cultural
                            </p>
                            <p className="text-xs font-roboto bg-btn-bg-color rounded-full px-2 text-button-color">
                                Nature
                            </p>
                            <p className="text-xs font-roboto bg-btn-bg-color rounded-full px-2 text-button-color">
                                Photography
                            </p>
                            <p className="text-xs font-roboto bg-btn-bg-color rounded-full px-2 text-button-color">
                                Adventure
                            </p>
                            <p className="text-xs font-roboto bg-btn-bg-color rounded-full px-2 text-button-color">
                                Cultural
                            </p>
                            <p className="text-xs font-roboto bg-btn-bg-color rounded-full px-2 text-button-color">
                                Nature
                            </p>
                            <p className="text-xs font-roboto bg-btn-bg-color rounded-full px-2 text-button-color">
                                Photography
                            </p>
                            <p className="text-xs font-roboto bg-btn-bg-color rounded-full px-2 text-button-color">
                                Adventure
                            </p>
                            <p className="text-xs font-roboto bg-btn-bg-color rounded-full px-2 text-button-color">
                                Cultural
                            </p>
                            <p className="text-xs font-roboto bg-btn-bg-color rounded-full px-2 text-button-color">
                                Nature
                            </p>
                            <p className="text-xs font-roboto bg-btn-bg-color rounded-full px-2 text-button-color">
                                Photography
                            </p>
                        </div>
                        <div>
                            <h2 className="font-roboto text-xl font-bold">
                                Language
                            </h2>
                            <div className="flex felx-row flex-wrap space-y-2 space-x-2">
                                <p className="text-xs font-roboto">English</p>
                                <p className="text-xs font-roboto">
                                    Hindi (Native)
                                </p>
                                <p className="text-xs font-roboto">English</p>
                                <p className="text-xs font-roboto">
                                    Hindi (Native)
                                </p>
                                <p className="text-xs font-roboto">English</p>
                                <p className="text-xs font-roboto">
                                    Hindi (Native)
                                </p>
                                <p className="text-xs font-roboto">English</p>
                                <p className="text-xs font-roboto">
                                    Hindi (Native)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                "Loading user details..."
            )}
        </>
    );
};

export default UserDetails;
