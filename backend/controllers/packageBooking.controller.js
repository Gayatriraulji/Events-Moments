import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { PackageBooking } from "../models/packageBooking.model.js";
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
        d.setUTCHours(h - 5, m - 30, 0, 0) // Convert IST to UTC
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

        const sendReminder = async () => {
            try {
                const allBookingsOnDate = await PackageBooking.find({
                    eventDate: {
                        $gte: new Date(new Date(booking.eventDate).setHours(0, 0, 0, 0)),
                        $lt: new Date(new Date(booking.eventDate).setHours(23, 59, 59, 999)),
                    },
                    status: "confirmed",
                }).populate("package", "name")

                const eventList = allBookingsOnDate.map(b =>
                    `• ${b.name} — ${b.package?.name || "Package"} (${formatTime(b.startTime)} - ${formatTime(b.endTime)})`
                ).join("<br/>")

                await sendEmail({
                    to: ADMIN_EMAIL,
                    subject: `⏰ Reminder: ${allBookingsOnDate.length} Package Event(s) on ${new Date(booking.eventDate).toLocaleDateString("en-IN")}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px;">
                            <h2 style="color: #C5A059;">⏰ 2-Day Event Reminder</h2>
                            <p>You have <strong>${allBookingsOnDate.length}</strong> confirmed package event(s) on <strong>${new Date(booking.eventDate).toLocaleDateString("en-IN")}</strong>:</p>
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
        }

        if (reminderDate <= now) {
            await sendReminder()
        } else {
            const msDelay = reminderDate.getTime() - now.getTime()
            setTimeout(sendReminder, msDelay)
            console.log(`Admin reminder scheduled for ${reminderDate.toISOString()} (package booking: ${booking._id})`)
        }
    } catch (err) {
        console.error("Failed to schedule admin reminder:", err.message)
    }
}

const createPackageBooking = asyncHandler(async (req, res) => {
    const packageId = req.body.package || req.body.packageId
    const { name, email, phone, eventDate, startTime, endTime, guests, message } = req.body

    if (!packageId || !name || !email || !phone || !eventDate || !startTime || !endTime) {
        throw new ApiError(400, "Package, name, email, phone, event date, start time and end time are required")
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

    const sameDayConfirmed = await PackageBooking.find({
        package: packageId,
        status: "confirmed",
        eventDate: { $gte: startOfDay, $lte: endOfDay },
    })

    const hasOverlap = sameDayConfirmed.some((existing) => {
        return startTime < existing.endTime && endTime > existing.startTime
    })

    if (hasOverlap) {
        throw new ApiError(409, "This time slot is already reserved for this date. Please choose a different time slot.")
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
        const eventDateParsed = new Date(currentBooking.eventDate)
        const startOfDay = new Date(eventDateParsed)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(eventDateParsed)
        endOfDay.setHours(23, 59, 59, 999)

        const sameDayConfirmed = await PackageBooking.find({
            _id: { $ne: id },
            package: currentBooking.package,
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

    const updatedBooking = await PackageBooking.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true }
    ).populate("package", "name price")

    if (status === "confirmed") {
        const itemName = updatedBooking.package?.name || "Package"
        const eventDateObj = new Date(updatedBooking.eventDate)

        // Generate ICS calendar file
        const icsContent = generateICS({
            summary: `${itemName} — ${updatedBooking.name}`,
            description: `Package booking confirmed for ${updatedBooking.name}. Guests: ${updatedBooking.guests}. Phone: ${updatedBooking.phone}.`,
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
            price: updatedBooking.package?.price || 0,
        })

        // Send confirmation email to customer with invoice + calendar
        await sendEmail({
            to: updatedBooking.email,
            subject: "Your Package Booking is Confirmed! 🎉",
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
            subject: `✅ New Confirmed Package Booking: ${itemName} on ${eventDateObj.toLocaleDateString("en-IN")}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #C5A059;">✅ Package Booking Confirmed</h2>
                    <p>A package booking has been confirmed:</p>
                    <p><strong>Client:</strong> ${updatedBooking.name}</p>
                    <p><strong>Package:</strong> ${itemName}</p>
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