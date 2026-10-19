import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Gallery } from "../models/gallery.model.js";

const uploadGalleryImages = asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        throw new ApiError(400, "At least one image is required")
    }

    const { title } = req.body

    // Create one Gallery document per uploaded file
    const galleryDocs = await Promise.all(
        req.files.map((file) =>
            Gallery.create({
                title: title || "",
                image: `/uploads/${file.filename}`,
            })
        )
    )

    return res
        .status(201)
        .json(new ApiResponse(201, galleryDocs, "Images uploaded successfully"))
})

const getAllGalleryImages = asyncHandler(async (req, res) => {
    const images = await Gallery.find({}).sort({ createdAt: -1 })

    return res
        .status(200)
        .json(new ApiResponse(200, images, "Gallery images fetched successfully"))
})

const deleteGalleryImage = asyncHandler(async (req, res) => {
    const { id } = req.params

    const deletedImage = await Gallery.findByIdAndDelete(id)

    if (!deletedImage) {
        throw new ApiError(404, "Image not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Image deleted successfully"))
})

export { uploadGalleryImages, getAllGalleryImages, deleteGalleryImage }