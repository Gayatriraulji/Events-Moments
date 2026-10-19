// seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    // 1. Database se connect karo
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected for seeding...");

    // 2. Check karo ki admin pehle se hai ya nahi
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("Admin already exists, seeding skip kar raha hoon.");
      await mongoose.disconnect();
      process.exit(0);
    }

    // 3. Admin user create karo
    // Note: password yahan hash nahi kar rahe manually,
    // kyunki User model mein pre("save") hook already
    // automatically hash kar deta hai jab .save() chalta hai
    const admin = new User({
      username: "superadmin",
      email: "admin@ems.com",
      password: "Admin@123",
      role: "admin",
    });

    await admin.save();

    console.log("Admin user successfully create ho gaya!");
    console.log("Email: admin@ems.com | Password: Admin@123");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seeding mein error aaya:", error);
    process.exit(1);
  }
};

seedAdmin();