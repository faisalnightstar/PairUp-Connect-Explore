import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import fs from "fs";
import jwt from "jsonwebtoken";

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken();
        if (!accessToken) {
            console.error("Access token generation failed for user:", userId); // Log with user ID!
            throw new ApiError(500, "Failed to generate access token");
        }

        const refreshToken = user.generateRefreshToken();
        if (!refreshToken) {
            console.error("Refresh token generation failed for user:", userId); // Log with user ID!
            throw new ApiError(500, "Failed to generate refresh token");
        }

        user.refreshToken = refreshToken;
        try {
            await user.save({ validateBeforeSave: false }); // Consider removing this if possible
        } catch (dbError) {
            console.error("Error saving refresh token to database:", dbError);
            throw new ApiError(500, "Failed to save refresh token"); // More specific message
        }

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error in generateAccessTokenAndRefreshToken:", error); // Crucial!
        throw new ApiError(500, "Something went wrong while generating tokens"); // Keep a general message
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, phone, username, password } = req.body;
    console.log(fullName, email, username, phone, password);

    // validate user details - not empty, valid email, password length
    if (
        [fullName, email, username, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        console.error("All fields are required for registration.");
        throw new ApiError(401, "All field are required.");
    }

    // check if user already exists in the database: username, email
    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existedUser) {
        // **Crucial: Delete files from local storage if user exists**
        if (req.files?.avatar && req.files.avatar[0].path) {
            try {
                fs.unlinkSync(req.files.avatar[0].path);
                console.log(`Deleted avatar from: ${req.files.avatar[0].path}`); // Log for debugging
            } catch (err) {
                console.error(`Error deleting avatar: ${err}`); // Handle deletion errors
            }
        }
        if (req.files?.coverImage && req.files.coverImage[0].path) {
            try {
                fs.unlinkSync(req.files.coverImage[0].path);
                console.log(
                    `Deleted cover image from: ${req.files.coverImage[0].path}`
                );
            } catch (err) {
                console.error(`Error deleting cover image: ${err}`);
            }
        }
        throw new ApiError(401, "User with username or email already exist");
    }

    let avatarLocalPath;
    if (
        req.files &&
        Array.isArray(req.files.avatar) &&
        req.files.avatar.length > 0
    ) {
        avatarLocalPath = req.files.avatar[0].path;
    }

    // if (!avatarLocalPath) {
    //     throw new ApiError(401, "Avatar is required to upload on LocalPath");
    // }

    //upload image to cloudinary, get image url
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    // if (!avatar) {
    //     throw new ApiError(401, "Avatar is required to upload on cloudinary");
    // }

    // create user object - create user in the database
    const user = await User.create({
        // create is methode and it takes object
        fullName,
        avatar: avatar?.url || "",
        coverImage: coverImage?.url || "", // we not checking coverimage is upload successfully or not that why if (coverImage?) is present then take url. if not, then take empty string.
        email,
        phone,
        password,
        username: username.toLowerCase(),
    });
    if (!user) {
        console.error("User not created");
        throw new ApiError(401, "Something went wrong while registering user");
    }

    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" // select methode me jo field nhi chahiye response me usko - sign laga kr likh do.
    );
    // now, checking user created or not
    if (!createdUser) {
        throw new ApiError(
            401,
            "Something went wrong while registering the user"
        );
    }

    // returning res to frontend
    return res
        .status(201)
        .json(
            new ApiResponse(200, createdUser, "User registered successfully")
        );
});

