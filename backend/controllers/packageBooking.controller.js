import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { PackageBooking } from "../models/packageBooking.model.js";
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

const createPackageBooking = asyncHandler(async (req, res) => {
    const { package: packageId, name, email, phone, eventDate, startTime, endTime, guests, message } = req.body

    if (!packageId || !name || !email || !phone || !eventDate || !startTime || !endTime) {
        throw new ApiError(400, "Package, name, email, phone, event date, start time and end time are required")
    }

    if (startTime >= endTime) {
        throw new ApiError(400, "Start time must be before end time")
    }

    const sameDayConfirmed = await PackageBooking.find({
        package: packageId,
        status: "confirmed",
        eventDate: new Date(eventDate),
    })

    const hasOverlap = sameDayConfirmed.some((existing) => {
        return startTime < existing.endTime && endTime > existing.startTime
    })

    if (hasOverlap) {
        throw new ApiError(409, "This time slot overlaps with an already confirmed booking for this package.")
    }

    const booking = await PackageBooking.create({
        package: packageId,
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
        .json(new ApiResponse(201, booking, "Package booking created successfully"))
})

const getAllPackageBookings = asyncHandler(async (req, res) => {
    const bookings = await PackageBooking.find({}).populate("package", "name price tier image")

    return res
        .status(200)
        .json(new ApiResponse(200, bookings, "Package bookings fetched successfully"))
})

const updatePackageBookingStatus = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { status } = req.body

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
        throw new ApiError(400, "Invalid status value")
    }

    const currentBooking = await PackageBooking.findById(id)

    if (!currentBooking) {
        throw new ApiError(404, "Package booking not found")
    }

    if (status === "confirmed") {
        const sameDayConfirmed = await PackageBooking.find({
            _id: { $ne: id },
            package: currentBooking.package,
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

    const updatedBooking = await PackageBooking.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true }
    ).populate("package", "name price")

    if (status === "confirmed") {
        const pdfBuffer = await generateInvoice({
            _id: updatedBooking._id,
            name: updatedBooking.name,
            email: updatedBooking.email,
            phone: updatedBooking.phone,
            itemName: updatedBooking.package?.name || "Package",
            eventDate: updatedBooking.eventDate,
            startTime: updatedBooking.startTime,
            endTime: updatedBooking.endTime,
            guests: updatedBooking.guests,
            price: updatedBooking.package?.price || 0,
        })

        await sendEmail({
            to: updatedBooking.email,
            subject: "Your Package Booking is Confirmed!",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #4B3FBF;">Booking Confirmed 🎉</h2>
                    <p>Hi ${updatedBooking.name},</p>
                    <p>Your booking for <strong>${updatedBooking.package?.name || "your package"}</strong> has been confirmed.</p>
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
        .json(new ApiResponse(200, updatedBooking, "Package booking status updated"))
})

const deletePackageBooking = asyncHandler(async (req, res) => {
    const { id } = req.params

    const deletedBooking = await PackageBooking.findByIdAndDelete(id)

    if (!deletedBooking) {
        throw new ApiError(404, "Package booking not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Package booking deleted successfully"))
})

export { createPackageBooking, getAllPackageBookings, updatePackageBookingStatus, deletePackageBooking }