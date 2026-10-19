import mongoose, { Schema } from "mongoose";

const settingsSchema = new Schema({
  siteName: {
    type: String,
    default: "EventoAdmin",
  },
  contactEmail: {
    type: String,
    default: "",
  },
  contactPhone: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  instagram: {
    type: String,
    default: "",
  },
  facebook: {
    type: String,
    default: "",
  },
  whatsapp: {
    type: String,
    default: "",
  },
}, {
  timestamps: true,
});

export const Settings = mongoose.model("Settings", settingsSchema);