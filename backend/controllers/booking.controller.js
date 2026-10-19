import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Booking } from "../models/booking.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateInvoice } from "../utils/generateInvoice.js";

const formatTime = (time24) => {
    if (!time24) return ""
    const [hourStr, minute] = time24.split(":")
    let hour = parseInt(hourStr, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    hour = hour % 12 || 12
    return `${hour}:${minute} ${ampm}`
}

const createBooking = asyncHandler(async (req, res) => {
    const { category, name, email, phone, eventDate, startTime, endTime, guests, message } = req.body

    if (!category || !name || !email || !phone || !eventDate || !startTime || !endTime) {
        throw new ApiError(400, "Category, name, email, phone, event date, start time and end time are required")
    }

    if (startTime >= endTime) {
        throw new ApiError(400, "Start time must be before end time")
    }

    const sameDayConfirmed = await Booking.find({
        category,
        status: "confirmed",
        eventDate: new Date(eventDate),
    })

    const hasOverlap = sameDayConfirmed.some((existing) => {
        return startTime < existing.endTime && endTime > existing.startTime
    })

    if (hasOverlap) {
        throw new ApiError(409, "This time slot overlaps with an already confirmed booking for this date.")
    }

    const booking = await Booking.create({
        category,
        name,
        email,
        phone,
        eventDate,
        startTime,
        endTime,
        guests: guests || 1,
        message,
    })

    return res
        .status(201)
        .json(new ApiResponse(201, booking, "Booking created successfully"))
})

const getAllBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({}).populate("category", "name price image")

    return res
        .status(200)
        .json(new ApiResponse(200, bookings, "Bookings fetched successfully"))
})

const updateBookingStatus = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { status } = req.body

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
        throw new ApiError(400, "Invalid status value")
    }

    const currentBooking = await Booking.findById(id)

    if (!currentBooking) {
        throw new ApiError(404, "Booking not found")
    }

    if (status === "confirmed") {
        const sameDayConfirmed = await Booking.find({
            _id: { $ne: id },
            category: currentBooking.category,
            status: "confirmed",
            eventDate: currentBooking.eventDate,
        })

        const hasOverlap = sameDayConfirmed.some((existing) => {
            return currentBooking.startTime < existing.endTime && currentBooking.endTime > existing.startTime
        })

        if (hasOverlap) {
            throw new ApiError(409, "Cannot confirm — this time slot overlaps with another confirmed booking.")
        }
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true }
    ).populate("category", "name price")

    if (status === "confirmed") {
        const pdfBuffer = await generateInvoice({
            _id: updatedBooking._id,
            name: updatedBooking.name,
            email: updatedBooking.email,
            phone: updatedBooking.phone,
            itemName: updatedBooking.category?.name || "Event",
            eventDate: updatedBooking.eventDate,
            startTime: updatedBooking.startTime,
            endTime: updatedBooking.endTime,
            guests: updatedBooking.guests,
            price: updatedBooking.category?.price || 0,
        })

        await sendEmail({
            to: updatedBooking.email,
            subject: "Your Booking is Confirmed!",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #4B3FBF;">Booking Confirmed 🎉</h2>
                    <p>Hi ${updatedBooking.name},</p>
                    <p>Your booking for <strong>${updatedBooking.category?.name || "your event"}</strong> has been confirmed.</p>
                    <p><strong>Event Date:</strong> ${new Date(updatedBooking.eventDate).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> ${formatTime(updatedBooking.startTime)} - ${formatTime(updatedBooking.endTime)}</p>
                    <p><strong>Guests:</strong> ${updatedBooking.guests}</p>
                    <p>Please find your invoice attached.</p>
                    <p>We look forward to making your event memorable!</p>
                    <p>— EventoAdmin Team</p>
                </div>
            `,
            attachment: {
                name: "invoice.pdf",
                content: pdfBuffer.toString("base64"),
            },
        })
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedBooking, "Booking status updated"))
})

const deleteBooking = asyncHandler(async (req, res) => {
    const { id } = req.params

    const deletedBooking = await Booking.findByIdAndDelete(id)

    if (!deletedBooking) {
        throw new ApiError(404, "Booking not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Booking deleted successfully"))
})

export { createBooking, getAllBookings, updateBookingStatus, deleteBooking }