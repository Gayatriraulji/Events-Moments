import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Service } from "../models/service.model.js";

const createService = asyncHandler(async (req, res) => {
    const { name, description, highlights, price } = req.body;

    if (!name || name.trim() === "") {
        throw new ApiError(400, "Service name is required");
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    // highlights comes as comma-separated string from form, convert to array
    const highlightsArray = highlights
        ? highlights.split(",").map((item) => item.trim()).filter(Boolean)
        : [];

    const service = await Service.create({
        name,
        description,
        price: Number(price) || 0,
        highlights: highlightsArray,
        image: imagePath,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, service, "Service created successfully"));
});

const getAllServices = asyncHandler(async (req, res) => {
    const services = await Service.find({}).sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, services, "Services fetched successfully"));
});

const getServiceById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
        throw new ApiError(404, "Service not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, service, "Service fetched successfully"));
});

const updateService = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, highlights, isActive, price } = req.body;

    const updateData = { name, description };

    if (price !== undefined) {
        updateData.price = Number(price) || 0;
    }

    if (isActive !== undefined) {
        updateData.isActive = isActive === "true" || isActive === true;
    }

    if (highlights !== undefined) {
        updateData.highlights = highlights.split(",").map((item) => item.trim()).filter(Boolean);
    }

    if (req.file) {
        updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedService = await Service.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!updatedService) {
        throw new ApiError(404, "Service not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedService, "Service updated successfully"));
});

const deleteService = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
        throw new ApiError(404, "Service not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Service deleted successfully"));
});

export { createService, getAllServices, getServiceById, updateService, deleteService };
