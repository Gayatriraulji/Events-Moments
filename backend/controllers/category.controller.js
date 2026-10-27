import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Category } from "../models/category.model.js";

const createCategory = asyncHandler(async (req, res) => {
    const { name, description, price, image } = req.body

    if (!name || name.trim() === "") {
        throw new ApiError(400, "Category name is required")
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : (image || "")

    const category = await Category.create({
        name,
        description,
        price: price || 0,
        image: imagePath,
    })

    return res
        .status(201)
        .json(new ApiResponse(201, category, "Category created successfully"))
})

const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({}).sort({ createdAt: -1 })

    return res
        .status(200)
        .json(new ApiResponse(200, categories, "Categories fetched successfully"))
})

const getCategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params

    const category = await Category.findById(id)

    if (!category) {
        throw new ApiError(404, "Category not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, category, "Category fetched successfully"))
})

const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { name, description, price, image } = req.body

    const updateData = { name, description, price }

    if (req.file) {
        updateData.image = `/uploads/${req.file.filename}`
    } else if (image !== undefined && image !== "") {
        updateData.image = image
    }

    const updatedCategory = await Category.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    )

    if (!updatedCategory) {
        throw new ApiError(404, "Category not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedCategory, "Category updated successfully"))
})

const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params

    const deletedCategory = await Category.findByIdAndDelete(id)

    if (!deletedCategory) {
        throw new ApiError(404, "Category not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Category deleted successfully"))
})

export { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory }