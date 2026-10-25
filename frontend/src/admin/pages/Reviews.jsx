import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import { Star, Trash2, Search } from "lucide-react";

const StarDisplay = ({ rating }) => (
  <div style={{ display: "flex", gap: "2px" }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={14} fill={s <= rating ? "#F59E0B" : "none"} color={s <= rating ? "#F59E0B" : "#CBD5E1"} />
    ))}
  </div>
);

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const token = localStorage.getItem("accessToken");
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/reviews/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await res.json();
      if (!res.ok) {
        setErrorMsg(response.message || "Failed to fetch reviews");
        return;
      }
      setReviews(response.data || []);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/reviews/${id}`, {
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
      fetchReviews();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/reviews/${deleteTarget._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await res.json();
      if (!res.ok) {
        alert(response.message || "Delete failed");
        return;
      }
      setDeleteTarget(null);
      fetchReviews();
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredReviews = reviews.filter((r) =>
    (r.name && r.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (r.comment && r.comment.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-main-content animate-fade-in">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#C5A059", letterSpacing: "-0.02em" }}>
              Review Approvals & Moderation
            </h1>
            <p style={{ fontSize: "0.875rem", color: "#E2E8F0" }}>
              Approve or reject customer review submissions for the public homepage and reviews page.
            </p>
          </div>

          <div style={{ position: "relative", minWidth: "240px" }}>
            <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
            <input
              type="text"
              placeholder="Search reviewer or comment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: "38px", borderRadius: "9999px" }}
            />
          </div>
        </div>

        {errorMsg && <div style={{ color: "#BE123C", marginBottom: "1rem" }}>Error: {errorMsg}</div>}

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#64748B" }}>
            <div style={{ width: "40px", height: "40px", border: "3px solid #E2E8F0", borderTopColor: "#C5A059", borderRadius: "50%", margin: "0 auto 1rem", animation: "spin 1s linear infinite" }} />
            <p style={{ fontWeight: 600 }}>Loading customer reviews...</p>
          </div>
        ) : (
          <div className="table-responsive card-modern">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "2rem", color: "#64748B" }}>
                      No reviews found.
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((r) => (
                    <tr key={r._id}>
                      <td>
                        <div style={{ fontWeight: 700, color: "#bdc0c5" }}>{r.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "#bdc0c5" }}>{r.email}</div>
                      </td>
                      <td>
                        <StarDisplay rating={r.rating} />
                      </td>
                      <td style={{ color: "#bdc0c5", maxWidth: "340px", fontStyle: "italic" }}>
                        "{r.comment}"
                      </td>
                      <td>
                        <select
                          value={r.status}
                          onChange={(e) => handleStatusChange(r._id, e.target.value)}
                          className="form-select"
                          style={{
                            padding: "4px 8px",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            borderRadius: "8px",
                            color: r.status === "approved" ? "#059669" : r.status === "rejected" ? "#DC2626" : "#B45309",
                            background: r.status === "approved" ? "#D1FAE5" : r.status === "rejected" ? "#FFE4E6" : "#FEF3C7",
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td>
                        <button onClick={() => setDeleteTarget(r)} className="btn btn-danger" style={{ padding: "6px 10px", fontSize: "0.75rem" }}>
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

      {/* Delete Target Modal */}
      {deleteTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "1rem" }}>
          <div className="card-modern" style={{ maxWidth: "380px", width: "100%", padding: "2rem", textAlign: "center" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#FFE4E6", color: "#F43F5E", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
              <Trash2 size={24} />
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0F172A", marginBottom: "6px" }}>Delete Review</h3>
            <p style={{ fontSize: "0.875rem", color: "#64748B", marginBottom: "1.5rem" }}>
              Are you sure you want to delete review by <strong style={{ color: "#0F172A" }}>{deleteTarget.name}</strong>?
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button onClick={() => setDeleteTarget(null)} className="btn btn-outline">Cancel</button>
              <button onClick={handleDelete} className="btn btn-danger">Delete Review</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;