import mongoose, { Schema } from "mongoose";

const serviceSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  highlights: {
    type: [String], // e.g. ["Custom Menus", "Live Cooking", "Beverage Bar"]
    default: [],
  },
  image: {
    type: String, // file path
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export const Service = mongoose.model("Service", serviceSchema);
