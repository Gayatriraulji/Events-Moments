import "dotenv/config";
import connectDB from "./config/db.js";
import { app } from "./app.js";

// Request Logger Middleware
app.use((req, res, next) => {
    const start = Date.now();

    console.log(
        `[${new Date().toLocaleString()}] ${req.method} ${req.originalUrl}`
    );

    res.on("finish", () => {
        const duration = Date.now() - start;

        console.log(
            `[${new Date().toLocaleString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`
        );
    });

    next();
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(
                `🚀 Server is running at port: ${process.env.PORT || 8000}`
            );
        });
    })
    .catch((err) => {
        console.log("❌ MongoDB connection failed !!!", err);
    });