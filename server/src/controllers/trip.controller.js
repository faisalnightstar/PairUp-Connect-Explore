import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Trip } from "../models/trip.model.js";
import { tripUploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import fs from "fs";

// ✅ Create a Trip
const postTrip = asyncHandler(async (req, res) => {
    try {
        const {
            destination,
            categories,
            startDate,
            endDate,
            numberOfPeople,
            budget,
            description,
            itinerary,
            lat,
            lng,
        } = req.body;

        console.log(
            `
            destination: ${destination}
            categories: ${categories}
            startDate: ${startDate}
            endDate: ${endDate}
            numberOfPeople: ${numberOfPeople}
            budget: ${budget}
            description: ${description}
            itinerary: ${itinerary}
            lat: ${lat}
            lng: ${lng}
            `
        );

        if (
            !destination ||
            !startDate ||
            !endDate ||
            !numberOfPeople ||
            !budget ||
            !description ||
            lat === undefined ||
            lng === undefined
        ) {
            throw new ApiError(400, "All fields are required to post a trip");
        }

        const coverImageLocalPath = req.file?.path;

        console.log(`coverImageLocalPath: ${coverImageLocalPath}`);

        if (!coverImageLocalPath) {
            console.error(
                "Image is required to upload on LocalPath in postTrip"
            );
            throw new ApiError(401, "Image is required to upload on LocalPath");
        }

        const coverImage = await tripUploadOnCloudinary(coverImageLocalPath);

        //console.log(`coverImage: ${coverImage} coverImage.url: ${coverImage.url}`);

        // ✅ Create new trip
        const trip = await Trip.create({
            organizer: req.user._id,
            destination,
            categories,
            startDate,
            endDate,
            numberOfPeople,
            budget,
            description,
            itinerary: JSON.parse(itinerary), // Convert itinerary JSON string to object
            coverImage:
                coverImage?.url ||
                "https://res.cloudinary.com/pairup-connect/image/upload/f_auto,q_auto/No_image_available_afsl0y",
            location: {
                type: "Point",
                coordinates: [parseFloat(lng), parseFloat(lat)], // longitude, latitude
            },
        });

        //console.log("posted trip sucessfully: ", trip);
        if (!trip) {
            console.error("Error in postTrip:", error);
            fs.unlinkSync(coverImageLocalPath);
            throw new ApiError(500, "Something went wrong while posting trip");
        }

        return res
            .status(201)
            .json(new ApiResponse(201, trip, "Trip posted successfully"));
    } catch (error) {
        console.error("Error in postTrip:", error);
        throw new ApiError(500, "Something went wrong while posting trip");
    }
});

// ✅ Get all trips
// const getAllTrip = asyncHandler(async (req, res) => {
//     try {
//         const trip = await Trip.find(req.trip)
//             .populate("organizer", "fullName username email avatar")
//             .populate("participants", "fullName username email avatar");

//         //console.log("All trips: ", trip);
//         if (!trip) {
//             console.error("Error in getTrip:", error);
//             throw new ApiError(404, "Trips not found");
//         }

//         return res
//             .status(200)
//             .json(new ApiResponse(201, trip, "Trips fetched successfully"));
//     } catch (error) {
//         console.error("Error in getTrip:", error);
//         throw new ApiError(501, "Something went wrong while fetching trips");
//     }
// });

const getAllTrip = asyncHandler(async (req, res) => {
    try {
        // Expect the user's latitude and longitude in the query parameters
        const { lat, lng, maxDistance } = req.query;

        console.log(
            `lat: ${lat} lng: ${lng} maxDistance: ${maxDistance} req.query: ${req.query}`
        );

        if (!lat || !lng) {
            throw new ApiError(400, "Latitude and Longitude are required");
        }

        // Use the $geoNear aggregation stage to find trips ordered by distance
        const trips = await Trip.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)],
                    },
                    distanceField: "distance", // The computed distance will be stored here (in meters)
                    maxDistance: maxDistance ? parseInt(maxDistance) : 10000, // Optional maximum distance in meters (default: 10 km)
                    spherical: true,
                },
            },
            // Lookup organizer details
            {
                $lookup: {
                    from: "users",
                    localField: "organizer",
                    foreignField: "_id",
                    as: "organizer",
                },
            },
            { $unwind: "$organizer" },
            // Lookup participants details
            {
                $lookup: {
                    from: "users",
                    localField: "participants",
                    foreignField: "_id",
                    as: "participants",
                },
            },
            // Sort by distance ascending (nearest first)
            {
                $sort: { distance: 1 },
            },
        ]);

        if (!trips || trips.length === 0) {
            throw new ApiError(404, "Trips not found");
        }

        return res
            .status(200)
            .json(new ApiResponse(201, trips, "Trips fetched successfully"));
    } catch (error) {
        console.error("Error in getTrip:", error);
        throw new ApiError(501, "Something went wrong while fetching trips");
    }
});

