import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Booking } from "../models/booking.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateInvoice } from "../utils/generateInvoice.js";

const ADMIN_EMAIL = process.env.BREVO_SENDER_EMAIL;

const formatTime = (time24) => {
    if (!time24) return ""
    const [hourStr, minute] = time24.split(":")
    let hour = parseInt(hourStr, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    hour = hour % 12 || 12
    return `${hour}:${minute} ${ampm}`
}

// Generate ICS calendar file content
const generateICS = ({ summary, description, location, startDate, startTime, endTime }) => {
    const parseDateTime = (dateObj, timeStr) => {
        const d = new Date(dateObj)
        const [h, m] = timeStr.split(":").map(Number)
        d.setUTCHours(h - 5, m - 30, 0, 0) // Convert IST to UTC (IST = UTC+5:30)
        return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    }
    const dtStart = parseDateTime(startDate, startTime)
    const dtEnd = parseDateTime(startDate, endTime)
    const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    return [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//EventoAdmin//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:REQUEST",
        "BEGIN:VEVENT",
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `DTSTAMP:${now}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
        `LOCATION:${location || "Venue TBD"}`,
        "STATUS:CONFIRMED",
        "BEGIN:VALARM",
        "TRIGGER:-PT2D",
        "ACTION:DISPLAY",
        "DESCRIPTION:Event Reminder - 2 days before",
        "END:VALARM",
        "END:VEVENT",
        "END:VCALENDAR",
    ].join("\r\n")
}

// Schedule admin reminder email 2 days before event
const scheduleAdminReminder = async (booking, itemName) => {
    try {
        const eventDate = new Date(booking.eventDate)
        const reminderDate = new Date(eventDate)
        reminderDate.setDate(reminderDate.getDate() - 2)
        const now = new Date()

        if (reminderDate <= now) {
            // Event is within 2 days or already passed — send immediately
            await sendEmail({
                to: ADMIN_EMAIL,
                subject: `⏰ Reminder: Upcoming Event in 2 Days — ${itemName}`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2 style="color: #C5A059;">⏰ Event Reminder</h2>
                        <p>This is a reminder that the following event is coming up soon:</p>
                        <p><strong>Client:</strong> ${booking.name}</p>
                        <p><strong>Email:</strong> ${booking.email}</p>
                        <p><strong>Phone:</strong> ${booking.phone}</p>
                        <p><strong>Category:</strong> ${itemName}</p>
                        <p><strong>Event Date:</strong> ${eventDate.toLocaleDateString("en-IN")}</p>
                        <p><strong>Time:</strong> ${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}</p>
                        <p><strong>Guests:</strong> ${booking.guests}</p>
                        <p>Please ensure all preparations are in place.</p>
                        <p>— EventoAdmin System</p>
                    </div>
                `,
            })
            return
        }

        // Calculate milliseconds until 2 days before
        const msDelay = reminderDate.getTime() - now.getTime()
        setTimeout(async () => {
            try {
                const allBookingsOnDate = await Booking.find({
                    eventDate: {
                        $gte: new Date(eventDate.setHours(0, 0, 0, 0)),
                        $lt: new Date(eventDate.setHours(23, 59, 59, 999)),
                    },
                    status: "confirmed",
                }).populate("category", "name")

                const eventList = allBookingsOnDate.map(b =>
                    `• ${b.name} — ${b.category?.name || "Event"} (${formatTime(b.startTime)} - ${formatTime(b.endTime)})`
                ).join("<br/>")

                await sendEmail({
                    to: ADMIN_EMAIL,
                    subject: `⏰ Reminder: ${allBookingsOnDate.length} Event(s) Tomorrow — ${new Date(booking.eventDate).toLocaleDateString("en-IN")}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px;">
                            <h2 style="color: #C5A059;">⏰ 2-Day Event Reminder</h2>
                            <p>You have <strong>${allBookingsOnDate.length}</strong> confirmed event(s) on <strong>${new Date(booking.eventDate).toLocaleDateString("en-IN")}</strong>:</p>
                            <div style="background:#f8f9fa; padding:12px; border-radius:8px; margin:12px 0;">
                                ${eventList}
                            </div>
                            <p>Please ensure all preparations are in place.</p>
                            <p>— EventoAdmin System</p>
                        </div>
                    `,
                })
            } catch (err) {
                console.error("Failed to send admin reminder:", err.message)
            }
        }, msDelay)

        console.log(`Admin reminder scheduled for ${reminderDate.toISOString()} (booking: ${booking._id})`)
    } catch (err) {
        console.error("Failed to schedule admin reminder:", err.message)
    }
}

