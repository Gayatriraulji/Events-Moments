import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import categoryRouter from "./routes/category.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import packageRouter from "./routes/package.routes.js";
import packageBookingRouter from "./routes/packageBooking.routes.js";
import galleryRouter from "./routes/gallery.routes.js";
import reviewRouter from "./routes/review.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import settingsRouter from "./routes/settings.routes.js";
import customerRouter from "./routes/customer.routes.js";
import paymentRouter from "./routes/payment.routes.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static("public/uploads"));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/packages", packageRouter);
app.use("/api/v1/package-bookings", packageBookingRouter);
app.use("/api/v1/gallery", galleryRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/settings", settingsRouter);
app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/payment", paymentRouter);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || err.StatusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        statusCode,
        success: false,
        message,
        errors: err.errors || []
    });
});

export { app };