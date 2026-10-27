import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { FileText, FileSpreadsheet, Search, Trash2 } from "lucide-react";

const formatTime = (time24) => {
  if (!time24) return "";
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
};

const AdminPackageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("accessToken");
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/package-bookings`, {
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
      const res = await fetch(`${API_URL}/package-bookings/${id}`, {
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
    if (!window.confirm("Delete this package booking?")) return;
    try {
      const res = await fetch(`${API_URL}/package-bookings/${id}`, {
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
    (b.package?.name && b.package.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getExportRows = () =>
    filteredBookings.map((b) => ({
      Package: b.package?.name || "—",
      Type: b.package?.isCustom ? "Custom Package" : "Standard",
      "Added / Extra Services": (b.package?.inclusions || []).join(", ") || "—",
      Name: b.name,
      Email: b.email,
      Phone: b.phone,
      "Event Date": new Date(b.eventDate).toLocaleDateString(),
      Time: `${formatTime(b.startTime)} - ${formatTime(b.endTime)}`,
      Guests: b.guests,
      Price: b.package?.price ?? "—",
      Status: b.status,
    }));

  const handleDownloadExcel = () => {
    const rows = getExportRows();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PackageBookings");
    XLSX.writeFile(workbook, "package-bookings.xlsx");
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Package Bookings Report", 14, 15);

    const rows = getExportRows();
    const columns = ["Package", "Type", "Added / Extra Services", "Name", "Email", "Phone", "Event Date", "Time", "Guests", "Price", "Status"];

    autoTable(doc, {
      startY: 22,
      head: [columns],
      body: rows.map((r) => columns.map((col) => r[col])),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [79, 70, 229] },
    });

    doc.save("package-bookings.pdf");
  };

  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-main-content animate-fade-in">
        {/* Top Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#C5A059", letterSpacing: "-0.02em" }}>
              Package Bookings
            </h1>
            <p style={{ fontSize: "0.875rem", color: "#E2E8F0" }}>
              Manage bundle reservations, custom client packages, and extra added services.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <div style={{ position: "relative", minWidth: "220px" }}>
              <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
              <input
                type="text"
                placeholder="Search package, client..."
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
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#64748B" }}>
            <div style={{ width: "40px", height: "40px", border: "3px solid #E2E8F0", borderTopColor: "#C5A059", borderRadius: "50%", margin: "0 auto 1rem", animation: "spin 1s linear infinite" }} />
            <p style={{ fontWeight: 600 }}>Loading package bookings...</p>
          </div>
        ) : (
          <div className="table-responsive card-modern">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Extra / Added Services</th>
                  <th>Client</th>
                  <th>Contact</th>
                  <th>Event Date & Time</th>
                  <th>Guests</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: "center", padding: "2rem", color: "#64748B" }}>
                      No package bookings found.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b._id}>
                      <td style={{ fontWeight: 700, color: "#C5A059" }}>
                        <div>{b.package?.name || "—"}</div>
                        {b.package?.isCustom ? (
                          <span
                            style={{
                              display: "inline-block",
                              marginTop: "4px",
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              letterSpacing: "0.04em",
                              textTransform: "uppercase",
                              background: "rgba(197, 160, 89, 0.16)",
                              color: "#C5A059",
                              border: "1px solid rgba(197, 160, 89, 0.35)",
                              padding: "2px 8px",
                              borderRadius: "9999px",
                            }}
                          >
                            ✨ Custom Package
                          </span>
                        ) : (
                          <span
                            style={{
                              display: "inline-block",
                              marginTop: "4px",
                              fontSize: "0.68rem",
                              color: "#94A3B8",
                            }}
                          >
                            Standard Bundle
                          </span>
                        )}
                      </td>
                      <td style={{ maxWidth: "260px" }}>
                        {b.package?.inclusions && b.package.inclusions.length > 0 ? (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                            {b.package.inclusions.map((item, idx) => (
                              <span
                                key={idx}
                                style={{
                                  fontSize: "0.72rem",
                                  fontWeight: 600,
                                  background: "rgba(255, 255, 255, 0.08)",
                                  color: "#FAF7F2",
                                  padding: "3px 8px",
                                  borderRadius: "6px",
                                  border: "1px solid rgba(255, 255, 255, 0.12)",
                                  display: "inline-block",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                + {item}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span style={{ fontSize: "0.75rem", color: "#64748B" }}>None specified</span>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: "#C5A059" }}>{b.name}</div>
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
                        <div>{b.package?.price !== undefined ? `₹${b.package.price.toLocaleString("en-IN")}` : "—"}</div>
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
                            fontWeight: 700,
                            borderRadius: "8px",
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

export default AdminPackageBookings;