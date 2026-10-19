import mongoose, { Schema } from "mongoose";

const packageBookingSchema = new Schema({
  package: {
    type: Schema.Types.ObjectId,
    ref: "Package",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  guests: {
    type: Number,
    default: 1,
  },
  message: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    default: "razorpay",
  },
  razorpayOrderId: {
    type: String,
    default: "",
  },
  razorpayPaymentId: {
    type: String,
    default: "",
  },
  razorpaySignature: {
    type: String,
    default: "",
  },
  amountPaid: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export const PackageBooking = mongoose.model("PackageBooking", packageBookingSchema);