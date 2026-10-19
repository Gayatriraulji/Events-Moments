import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getRazorpayInstance } from "../config/razorpay.js";
import { Booking } from "../models/booking.model.js";
import { PackageBooking } from "../models/packageBooking.model.js";
import { generateInvoice } from "../utils/generateInvoice.js";
import { sendEmail } from "../utils/sendEmail.js";

const formatTime = (time24) => {
    if (!time24) return "";
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
};

// 1. Get public key for frontend checkout
const getRazorpayKey = asyncHandler(async (req, res) => {
    const key = process.env.RAZORPAY_KEY_ID;
    if (!key) {
        throw new ApiError(500, "Razorpay Key ID is not configured on server");
    }
    return res.status(200).json(new ApiResponse(200, { key }, "Razorpay Key fetched"));
});

// 2. Create Razorpay Order
const createRazorpayOrder = asyncHandler(async (req, res) => {
    const { amount, receipt, notes } = req.body;

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
        throw new ApiError(400, "Valid payment amount is required");
    }

    const razorpay = getRazorpayInstance();
    const options = {
        amount: Math.round(numAmount * 100), // in paise
        currency: "INR",
        receipt: receipt || `rcpt_${Date.now()}`,
        notes: notes || {},
    };

    try {
        const order = await razorpay.orders.create(options);
        return res.status(200).json(
            new ApiResponse(200, {
                order,
                key: process.env.RAZORPAY_KEY_ID
            }, "Razorpay order created successfully")
        );
    } catch (error) {
        console.error("Razorpay order creation error:", error);
        throw new ApiError(500, error.message || "Failed to create Razorpay order");
    }
});

