import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Trip } from "../models/trip.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
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
            `
        );

        if (
            !destination ||
            !startDate ||
            !endDate ||
            !numberOfPeople ||
            !budget ||
            !description
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
const getAllTrip = asyncHandler(async (req, res) => {
    try {
        const trip = await Trip.find(req.trip)
            .populate("organizer", "fullName username email avatar")
            .populate("participants", "fullName username email avatar");

        //console.log("All trips: ", trip);
        if (!trip) {
            console.error("Error in getTrip:", error);
            throw new ApiError(404, "Trips not found");
        }

        return res
            .status(200)
            .json(new ApiResponse(201, trip, "Trips fetched successfully"));
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

                    organizer: {
                        name: "$organizer.fullName",
                        username: "$organizer.username",
                        email: "$organizer.email",
                        avatar: "$organizer.avatar",
                    },

                    participants: {
                        $map: {
                            input: "$participants",
                            as: "participant",
                            in: {
                                name: "$$participant.fullName",
                                username: "$$participant.username",
                                email: "$$participant.email",
                                avatar: "$$participant.avatar",
                            },
                        },
                    },
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
        const { userId } = req.body;

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

export { postTrip, getAllTrip, viewTripDetails, joinTrip };
