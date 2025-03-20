import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Review } from "../models/review.model.js";
import mongoose from "mongoose";

// Create a Review
const createReview = asyncHandler(async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const { revieweeId } = req.params;
        const reviewerId = req.user._id;

        console.log("reviewerId:", reviewerId, typeof reviewerId);
        console.log("revieweeId:", revieweeId, typeof revieweeId);

        console.log(`
        Review created by: ${reviewerId}
        revieweeId: ${revieweeId}
        rating: ${rating}
        comment: ${comment}
        `);

        if (reviewerId.toString() === revieweeId.toString()) {
            return res
                .status(400)
                .json(new ApiResponse(400, null, "You cannot review yourself"));
            //throw new ApiError(400, "You cannot review yourself"); //bad request:400
        }

        if (!rating || !comment) {
            throw new ApiError(401, "Rating and comment are required");
        }

        const review = await Review.create({
            reviewer: reviewerId, // Reference to the user who is giving the review
            reviewee: revieweeId, // Reference to the user who is being reviewed
            rating,
            comment,
        });
        return res
            .status(201)
            .json(new ApiResponse(201, review, "Review created successfully"));
    } catch (error) {
        console.error("Error creating review:", error);
        throw new ApiError(500, "Something went wrong while creating review");
    }
});

// Get all reviews
const getAllReviews = asyncHandler(async (req, res) => {
    try {
        let revieweeId;

        // Determine the revieweeId based on req.params or req.user_id
        if (req.params.revieweeId) {
            revieweeId = req.params.revieweeId;
            console.log("Reviewee ID from params: ", revieweeId);
        } else if (req.user && req.user._id) {
            revieweeId = req.user._id;
            console.log("Reviewee ID from user: ", revieweeId);
        } else {
            throw new ApiError(401, "Reviewee ID not provided");
        }

        const reviews = await Review.aggregate([
            {
                $match: {
                    reviewee: new mongoose.Types.ObjectId(revieweeId),
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "reviewer",
                    foreignField: "_id",
                    as: "reviews",
                },
            },
            {
                $unwind: "$reviews",
            },
            {
                $project: {
                    reviewer: "$reviews._id",
                    fullName: "$reviews.fullName",
                    username: "$reviews.username",
                    avatar: "$reviews.avatar",
                    rating: 1,
                    comment: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ]);
        if (!reviews) {
            throw new ApiError(404, "Reviews not found");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(201, reviews, "Reviews fetched successfully")
            );
    } catch (error) {
        console.error("Error fetching all reviews:", error);
        throw new ApiError(500, "Something went wrong while fetching reviews");
    }
});

const getRatings = async (req, res) => {
    try {
        const revieweeId = req.params.revieweeId;
        console.log("revieweeId: ", revieweeId);

        const ratings = await Review.aggregate([
            {
                $match: { reviewee: new mongoose.Types.ObjectId(revieweeId) },
            },
            {
                $group: {
                    _id: "$rating",
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { _id: -1 }, // Sort in descending order of stars for display
            },
        ]);

        const totalCount = ratings.reduce(
            (sum, rating) => sum + rating.count,
            0
        );
        const totalRatingValue = ratings.reduce(
            (sum, rating) => sum + rating._id * rating.count,
            0
        );
        const averageRating =
            totalCount > 0 ? totalRatingValue / totalCount : 0;

        // Format the result to match the image structure
        const formattedRatings = ratings.map((rating) => ({
            stars: rating._id,
            count: rating.count,
            percentage: ((rating.count / totalCount) * 100).toFixed(0), // Calculate percentage
        }));

        return res.status(200).json(
            new ApiResponse(
                201,
                {
                    averageRating: averageRating.toFixed(1),
                    totalCount,
                    ratings: formattedRatings,
                },
                "Reviews fetched successfully"
            )
        );
    } catch (error) {
        console.error("Error getting review ratings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export { createReview, getAllReviews, getRatings };