// LOGIN USER CONTROLLER
const loginUser = asyncHandler(async (req, res) => {
    // getting data from req body which is frontend
    const { email, username, password } = req.body;

    console.log(email, username, password);
    // check user is sending  username or email
    if (!(username || email)) {
        throw new ApiError(401, "username or email is required");
    }

    // check username or email present in db. if not, throw err
    const user = await User.findOne({
        $or: [{ email }, { username }], //$or is m_db's operators. which is finding based on email or username is present in db, or not
    });

    //console.log(user);

    //if user is not exist in db then throwing err
    if (!user) {
        throw new ApiError(401, "User does not register");
    }

    //if user exist, then checking password is correct or not through isPasswordCorrect() method (user.model.js)
    const isPasswordValid = await user.isPasswordCorrect(password);
    //console.log("PWD: ", isPasswordValid);
    // password is incorrect then throw err
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    //if password is correct then generating tokens using methods(generateAccessTokenAndRefreshToken)
    const { accessToken, refreshToken } =
        await generateAccessTokenAndRefreshToken(user._id);

    // removing password and refreshToken before sending through cookies
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    //now securing the token before sending through cookies
    const options = {
        httpOnly: true,
        secure: true, // secure:false is used only in developement mode
        sameSite: "None",
        // now cookies can't be modify from frontend, its only modifiable through server
    };
    //sending cookie
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged in Successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1, // this removes the field from the document
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,

                req.user.fullName, //{},
                "User logged Out Successfully"
            )
        );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const IncomingRefreshToken = req.cookies.refreshToken;

    if (!IncomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            IncomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        if (!decodedToken) {
            throw new ApiError(401, "Unauthorized request");
        }

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token");
        }

        if (user.refreshToken !== IncomingRefreshToken) {
            throw new ApiError(
                401,
                "Refresh token mismatch this means expired or used"
            );
        }

        const { accessToken, refreshToken } =
            await generateAccessTokenAndRefreshToken(user._id);

        const options = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(200, {}, "Access token refreshed successfully")
            );
    } catch (error) {
        console.error("Error in refreshAccessToken:", error);
        throw new ApiError(
            400,
            error?.message || "Failed to refresh access token"
        );
    }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
        console.error("User not found");
        throw new ApiError(404, "User not found for changing password");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Old password is incorrect");
    }

    if (oldPassword === newPassword) {
        throw new ApiError(
            400,
            "New password cannot be same as current password"
        );
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    //console.log(req.user.refreshToken);
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Current User found"));
});

const findUserByUsername = async (req, res) => {
    try {
        const { username } = req?.params;
        console.log("username: ", username);

        if (!username) {
            throw new ApiError(400, "Username is required");
        }

        const user = await User?.findOne({ username }).select(
            "-password -refreshToken"
        );

        if (!user) {
            console.error("User not found");
            throw new ApiError(404, "User not found");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, user, "User found successfully"));
    } catch (error) {
        console.error("Error fetching user:", error);

        throw new ApiError(504, "Error while fetching findUserByUsername");
    }
};

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, username, email, phone } = req.body;

    //console.log(fullName, username, email, phone);
    if (!fullName || !username || !email || !phone) {
        throw new ApiError(
            400,
            "All field are required to update account details."
        );
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                username,
                email,
                phone,
            },
        },
        {
            new: true,
        }
    ).select("-password");

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Account details updated successfully")
        );
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    console.log("avatarLocalPath: ", avatarLocalPath);

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required to be file uploaded");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("avatar: ", avatar);

    if (!avatar.url) {
        console.error("Something went wrong while uploading avatar");
        throw new ApiError(400, "Something went wrong while uploading avatar");
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url,
            },
        },
        {
            new: true,
        }
    ).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalFilePath = req.file?.path;

    if (!coverImageLocalFilePath) {
        throw new ApiError(
            400,
            "CoverImage file is required to be file uploaded"
        );
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalFilePath);

    if (!coverImage.url) {
        throw new ApiError(
            400,
            "Something went wrong while uploading coverImage"
        );
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url,
            },
        },
        {
            new: true,
        }
    ).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "coverImage updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;
    console.log("username: ", username);
    if (!username) {
        throw new ApiError(
            400,
            "Username is required to get userChannel profile"
        );
    }
    const channel = await User.aggregate([
        {
            $match: { username: username?.toLowerCase() },
        },
        {
            //this is for followers/connected: people you follow
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscriber",
            },
        },
        {
            // this is for following/connecting: people who follow you
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo",
            },
        },
        {
            $addFields: {
                subscribeCount: { $size: "$subscriber" },
                channelSubscribedToCount: { $size: "$subscribedTo" },
            },
            isSubscribed: {
                // Improved isSubscribed logic
                $cond: {
                    if: { $in: [req.user?._id, "$subscriber._id"] },
                    then: true,
                    else: false,
                },
            },
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                avatar: 1,
                coverImage: 1,
                subscribeCount: 1,
                channelSubscribedToCount: 1,
                isSubscribed: 1,
                createdAt: 1,
                _id: 0,
            },
        },
    ]);

    console.log("channel: ", channel);

    if (!channel?.length) {
        throw new ApiError(404, "Channel not found or does not exist");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                channel[0],
                "Channel profile fetched successfully"
            )
        );
});

const getTripHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: req.user._id,
            },
        },
        {
            $lookup: {
                from: "trips",
                localField: "tripHistory",
                foreignField: "_id",
                as: "tripHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "organizer", // organizer of the trip
                            foreignField: "_id",
                            as: "organizer",
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        username: 1,
                                        avatar: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $addFields: {
                            organizer: "$organizer",
                        },
                    },
                ],
            },
        },
    ]);

    if (!user?.length) {
        throw new ApiError(404, "User not found in tripHistory");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user[0].tripHistory,
                "Trip history fetched successfully"
            )
        );
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    findUserByUsername,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getTripHistory,
};
