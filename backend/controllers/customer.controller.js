import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendEmail } from "../utils/sendEmail.js";
import { Otp } from "../models/otp.model.js";
import { Booking } from "../models/booking.model.js";
import { PackageBooking } from "../models/packageBooking.model.js";

const OTP_VALID_MINUTES = 5
const MAX_ATTEMPTS = 5
const RESEND_GAP_SECONDS = 60

const sendOtp = asyncHandler(async (req, res) => {
    const email = (req.body.email || "").trim().toLowerCase()

    if (!email) {
        throw new ApiError(400, "Email is required")
    }

    // Spam rokne ke liye: 60 second ke andar dobara OTP nahi
    const recent = await Otp.findOne({ email })
    if (recent && Date.now() - recent.createdAt.getTime() < RESEND_GAP_SECONDS * 1000) {
        throw new ApiError(429, "Please wait a minute before requesting another OTP")
    }

    const otp = String(crypto.randomInt(100000, 1000000))
    const otpHash = await bcrypt.hash(otp, 10)

    await Otp.deleteMany({ email })
    await Otp.create({
        email,
        otpHash,
        expiresAt: new Date(Date.now() + OTP_VALID_MINUTES * 60 * 1000),
    })

    await sendEmail({
        to: email,
        subject: "Your login OTP",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #4B3FBF;">Your OTP</h2>
                <p>Use this code to view your bookings:</p>
                <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px;">${otp}</p>
                <p>This code is valid for ${OTP_VALID_MINUTES} minutes. Do not share it with anyone.</p>
            </div>
        `,
    })

    // Hamesha same message, taaki bahar se pata na chale ki kaunsa email registered hai
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "If this email is valid, an OTP has been sent"))
})

const verifyOtp = asyncHandler(async (req, res) => {
    const email = (req.body.email || "").trim().toLowerCase()
    const otp = (req.body.otp || "").trim()

    if (!email || !otp) {
        throw new ApiError(400, "Email and OTP are required")
    }

    const record = await Otp.findOne({ email })

    if (!record) {
        throw new ApiError(400, "OTP expired or not requested. Please request a new one")
    }

    if (record.attempts >= MAX_ATTEMPTS) {
        await Otp.deleteMany({ email })
        throw new ApiError(429, "Too many wrong attempts. Please request a new OTP")
    }

    const isMatch = await bcrypt.compare(otp, record.otpHash)

    if (!isMatch) {
        record.attempts += 1
        await record.save()
        throw new ApiError(400, "Invalid OTP")
    }

    // Ek OTP sirf ek baar chalta hai
    await Otp.deleteMany({ email })

    const token = jwt.sign(
        { email, type: "customer" },
        process.env.CUSTOMER_TOKEN_SECRET,
        { expiresIn: "2h" }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, { token, email }, "OTP verified successfully"))
})

const getMyBookings = asyncHandler(async (req, res) => {
    const email = req.customerEmail

    // collation se email ka case (Gmail@x.com vs gmail@x.com) ignore hota hai
    const categoryBookings = await Booking.find({ email })
        .collation({ locale: "en", strength: 2 })
        .populate("category", "name price image")

    const packageBookings = await PackageBooking.find({ email })
        .collation({ locale: "en", strength: 2 })
        .populate("package", "name price image")

    const bookings = [
        ...categoryBookings.map((b) => ({
            _id: b._id,
            type: "Category",
            categoryId: b.category?._id,
            itemName: b.category?.name || "—",
            price: b.category?.price || 0,
            image: b.category?.image || "",
            eventDate: b.eventDate,
            startTime: b.startTime,
            endTime: b.endTime,
            guests: b.guests,
            status: b.status,
            paymentStatus: b.paymentStatus || "pending",
            razorpayPaymentId: b.razorpayPaymentId || "",
            amountPaid: b.amountPaid || 0,
            createdAt: b.createdAt,
        })),
        ...packageBookings.map((b) => ({
            _id: b._id,
            type: "Package",
            packageId: b.package?._id,
            itemName: b.package?.name || "—",
            price: b.package?.price || 0,
            image: b.package?.image || "",
            eventDate: b.eventDate,
            startTime: b.startTime,
            endTime: b.endTime,
            guests: b.guests,
            status: b.status,
            paymentStatus: b.paymentStatus || "pending",
            razorpayPaymentId: b.razorpayPaymentId || "",
            amountPaid: b.amountPaid || 0,
            createdAt: b.createdAt,
        })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return res
        .status(200)
        .json(new ApiResponse(200, bookings, "Bookings fetched successfully"))
})

export { sendOtp, verifyOtp, getMyBookings }