// ✅ Get view trips details
const viewTripDetails = asyncHandler(async (req, res) => {
    try {
        const { tripId } = req.params;

        console.log("tripId for getting trip page details: ", tripId);

        const trips = await Trip.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(tripId) } },
            // Lookup Organizer (Owner) Details
            {
                $lookup: {
                    from: "users",
                    localField: "organizer",
                    foreignField: "_id",
                    as: "organizer",
                },
            },
            { $unwind: "$organizer" }, // Convert array into an object

            // Lookup Participants Details
            {
                $lookup: {
                    from: "users",
                    localField: "participants",
                    foreignField: "_id",
                    as: "participants",
                },
            },
            //{ $unwind: "$participants" },
            {
                $lookup: {
                    from: "reviews",
                    localField: "organizer._id",
                    foreignField: "reviewee",
                    as: "oraganierRatings",
                },
            },
            {
                $addFields: {
                    organizerTotalRatings: { $size: "$oraganierRatings" },
                    organizerAverageRating: {
                        $cond: {
                            if: { $gt: [{ $size: "$oraganierRatings" }, 0] },
                            then: {
                                $divide: [
                                    {
                                        $sum: {
                                            $map: {
                                                input: "$oraganierRatings",
                                                as: "r",
                                                in: "$$r.rating",
                                            },
                                        },
                                    },
                                    { $size: "$oraganierRatings" },
                                ],
                            },
                            else: 0,
                        },
                    },
                },
            },

            // Structuring Data with Nested Projection
            {
                $project: {
                    _id: 1,
                    destination: 1,
                    categories: 1,
                    startDate: 1,
                    endDate: 1,
                    numberOfPeople: 1,
                    budget: 1,
                    description: 1,
                    coverImage: 1,
                    itinerary: 1,
                    location: {
                        type: "Point",
                        coordinates: ["$location.coordinates"],
                    },

                    organizer: {
                        _id: "$organizer._id",
                        name: "$organizer.fullName",
                        username: "$organizer.username",
                        email: "$organizer.email",
                        avatar: "$organizer.avatar",
                    },
                    participants: {
                        $map: {
                            input: { $ifNull: ["$participants", []] }, // Ensure it's always an array
                            as: "participant",
                            in: {
                                name: "$$participant.fullName",
                                username: "$$participant.username",
                                email: "$$participant.email",
                                avatar: "$$participant.avatar",
                            },
                        },
                    },
                    organizerTotalRatings: 1,
                    organizerAverageRating: {
                        $round: ["$organizerAverageRating", 1],
                    }, // Round to 1 decimal place
                },
            },
        ]);

        if (!trips || trips.length === 0) {
            throw new ApiError(404, "No trips found");
        }

        return res
            .status(200)
            .json(new ApiResponse(201, trips[0], "Trips fetched successfully"));
    } catch (error) {
        console.error("Error in getTrips:", error);
        throw new ApiError(500, "Something went wrong while fetching trips");
    }
});

const joinTrip = asyncHandler(async (req, res) => {
    try {
        const { tripId } = req.params;
        const userId = req.user._id;
        //const { userId } = req.body;

        console.log(`
        tripId: ${tripId}
        userId: ${userId} for joining trip`);

        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        // Check if user is already in the trip
        if (trip.participants.includes(userId)) {
            throw new ApiError(401, "You have already joined this trip");
        }

        // Add user to the trip
        trip.participants.push(userId);
        await trip.save();

        return res
            .status(200)
            .json(new ApiResponse(201, trip, "Joined trip successfully"));
    } catch (error) {
        console.error("Error joining trip:", error);
        throw new ApiError(500, "Something went wrong while joining trip");
        //res.status(500).json({ message: "Internal server error" }, );
    }
});

// trip.controller.js - new method: getNearbyTrips
// const getNearbyTrips = asyncHandler(async (req, res) => {
//     try {
//         // Expect lat, lng, and maxDistance in query parameters
//         const { lat, lng, maxDistance } = req.query;
//         if (!lat || !lng) {
//             throw new ApiError(400, "Latitude and longitude are required");
//         }
//         // Set a default maxDistance (e.g., 10km) if not provided
//         const distanceLimit = maxDistance ? parseInt(maxDistance) : 100000;

