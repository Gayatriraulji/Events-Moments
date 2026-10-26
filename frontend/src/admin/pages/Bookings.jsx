import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { FileText, FileSpreadsheet, Search, Trash2, CalendarCheck, Clock, User, Phone, Mail } from "lucide-react";

const formatTime = (time24) => {
  if (!time24) return "";
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("accessToken");
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await res.json();
      if (!res.ok) {
        setErrorMsg(response.message || "Failed to fetch bookings");
        return;
      }
      setBookings(response.data || []);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const response = await res.json();
      if (!res.ok) {
        alert(response.message || "Update failed");
        return;
      }
      fetchBookings();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking request?")) return;
    try {
      const res = await fetch(`${API_URL}/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await res.json();
      if (!res.ok) {
        alert(response.message || "Delete failed");
        return;
      }
      fetchBookings();
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredBookings = bookings.filter((b) =>
    (b.name && b.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (b.email && b.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (b.category?.name && b.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getExportRows = () =>
    filteredBookings.map((b) => ({
      Category: b.category?.name || "—",
      Name: b.name,
      Email: b.email,
      Phone: b.phone,
      "Event Date": new Date(b.eventDate).toLocaleDateString(),
      Time: `${formatTime(b.startTime)} - ${formatTime(b.endTime)}`,
      Guests: b.guests,
      Price: b.category?.price ?? "—",
      Status: b.status,
    }));

  const handleDownloadExcel = () => {
    const rows = getExportRows();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Category Bookings");
    XLSX.writeFile(workbook, "category_bookings.xlsx");
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Category Bookings Report", 14, 15);

    const rows = getExportRows();
    const columns = ["Category", "Name", "Email", "Phone", "Event Date", "Time", "Guests", "Price", "Status"];

    autoTable(doc, {
      startY: 22,
      head: [columns],
      body: rows.map((r) => columns.map((col) => r[col])),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [79, 70, 229] },
    });

    doc.save("category_bookings.pdf");
  };

  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-main-content animate-fade-in">
        {/* Top Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#c5a059", letterSpacing: "-0.02em" }}>
              Category Bookings
            </h1>
            <p style={{ fontSize: "0.875rem", color: "white" }}>
              Review customer category booking inquiries, approve status, and export reports.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <div style={{ position: "relative", minWidth: "220px" }}>
              <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
              <input
                type="text"
                placeholder="Search name, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: "38px", borderRadius: "9999px" }}
              />
            </div>

            <button onClick={handleDownloadPDF} className="btn btn-outline" style={{ padding: "0.6rem 1rem", fontSize: "0.85rem" }}>
              <FileText size={16} color="#DC2626" /> PDF
            </button>
            <button onClick={handleDownloadExcel} className="btn btn-outline" style={{ padding: "0.6rem 1rem", fontSize: "0.85rem" }}>
              <FileSpreadsheet size={16} color="#059669" /> Excel
            </button>
          </div>
        </div>

        {errorMsg && <div style={{ color: "#BE123C", marginBottom: "1rem" }}>Error: {errorMsg}</div>}

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#c5a059" }}>
            <div style={{ width: "40px", height: "40px", border: "3px solid #E2E8F0", borderTopColor: "#C5A059", borderRadius: "50%", margin: "0 auto 1rem", animation: "spin 1s linear infinite" }} />
            <p style={{ fontWeight: 600 }}>Loading category bookings...</p>
          </div>
        ) : (
          <div className="table-responsive card-modern">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Client</th>
                  <th>Contact</th>
                  <th>Event Date & Time</th>
                  <th>Guests</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: "2rem", color: "#E2E8F0" }}>
                      No category bookings found.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b._id}>
                      <td style={{ fontWeight: 700, color:"#c5a059" }}>
                        {b.category?.name || "—"}
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: "#c5a059" }}>{b.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "#E2E8F0" }}>{b.email}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: "0.85rem", color: "#E2E8F0" }}>{b.phone}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: "#E2E8F0" }}>
                          {new Date(b.eventDate).toLocaleDateString()}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#E2E8F0" }}>
                          {formatTime(b.startTime)} - {formatTime(b.endTime)}
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{b.guests}</td>
                      <td style={{ fontWeight: 700, color: "#C5A059" }}>
                        <div>{b.category?.price !== undefined ? `₹${b.category.price.toLocaleString("en-IN")}` : "—"}</div>
                        {b.paymentStatus === "paid" ? (
                          <span style={{ fontSize: "0.7rem", color: "#059669", background: "#D1FAE5", padding: "2px 6px", borderRadius: "6px", display: "inline-block", marginTop: "3px" }}>
                            Paid (Razorpay)
                          </span>
                        ) : (
                          <span style={{ fontSize: "0.7rem", color: "#B45309", background: "#FEF3C7", padding: "2px 6px", borderRadius: "6px", display: "inline-block", marginTop: "3px" }}>
                            Unpaid
                          </span>
                        )}
                      </td>
                      <td>
                        <select
                          value={b.status}
                          onChange={(e) => handleStatusChange(b._id, e.target.value)}
                          className="form-select"
                          style={{
                            padding: "4px 8px",
                            fontSize: "0.8rem",
                            fontWeight: 900,
                            borderRadius: "5px",
                            color: b.status === "confirmed" ? "#059669" : b.status === "cancelled" ? "#DC2626" : "#B45309",
                            background: b.status === "confirmed" ? "#D1FAE5" : b.status === "cancelled" ? "#FFE4E6" : "#FEF3C7",
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <button onClick={() => handleDelete(b._id)} className="btn btn-danger" style={{ padding: "6px 10px", fontSize: "0.75rem" }}>
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;