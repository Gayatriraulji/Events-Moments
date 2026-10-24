import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import CommerceChart from "../components/CommerceChart";
import MembershipChart from "../components/MembershipChart";
import AudienceChart from "../components/AudienceChart";
import BookingsTable from "../components/BookingsTable";
import { Users, Calendar, CheckCircle2, IndianRupee, Clock, ArrowUpRight } from "lucide-react";

const avatarColors = ["#4F46E5", "#059669", "#D97706", "#7C3AED", "#2563EB"];

const getInitials = (name) => {
  if (!name) return "—";
  const parts = name.trim().split(" ");
  return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : parts[0].slice(0, 2).toUpperCase();
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const token = localStorage.getItem("accessToken");
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const response = await res.json();
        if (!res.ok) {
          setErrorMsg(response.message || "Failed to fetch dashboard stats");
          return;
        }
        setStats(response.data);
      } catch (error) {
        setErrorMsg(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [API_URL, token]);

  if (loading) {
    return (
      <div className="admin-shell">
        <Sidebar />
        <div className="admin-main-content" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", color: "#64748B" }}>
            <div style={{ width: "40px", height: "40px", border: "3px solid #E2E8F0", borderTopColor: "#4F46E5", borderRadius: "50%", margin: "0 auto 1rem", animation: "spin 1s linear infinite" }} />
            <p style={{ fontWeight: 600 }}>Loading admin analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (errorMsg || !stats) {
    return (
      <div className="admin-shell">
        <Sidebar />
        <div className="admin-main-content">
          <div style={{ padding: "1.5rem", borderRadius: "12px", background: "#FFE4E6", color: "#BE123C", fontWeight: 600 }}>
            Error loading dashboard: {errorMsg}
          </div>
        </div>
      </div>
    );
  }

  // Bookings trend
  const commerceLabels = stats.trend.map((t) => t.label);
  const commerceData = stats.trend.map((t) => t.count);

  // Status breakdown
  const membershipLabels = ["Confirmed", "Pending", "Cancelled"];
  const membershipData = [stats.confirmedCount, stats.pendingCount, stats.cancelledCount];

  // Audience mix
  const audienceData = [stats.confirmedCount, stats.pendingCount + stats.cancelledCount];

  const statusProgress = { confirmed: 100, pending: 50, cancelled: 20 };
  const statusColor = { confirmed: "#059669", pending: "#D97706", cancelled: "#DC2626" };

  const bookingsTableData = stats.recentBookings.map((b, i) => ({
    name: b.name,
    eventType: b.itemName,
    package: b.type,
    amount: `₹${(b.price || 0).toLocaleString("en-IN")}`,
    amountChange: "",
    progress: statusProgress[b.status] || 0,
    progressColor: statusColor[b.status] || "#64748B",
    guests: "—",
    initials: getInitials(b.name),
    avatarColor: avatarColors[i % avatarColors.length],
  }));

  return (
    <div className="admin-shell">
      <Sidebar />

      <div className="admin-main-content animate-fade-in">
        {/* Top Header Bar */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
            Admin Analytics & Overview
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#64748B" }}>
            Real-time metric summary, booking statistics, and platform revenue.
          </p>
        </div>

        {/* Metric Cards Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "1.75rem" }}>
          <div className="stat-card">
            <div>
              <div className="stat-label">Total Users</div>
              <div className="stat-value">{stats.totalUsers}</div>
              <span style={{ fontSize: "0.75rem", color: "#10B981", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "2px" }}>
                <ArrowUpRight size={14} /> Registered Accounts
              </span>
            </div>
            <div className="stat-icon-wrapper" style={{ background: "#EEF2FF", color: "#4F46E5" }}>
              <Users size={22} />
            </div>
          </div>

          <div className="stat-card">
            <div>
              <div className="stat-label">Total Bookings</div>
              <div className="stat-value">{stats.totalBookings}</div>
              <span style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 600 }}>All-time Requests</span>
            </div>
            <div className="stat-icon-wrapper" style={{ background: "#FEF3C7", color: "#D97706" }}>
              <Calendar size={22} />
            </div>
          </div>

          <div className="stat-card">
            <div>
              <div className="stat-label">Confirmed Events</div>
              <div className="stat-value">{stats.confirmedCount}</div>
              <span style={{ fontSize: "0.75rem", color: "#10B981", fontWeight: 700 }}>Approved</span>
            </div>
            <div className="stat-icon-wrapper" style={{ background: "#D1FAE5", color: "#059669" }}>
              <CheckCircle2 size={22} />
            </div>
          </div>

          <div className="stat-card">
            <div>
              <div className="stat-label">Total Revenue</div>
              <div className="stat-value">₹{stats.totalRevenue.toLocaleString("en-IN")}</div>
              <span style={{ fontSize: "0.75rem", color: "#4F46E5", fontWeight: 700 }}>Confirmed Bookings</span>
            </div>
            <div className="stat-icon-wrapper" style={{ background: "#EEF2FF", color: "#4F46E5" }}>
              <IndianRupee size={22} />
            </div>
          </div>
        </div>

        {/* Analytics Charts Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem", marginBottom: "1.75rem" }}>
          <div className="card-modern" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0F172A" }}>Booking Activity (Last 7 Days)</h3>
              <Clock size={18} color="#94A3B8" />
            </div>
            <CommerceChart labels={commerceLabels} data={commerceData} />
          </div>

          <div className="card-modern" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0F172A" }}>Status Distribution</h3>
            </div>
            <MembershipChart labels={membershipLabels} data={membershipData} />
          </div>
        </div>

        {/* Revenue & Recent Bookings Table */}
        <div className="card-modern" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0F172A", marginBottom: "1rem" }}>
            Recent Booking Requests
          </h3>
          <BookingsTable bookings={bookingsTableData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;