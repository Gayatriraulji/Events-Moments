import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Review } from "../models/review.model.js";

const createReview = asyncHandler(async (req, res) => {
    const { name, email, rating, comment } = req.body

    if (!name || !email || !rating || !comment) {
        throw new ApiError(400, "Name, email, rating and comment are required")
    }

    if (rating < 1 || rating > 5) {
        throw new ApiError(400, "Rating must be between 1 and 5")
    }

    const review = await Review.create({ name, email, rating, comment })

    return res
        .status(201)
        .json(new ApiResponse(201, review, "Review submitted successfully. It will be visible after approval."))
})

const getApprovedReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ status: "approved" }).sort({ createdAt: -1 })

    return res
        .status(200)
        .json(new ApiResponse(200, reviews, "Approved reviews fetched successfully"))
})

const getAllReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({}).sort({ createdAt: -1 })

    return res
        .status(200)
        .json(new ApiResponse(200, reviews, "All reviews fetched successfully"))
})

const updateReviewStatus = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { status } = req.body

    if (!["pending", "approved", "rejected"].includes(status)) {
        throw new ApiError(400, "Invalid status value")
    }

    const updatedReview = await Review.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true }
    )

    if (!updatedReview) {
        throw new ApiError(404, "Review not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedReview, "Review status updated"))
})

const deleteReview = asyncHandler(async (req, res) => {
    const { id } = req.params

    const deletedReview = await Review.findByIdAndDelete(id)

    if (!deletedReview) {
        throw new ApiError(404, "Review not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Review deleted successfully"))
})

export { createReview, getApprovedReviews, getAllReviews, updateReviewStatus, deleteReview }