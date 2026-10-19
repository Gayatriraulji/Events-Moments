import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
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
  image: {
    type: String, // file path/URL
  },
}, {
  timestamps: true,
});

export const Category = mongoose.model("Category", categorySchema);