const createBooking = asyncHandler(async (req, res) => {
    const { category, name, email, phone, eventDate, startTime, endTime, guests, message } = req.body

    if (!category || !name || !email || !phone || !eventDate || !startTime || !endTime) {
        throw new ApiError(400, "Category, name, email, phone, event date, start time and end time are required")
    }

    if (startTime >= endTime) {
        throw new ApiError(400, "Start time must be before end time")
    }

    // Check for confirmed bookings on the same date with overlapping time slot
    const eventDateParsed = new Date(eventDate)
    const startOfDay = new Date(eventDateParsed)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(eventDateParsed)
    endOfDay.setHours(23, 59, 59, 999)

    const sameDayConfirmed = await Booking.find({
        category,
        status: "confirmed",
        eventDate: { $gte: startOfDay, $lte: endOfDay },
    })

    const hasOverlap = sameDayConfirmed.some((existing) => {
        return startTime < existing.endTime && endTime > existing.startTime
    })

    if (hasOverlap) {
        throw new ApiError(409, "This time slot is already reserved for this date. Please choose a different time slot.")
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
        const eventDateParsed = new Date(currentBooking.eventDate)
        const startOfDay = new Date(eventDateParsed)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(eventDateParsed)
        endOfDay.setHours(23, 59, 59, 999)

        const sameDayConfirmed = await Booking.find({
            _id: { $ne: id },
            category: currentBooking.category,
            status: "confirmed",
            eventDate: { $gte: startOfDay, $lte: endOfDay },
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
        const itemName = updatedBooking.category?.name || "Event"
        const eventDateObj = new Date(updatedBooking.eventDate)

        // Generate ICS calendar file
        const icsContent = generateICS({
            summary: `${itemName} — ${updatedBooking.name}`,
            description: `Booking confirmed for ${updatedBooking.name}. Guests: ${updatedBooking.guests}. Phone: ${updatedBooking.phone}.`,
            location: "Venue TBD",
            startDate: eventDateObj,
            startTime: updatedBooking.startTime,
            endTime: updatedBooking.endTime,
        })
        const icsBase64 = Buffer.from(icsContent).toString("base64")

        const pdfBuffer = await generateInvoice({
            _id: updatedBooking._id,
            name: updatedBooking.name,
            email: updatedBooking.email,
            phone: updatedBooking.phone,
            itemName,
            eventDate: updatedBooking.eventDate,
            startTime: updatedBooking.startTime,
            endTime: updatedBooking.endTime,
            guests: updatedBooking.guests,
            price: updatedBooking.category?.price || 0,
        })

        // Send confirmation email to customer with invoice + calendar
        await sendEmail({
            to: updatedBooking.email,
            subject: "Your Booking is Confirmed! 🎉",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #4B3FBF;">Booking Confirmed 🎉</h2>
                    <p>Hi ${updatedBooking.name},</p>
                    <p>Your booking for <strong>${itemName}</strong> has been confirmed.</p>
                    <p><strong>Event Date:</strong> ${eventDateObj.toLocaleDateString("en-IN")}</p>
                    <p><strong>Time:</strong> ${formatTime(updatedBooking.startTime)} - ${formatTime(updatedBooking.endTime)}</p>
                    <p><strong>Guests:</strong> ${updatedBooking.guests}</p>
                    <p>📎 Your invoice is attached. A calendar invite (.ics) is also included — open it to save this event to your calendar.</p>
                    <p>We look forward to making your event memorable!</p>
                    <p>— EventoAdmin Team</p>
                </div>
            `,
            attachments: [
                {
                    name: "invoice.pdf",
                    content: pdfBuffer.toString("base64"),
                },
                {
                    name: "event_reminder.ics",
                    content: icsBase64,
                },
            ],
        })

        // Send notification to admin with calendar
        await sendEmail({
            to: ADMIN_EMAIL,
            subject: `✅ New Confirmed Booking: ${itemName} on ${eventDateObj.toLocaleDateString("en-IN")}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #C5A059;">✅ Booking Confirmed</h2>
                    <p>A booking has been confirmed:</p>
                    <p><strong>Client:</strong> ${updatedBooking.name}</p>
                    <p><strong>Category:</strong> ${itemName}</p>
                    <p><strong>Date:</strong> ${eventDateObj.toLocaleDateString("en-IN")}</p>
                    <p><strong>Time:</strong> ${formatTime(updatedBooking.startTime)} - ${formatTime(updatedBooking.endTime)}</p>
                    <p><strong>Guests:</strong> ${updatedBooking.guests}</p>
                    <p>📅 Open the attached .ics file to save this event to your calendar.</p>
                    <p>— EventoAdmin System</p>
                </div>
            `,
            attachments: [
                {
                    name: "event_calendar.ics",
                    content: icsBase64,
                },
            ],
        })

        // Schedule 2-day reminder for admin
        await scheduleAdminReminder(updatedBooking, itemName)
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