//         const trips = await Trip.aggregate([
//             {
//                 $geoNear: {
//                     near: {
//                         type: "Point",
//                         coordinates: [parseFloat(lng), parseFloat(lat)],
//                     },
//                     distanceField: "distance", // Returns distance in meters
//                     maxDistance: distanceLimit,
//                     spherical: true,
//                 },
//             },
//             {
//                 $addFields: {
//                     participantCount: { $size: "$participants" },
//                 },
//             },
//             {
//                 // Sort first by number of participants descending, then by distance ascending
//                 $sort: { participantCount: -1, distance: 1 },
//             },

//             {
//                 $project: {
//                     _id: 1,
//                     destination: 1,
//                     categories: 1,
//                     startDate: 1,
//                     endDate: 1,
//                     participantCount: 1,
//                     distance: 1,
//                     description: 1,
//                     coverImage: 1,

//                     // location: {
//                     //     type: "Point",
//                     //     coordinates: ["$location.coordinates"],
//                     // },
//                 },
//             },
//         ]);

//         if (!trips || trips.length === 0) {
//             console.error("No trips found near your location");
//             throw new ApiError(404, "No trips found near your location");
//         }

//         return res
//             .status(200)
//             .json(new ApiResponse(200, trips, "Trips fetched successfully"));
//     } catch (error) {
//         console.error("Error fetching nearby trips:", error);
//         throw new ApiError(500, "Something went wrong while fetching trips");
//     }
// });

const getNearbyTrips = asyncHandler(async (req, res) => {
    try {
        // Expect lat, lng, and maxDistance in query parameters
        const { lat, lng, maxDistance } = req.query;
        if (!lat || !lng) {
            throw new ApiError(400, "Latitude and longitude are required");
        }
        // Set a default maxDistance (e.g., 10km) if not provided
        const distanceLimit = maxDistance ? parseInt(maxDistance) : 100000;

        const trips = await Trip.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)],
                    },
                    distanceField: "distance", // Returns distance in meters
                    maxDistance: distanceLimit,
                    spherical: true,
                },
            },
            {
                $addFields: {
                    participantCount: { $size: "$participants" },
                },
            },
            // Lookup organizer details
            {
                $lookup: {
                    from: "users",
                    localField: "organizer",
                    foreignField: "_id",
                    as: "organizer",
                },
            },
            { $unwind: "$organizer" },
            // Lookup ratings for the organizer
            {
                $lookup: {
                    from: "reviews",
                    localField: "organizer._id",
                    foreignField: "reviewee",
                    as: "oraganierRatings",
                },
            },
            {
                $addFields: {
                    organizerTotalRatings: { $size: "$oraganierRatings" },
                    organizerAverageRating: {
                        $cond: {
                            if: { $gt: [{ $size: "$oraganierRatings" }, 0] },
                            then: {
                                $divide: [
                                    {
                                        $sum: {
                                            $map: {
                                                input: "$oraganierRatings",
                                                as: "r",
                                                in: "$$r.rating",
                                            },
                                        },
                                    },
                                    { $size: "$oraganierRatings" },
                                ],
                            },
                            else: 0,
                        },
                    },
                },
            },
            {
                // 📌 Sort by (1) Highest Rating of organizer → (2) Most Participants → (3) Nearest Distance
                $sort: {
                    /* organizerAverageRating: -1, */
                    distance: 1,
                    participantCount: -1,
                },
            },
            {
                // 📌 Remove unnecessary fields and keep only required fields for trip cards
                $project: {
                    _id: 1,
                    destination: 1,
                    coverImage: 1,
                    distance: 1, // Distance from user's location
                    location: {
                        type: "Point",
                        coordinates: ["$location.coordinates"],
                    },
                    participantCount: 1, // Number of participants
                    startDate: 1, // Start date of trip
                    endDate: 1, // End date of trip
                    //budget: 1, // Estimated budget
                    "organizer._id": 1,
                    "organizer.fullName": 1,
                    "organizer.avatar": 1,
                    organizerTotalRatings: 1,
                    organizerAverageRating: {
                        $round: ["$organizerAverageRating", 1],
                    }, // Round to 1 decimal place
                },
            },
        ]);

        if (!trips || trips.length === 0) {
            console.error("No trips found near your location");
            throw new ApiError(404, "No trips found near your location");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, trips, "Trips fetched successfully"));
    } catch (error) {
        console.error("Error fetching nearby trips:", error);
        throw new ApiError(500, "Something went wrong while fetching trips");
    }
});

// const getUserTripHistory = asyncHandler(async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const { page = 1, limit = 1 } = req.query; // Pagination support

//         console.log(`
//         userId: ${userId}
//         page: ${page}
//         limit: ${limit}
//         `);

