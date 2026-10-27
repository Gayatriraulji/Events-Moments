import mongoose, { Schema } from "mongoose";

const packageSchema = new Schema({
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
  tier: {
    type: String,
    enum: ["basic", "premium", "luxury"],
    default: "basic",
  },
  inclusions: {
    type: [String], // e.g. ["Catering", "Decoration", "Photography"]
    default: [],
  },
  image: {
    type: String,
  },
  isCustom: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export const Package = mongoose.model("Package", packageSchema);
