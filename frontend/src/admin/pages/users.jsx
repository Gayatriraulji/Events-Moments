import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import { Users as UsersIcon, Search, Edit2, Trash2, Shield, User, X } from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ username: "", email: "", role: "" });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const token = localStorage.getItem("accessToken");
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/users/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await res.json();
      if (!res.ok) {
        setErrorMsg(response.message || "Failed to fetch users");
        return;
      }
      setUsers(response.data || []);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({ username: user.username, email: user.email, role: user.role });
  };

  const closeEditModal = () => {
    setEditingUser(null);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${API_URL}/users/users/${editingUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const response = await res.json();
      if (!res.ok) {
        alert(response.message || "Update failed");
        return;
      }
      closeEditModal();
      fetchUsers();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/users/users/${deleteTarget._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await res.json();
      if (!res.ok) {
        alert(response.message || "Delete failed");
        return;
      }
      setDeleteTarget(null);
      fetchUsers();
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-main-content animate-fade-in">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
              User Management
            </h1>
            <p style={{ fontSize: "0.875rem", color: "#64748B" }}>
              View and update registered user accounts and administrative privileges.
            </p>
          </div>

          <div style={{ position: "relative", minWidth: "260px" }}>
            <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
            <input
              type="text"
              placeholder="Search user or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: "38px", borderRadius: "9999px" }}
            />
          </div>
        </div>

        {errorMsg && (
          <div style={{ padding: "1rem", borderRadius: "12px", background: "#FFE4E6", color: "#BE123C", fontWeight: 600, marginBottom: "1rem" }}>
            Error: {errorMsg}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#64748B" }}>
            <div style={{ width: "40px", height: "40px", border: "3px solid #E2E8F0", borderTopColor: "#4F46E5", borderRadius: "50%", margin: "0 auto 1rem", animation: "spin 1s linear infinite" }} />
            <p style={{ fontWeight: 600 }}>Loading users list...</p>
          </div>
        ) : (
          <div className="table-responsive card-modern">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: "2rem", color: "#64748B" }}>
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              background: user.role === "admin" ? "#EEF2FF" : "#F1F5F9",
                              color: user.role === "admin" ? "#4F46E5" : "#475569",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontSize: "0.85rem",
                            }}
                          >
                            {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                          </div>
                          <span style={{ fontWeight: 700, color: "#0F172A" }}>{user.username}</span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span
                          className={`badge ${user.role === "admin" ? "badge-primary" : "badge-pending"}`}
                          style={{ textTransform: "uppercase" }}
                        >
                          {user.role === "admin" ? <Shield size={12} /> : <User size={12} />}
                          <span>{user.role}</span>
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => openEditModal(user)}
                            className="btn btn-secondary"
                            style={{ padding: "6px 12px", fontSize: "0.75rem" }}
                          >
                            <Edit2 size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => setDeleteTarget(user)}
                            className="btn btn-danger"
                            style={{ padding: "6px 12px", fontSize: "0.75rem" }}
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: "1rem",
          }}
        >
          <div className="card-modern" style={{ maxWidth: "420px", width: "100%", padding: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0F172A" }}>Edit User Account</h3>
              <button onClick={closeEditModal} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}>
                <X size={20} />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Username</label>
              <input name="username" value={formData.username} onChange={handleFormChange} className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input name="email" value={formData.email} onChange={handleFormChange} className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select name="role" value={formData.role} onChange={handleFormChange} className="form-select">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "1.5rem" }}>
              <button onClick={closeEditModal} className="btn btn-outline">Cancel</button>
              <button onClick={handleUpdate} className="btn btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: "1rem",
          }}
        >
          <div className="card-modern" style={{ maxWidth: "380px", width: "100%", padding: "2rem", textAlign: "center" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#FFE4E6", color: "#F43F5E", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
              <Trash2 size={24} />
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0F172A", marginBottom: "6px" }}>Confirm Delete</h3>
            <p style={{ fontSize: "0.875rem", color: "#64748B", marginBottom: "1.5rem" }}>
              Are you sure you want to delete user <strong style={{ color: "#0F172A" }}>{deleteTarget.username}</strong>?
            </p>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button onClick={() => setDeleteTarget(null)} className="btn btn-outline">Cancel</button>
              <button onClick={handleDelete} className="btn btn-danger">Delete User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;