//         if (!userId) {
//             throw new ApiError(400, "User ID is required");
//         }

//         const trips = await Trip.aggregate([
//             {
//                 $match: {
//                     $or: [
//                         { organizer: new mongoose.Types.ObjectId(userId) },
//                         { participants: new mongoose.Types.ObjectId(userId) },
//                     ],
//                 },
//             },
//             {
//                 $lookup: {
//                     from: "users",
//                     localField: "organizer",
//                     foreignField: "_id",
//                     as: "organizerDetails",
//                 },
//             },
//             { $unwind: "$organizerDetails" }, // Convert array into object
//             {
//                 $addFields: {
//                     isOrganizer: {
//                         $eq: [
//                             "$organizer",
//                             new mongoose.Types.ObjectId(userId),
//                         ],
//                     },
//                     participantCount: { $size: "$participants" },
//                 },
//             },
//             {
//                 $project: {
//                     _id: 1,
//                     destination: 1,
//                     startDate: 1,
//                     endDate: 1,
//                     coverImage: 1,
//                     participantCount: 1,
//                     isOrganizer: 1,
//                     organizer: {
//                         _id: "$organizerDetails._id",
//                         name: "$organizerDetails.fullName",
//                         username: "$organizerDetails.username",
//                         avatar: "$organizerDetails.avatar",
//                     },
//                 },
//             },
//             {
//                 $facet: {
//                     organizedTrips: [
//                         { $match: { isOrganizer: true } },
//                         { $sort: { startDate: -1 } },
//                         { $skip: (page - 1) * limit },
//                         { $limit: parseInt(limit) },
//                     ],
//                     participatedTrips: [
//                         { $match: { isOrganizer: false } },
//                         { $sort: { startDate: -1 } },
//                         { $skip: (page - 1) * limit },
//                         { $limit: parseInt(limit) },
//                     ],
//                     totalOrganized: [
//                         { $match: { isOrganizer: true } },
//                         { $count: "count" },
//                     ],
//                     totalParticipated: [
//                         { $match: { isOrganizer: false } },
//                         { $count: "count" },
//                     ],
//                 },
//             },
//         ]);

//         const result = trips[0];
//         return res.status(200).json(
//             new ApiResponse(
//                 201,
//                 {
//                     organizedTrips: result.organizedTrips,
//                     participatedTrips: result.participatedTrips,
//                     totalOrganized: result.totalOrganized[0]?.count || 0,
//                     totalParticipated: result.totalParticipated[0]?.count || 0,
//                 },
//                 "User trip history fetched successfully"
//             )
//         );
//     } catch (error) {
//         console.error("Error fetching trip history:", error);
//         throw new ApiError(
//             500,
//             "Something went wrong while fetching trip history"
//         );
//     }
// });

const getUserTripHistory = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;

        console.log(`userId: ${userId}`);

        if (!userId) {
            throw new ApiError(400, "User ID is required");
        }

        // Aggregate trips where the user is either an organizer or a participant
        const trips = await Trip.aggregate([
            {
                $match: {
                    $or: [
                        { organizer: new mongoose.Types.ObjectId(userId) },
                        { participants: new mongoose.Types.ObjectId(userId) },
                    ],
                },
            },
            {
                $addFields: {
                    role: {
                        $cond: {
                            if: {
                                $eq: [
                                    "$organizer",
                                    new mongoose.Types.ObjectId(userId),
                                ],
                            },
                            then: "organized",
                            else: "participated",
                        },
                    },
                    status: {
                        $switch: {
                            branches: [
                                {
                                    case: { $lt: ["$endDate", new Date()] },
                                    then: "completed",
                                },
                                {
                                    case: { $gt: ["$startDate", new Date()] },
                                    then: "ongoing",
                                },
                            ],
                            default: "cancelled",
                        },
                    },
                },
            },
            {
                $project: {
                    startDate: 1,
                    endDate: 1,
                    destination: 1,
                    coverImage: 1,
                    status: 1,
                    role: 1,
                },
            },
            {
                $sort: { startDate: -1 }, // Sort from newest to oldest
            },
        ]);

        if (!trips.length) {
            return res
                .status(404)
                .json(new ApiResponse(404, [], "No trip history found"));
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    201,
                    trips,
                    "User trip history fetched successfully"
                )
            );
    } catch (error) {
        console.error("Error fetching user trip history:", error);
        throw new ApiError(
            500,
            "Something went wrong while fetching trip history"
        );
    }
});

export {
    postTrip,
    getAllTrip,
    viewTripDetails,
    joinTrip,
    getNearbyTrips,
    getUserTripHistory,
};
