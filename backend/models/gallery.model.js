import mongoose, { Schema } from "mongoose";

const gallerySchema = new Schema({
  title: {
    type: String,
    trim: true,
    default: "",
  },
  image: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export const Gallery = mongoose.model("Gallery", gallerySchema);