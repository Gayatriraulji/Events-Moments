import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyCustomer = asyncHandler(async (req, res, next) => {
    const authHeader = req.header("Authorization")
    const token = authHeader?.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : null

    if (!token) {
        throw new ApiError(401, "Unauthorized request")
    }

    let decoded
    try {
        decoded = jwt.verify(token, process.env.CUSTOMER_TOKEN_SECRET)
    } catch (error) {
        throw new ApiError(401, "Session expired. Please verify your email again")
    }

    if (decoded.type !== "customer" || !decoded.email) {
        throw new ApiError(401, "Invalid token")
    }

    req.customerEmail = decoded.email
    next()
})