// 3. Verify Payment and Confirm Booking
const verifyAndConfirmBooking = asyncHandler(async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        bookingType, // "package" or "category"
        bookingData,
        existingBookingId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        throw new ApiError(400, "Missing payment verification parameters");
    }

    // Verify HMAC SHA256 signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
        throw new ApiError(500, "Razorpay key secret is not configured on server");
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        throw new ApiError(400, "Invalid payment signature! Verification failed.");
    }

    // Handle existing booking payment (e.g. from My Bookings)
    if (existingBookingId) {
        let updatedBooking = null;
        let itemName = "Event Service";
        let itemPrice = 0;

        if (bookingType === "package") {
            updatedBooking = await PackageBooking.findByIdAndUpdate(
                existingBookingId,
                {
                    $set: {
                        paymentStatus: "paid",
                        paymentMethod: "razorpay",
                        razorpayOrderId: razorpay_order_id,
                        razorpayPaymentId: razorpay_payment_id,
                        razorpaySignature: razorpay_signature,
                        amountPaid: bookingData?.amount || 0,
                        status: "confirmed",
                    },
                },
                { new: true }
            ).populate("package", "name price");
            itemName = updatedBooking?.package?.name || "Package";
            itemPrice = updatedBooking?.package?.price || updatedBooking?.amountPaid || 0;
        } else {
            updatedBooking = await Booking.findByIdAndUpdate(
                existingBookingId,
                {
                    $set: {
                        paymentStatus: "paid",
                        paymentMethod: "razorpay",
                        razorpayOrderId: razorpay_order_id,
                        razorpayPaymentId: razorpay_payment_id,
                        razorpaySignature: razorpay_signature,
                        amountPaid: bookingData?.amount || 0,
                        status: "confirmed",
                    },
                },
                { new: true }
            ).populate("category", "name price");
            itemName = updatedBooking?.category?.name || "Category Event";
            itemPrice = updatedBooking?.category?.price || updatedBooking?.amountPaid || 0;
        }

        if (!updatedBooking) {
            throw new ApiError(404, "Booking not found to update payment");
        }

        // Generate Invoice & Email
        try {
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
                price: itemPrice,
                paymentStatus: "paid",
                razorpayPaymentId: razorpay_payment_id,
            });

            await sendEmail({
                to: updatedBooking.email,
                subject: `Payment Successful & Booking Confirmed - ${itemName}`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #1E293B;">
                        <h2 style="color: #4F46E5;">Payment Received & Booking Confirmed 🎉</h2>
                        <p>Hi <strong>${updatedBooking.name}</strong>,</p>
                        <p>We have successfully received your payment of <strong>₹${Number(itemPrice).toLocaleString("en-IN")}</strong> via Razorpay.</p>
                        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px; margin: 16px 0;">
                            <p style="margin: 4px 0;"><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
                            <p style="margin: 4px 0;"><strong>Order ID:</strong> ${razorpay_order_id}</p>
                            <p style="margin: 4px 0;"><strong>Booking:</strong> ${itemName}</p>
                            <p style="margin: 4px 0;"><strong>Date:</strong> ${new Date(updatedBooking.eventDate).toLocaleDateString()}</p>
                            <p style="margin: 4px 0;"><strong>Time:</strong> ${formatTime(updatedBooking.startTime)} - ${formatTime(updatedBooking.endTime)}</p>
                        </div>
                        <p>Please find your official tax invoice attached.</p>
                        <p>Thank you for choosing us!</p>
                        <p>— The Evento Team</p>
                    </div>
                `,
                attachment: {
                    name: `invoice_${updatedBooking._id}.pdf`,
                    content: pdfBuffer.toString("base64"),
                },
            });
        } catch (emailErr) {
            console.warn("Could not send confirmation email:", emailErr.message);
        }

        return res.status(200).json(
            new ApiResponse(200, updatedBooking, "Payment completed and booking confirmed")
        );
    }

    // New Booking Flow with Payment
    if (!bookingData) {
        throw new ApiError(400, "Booking details are required");
    }

    const {
        name,
        email,
        phone,
        eventDate,
        startTime,
        endTime,
        guests,
        message,
        amount,
    } = bookingData;

    if (!name || !email || !phone || !eventDate || !startTime || !endTime) {
        throw new ApiError(400, "All booking details (name, email, phone, date, time) are required");
    }

    let createdBooking = null;

    if (bookingType === "package") {
        const packageId = bookingData.package;
        if (!packageId) throw new ApiError(400, "Package ID is required");

        // Create Package Booking
        createdBooking = await PackageBooking.create({
            package: packageId,
            name,
            email,
            phone,
            eventDate,
            startTime,
            endTime,
            guests: guests || 1,
            message,
            status: "confirmed", // Instant confirmation on payment!
            paymentStatus: "paid",
            paymentMethod: "razorpay",
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            amountPaid: amount || 0,
        });

        createdBooking = await PackageBooking.findById(createdBooking._id).populate("package", "name price");

        // Send Invoice & Email
        try {
            const pdfBuffer = await generateInvoice({
                _id: createdBooking._id,
                name: createdBooking.name,
                email: createdBooking.email,
                phone: createdBooking.phone,
                itemName: createdBooking.package?.name || "Event Package",
                eventDate: createdBooking.eventDate,
                startTime: createdBooking.startTime,
                endTime: createdBooking.endTime,
                guests: createdBooking.guests,
                price: createdBooking.package?.price || amount || 0,
                paymentStatus: "paid",
                razorpayPaymentId: razorpay_payment_id,
            });

            await sendEmail({
                to: createdBooking.email,
                subject: `Booking Confirmed & Payment Received - ${createdBooking.package?.name || "Package"}`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #1E293B;">
                        <h2 style="color: #4F46E5;">Booking Confirmed & Paid 🎉</h2>
                        <p>Hi <strong>${createdBooking.name}</strong>,</p>
                        <p>Your payment of <strong>₹${Number(amount || 0).toLocaleString("en-IN")}</strong> for <strong>${createdBooking.package?.name || "your package"}</strong> was successful.</p>
                        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px; margin: 16px 0;">
                            <p style="margin: 4px 0;"><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
                            <p style="margin: 4px 0;"><strong>Booking Date:</strong> ${new Date(createdBooking.eventDate).toLocaleDateString()}</p>
                            <p style="margin: 4px 0;"><strong>Time:</strong> ${formatTime(createdBooking.startTime)} - ${formatTime(createdBooking.endTime)}</p>
                            <p style="margin: 4px 0;"><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">Confirmed (PAID)</span></p>
                        </div>
                        <p>Your invoice has been attached for your records.</p>
                        <p>— The Evento Team</p>
                    </div>
                `,
                attachment: {
                    name: `invoice_${createdBooking._id}.pdf`,
                    content: pdfBuffer.toString("base64"),
                },
            });
        } catch (emailErr) {
            console.warn("Could not send confirmation email:", emailErr.message);
        }

    } else {
        // Category Booking
        const categoryId = bookingData.category;
        if (!categoryId) throw new ApiError(400, "Category ID is required");

        createdBooking = await Booking.create({
            category: categoryId,
            name,
            email,
            phone,
            eventDate,
            startTime,
            endTime,
            guests: guests || 1,
            message,
            status: "confirmed", // Instant confirmation on payment!
            paymentStatus: "paid",
            paymentMethod: "razorpay",
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            amountPaid: amount || 0,
        });

        createdBooking = await Booking.findById(createdBooking._id).populate("category", "name price");

        // Send Invoice & Email
        try {
            const pdfBuffer = await generateInvoice({
                _id: createdBooking._id,
                name: createdBooking.name,
                email: createdBooking.email,
                phone: createdBooking.phone,
                itemName: createdBooking.category?.name || "Event Service",
                eventDate: createdBooking.eventDate,
                startTime: createdBooking.startTime,
                endTime: createdBooking.endTime,
                guests: createdBooking.guests,
                price: createdBooking.category?.price || amount || 0,
                paymentStatus: "paid",
                razorpayPaymentId: razorpay_payment_id,
            });

            await sendEmail({
                to: createdBooking.email,
                subject: `Booking Confirmed & Payment Received - ${createdBooking.category?.name || "Service"}`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #1E293B;">
                        <h2 style="color: #4F46E5;">Booking Confirmed & Paid 🎉</h2>
                        <p>Hi <strong>${createdBooking.name}</strong>,</p>
                        <p>Your payment of <strong>₹${Number(amount || 0).toLocaleString("en-IN")}</strong> for <strong>${createdBooking.category?.name || "your event service"}</strong> was successful.</p>
                        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px; margin: 16px 0;">
                            <p style="margin: 4px 0;"><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
                            <p style="margin: 4px 0;"><strong>Booking Date:</strong> ${new Date(createdBooking.eventDate).toLocaleDateString()}</p>
                            <p style="margin: 4px 0;"><strong>Time:</strong> ${formatTime(createdBooking.startTime)} - ${formatTime(createdBooking.endTime)}</p>
                            <p style="margin: 4px 0;"><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">Confirmed (PAID)</span></p>
                        </div>
                        <p>Your invoice has been attached for your records.</p>
                        <p>— The Evento Team</p>
                    </div>
                `,
                attachment: {
                    name: `invoice_${createdBooking._id}.pdf`,
                    content: pdfBuffer.toString("base64"),
                },
            });
        } catch (emailErr) {
            console.warn("Could not send confirmation email:", emailErr.message);
        }
    }

    return res.status(201).json(
        new ApiResponse(201, createdBooking, "Payment verified and booking confirmed successfully")
    );
});

export { getRazorpayKey, createRazorpayOrder, verifyAndConfirmBooking };
