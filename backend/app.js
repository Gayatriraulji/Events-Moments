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
import serviceRouter from "./routes/service.routes.js";

const app = express();

const defaultOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "https://events-moments-1.onrender.com",
];

const envOrigins = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map(o => o.trim())
    .filter(Boolean);

const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
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
app.use("/api/v1/services", serviceRouter);

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

app.get("/", (req, res) => {
  res.send("Events Moments API is running");
});

export { app };