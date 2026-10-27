import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Package } from "../models/package.model.js";

const createPackage = asyncHandler(async (req, res) => {
    const { name, description, price, tier, inclusions } = req.body

    if (!name || name.trim() === "") {
        throw new ApiError(400, "Package name is required")
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : ""

    // inclusions comes as comma-separated string from form, convert to array
    const inclusionsArray = inclusions
        ? inclusions.split(",").map((item) => item.trim()).filter(Boolean)
        : []

    const pkg = await Package.create({
        name,
        description,
        price: price || 0,
        tier: tier || "basic",
        inclusions: inclusionsArray,
        image: imagePath,
    })

    return res
        .status(201)
        .json(new ApiResponse(201, pkg, "Package created successfully"))
})

const getAllPackages = asyncHandler(async (req, res) => {
    const packages = await Package.find({})

    return res
        .status(200)
        .json(new ApiResponse(200, packages, "Packages fetched successfully"))
})

const getPackageById = asyncHandler(async (req, res) => {
    const { id } = req.params

    const pkg = await Package.findById(id)

    if (!pkg) {
        throw new ApiError(404, "Package not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, pkg, "Package fetched successfully"))
})

const updatePackage = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { name, description, price, tier, inclusions } = req.body

    const updateData = { name, description, price, tier }

    if (inclusions !== undefined) {
        updateData.inclusions = inclusions.split(",").map((item) => item.trim()).filter(Boolean)
    }

    if (req.file) {
        updateData.image = `/uploads/${req.file.filename}`
    }

    const updatedPackage = await Package.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    )

    if (!updatedPackage) {
        throw new ApiError(404, "Package not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPackage, "Package updated successfully"))
})

const deletePackage = asyncHandler(async (req, res) => {
    const { id } = req.params

    const deletedPackage = await Package.findByIdAndDelete(id)

    if (!deletedPackage) {
        throw new ApiError(404, "Package not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Package deleted successfully"))
})

const createCustomPackage = asyncHandler(async (req, res) => {
    const { name, description, price, tier, inclusions, image } = req.body

    if (!name || name.trim() === "") {
        throw new ApiError(400, "Event / Package name is required")
    }

    let inclusionsArray = []
    if (Array.isArray(inclusions)) {
        inclusionsArray = inclusions
    } else if (typeof inclusions === "string") {
        inclusionsArray = inclusions.split(",").map((item) => item.trim()).filter(Boolean)
    }

    const defaultImages = [
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
        "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&q=80",
        "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80",
        "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=800&q=80",
    ]
    const chosenImage = image || defaultImages[Math.floor(Math.random() * defaultImages.length)]

    const pkg = await Package.create({
        name: name.trim(),
        description: description || `Custom bespoke package including ${inclusionsArray.length} selected services.`,
        price: Number(price) || 0,
        tier: ["basic", "premium", "luxury"].includes(tier) ? tier : "luxury",
        inclusions: inclusionsArray,
        image: chosenImage,
        isCustom: true,
    })

    return res
        .status(201)
        .json(new ApiResponse(201, pkg, "Custom package created successfully"))
})

export { createPackage, createCustomPackage, getAllPackages, getPackageById, updatePackage, deletePackage }