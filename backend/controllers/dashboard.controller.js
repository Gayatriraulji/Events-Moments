import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Category } from "../models/category.model.js";
import { Package } from "../models/package.model.js";
import { Booking } from "../models/booking.model.js";
import { PackageBooking } from "../models/packageBooking.model.js";

const getDashboardStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments()
    const totalCategories = await Category.countDocuments()
    const totalPackages = await Package.countDocuments()

    const categoryBookings = await Booking.find({}).populate("category", "name price")
    const packageBookings = await PackageBooking.find({}).populate("package", "name price")

    const allBookings = [
        ...categoryBookings.map((b) => ({
            _id: b._id,
            type: "Category",
            itemName: b.category?.name || "—",
            price: b.category?.price || 0,
            name: b.name,
            status: b.status,
            createdAt: b.createdAt,
        })),
        ...packageBookings.map((b) => ({
            _id: b._id,
            type: "Package",
            itemName: b.package?.name || "—",
            price: b.package?.price || 0,
            name: b.name,
            status: b.status,
            createdAt: b.createdAt,
        })),
    ]

    const totalBookings = allBookings.length
    const pendingCount = allBookings.filter((b) => b.status === "pending").length
    const confirmedCount = allBookings.filter((b) => b.status === "confirmed").length
    const cancelledCount = allBookings.filter((b) => b.status === "cancelled").length

    const totalRevenue = allBookings
        .filter((b) => b.status === "confirmed")
        .reduce((sum, b) => sum + (b.price || 0), 0)

    // Last 7 days booking trend
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        date.setHours(0, 0, 0, 0)
        last7Days.push(date)
    }

    const trend = last7Days.map((day) => {
        const nextDay = new Date(day)
        nextDay.setDate(nextDay.getDate() + 1)
        const count = allBookings.filter((b) => {
            const created = new Date(b.createdAt)
            return created >= day && created < nextDay
        }).length
        return {
            label: day.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
            count,
        }
    })

    // Latest 5 bookings (combined, newest first)
    const recentBookings = allBookings
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)

    return res.status(200).json(
        new ApiResponse(200, {
            totalUsers,
            totalCategories,
            totalPackages,
            totalBookings,
            pendingCount,
            confirmedCount,
            cancelledCount,
            totalRevenue,
            trend,
            recentBookings,
        }, "Dashboard stats fetched successfully")
    )
})

export { getDashboardStats }