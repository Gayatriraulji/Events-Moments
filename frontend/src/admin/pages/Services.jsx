import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../components/sidebar";
import { Sparkles, Plus, Edit2, Trash2, Image as ImageIcon, Check, X, Search, UploadCloud } from "lucide-react";

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({ name: "", description: "", price: "", highlights: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("accessToken");
  const API_URL = process.env.REACT_APP_API_URL;
  const SERVER_URL = API_URL ? API_URL.replace("/api/v1", "") : "http://localhost:8000";

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/services`);
      const response = await res.json();
      if (!res.ok) {
        setErrorMsg(response.message || "Failed to fetch services");
        return;
      }
      setServices(response.data || []);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e) => {
    handleFileSelect(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", highlights: "" });
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `${API_URL}/services/${editingId}` : `${API_URL}/services`;
      const method = editingId ? "PUT" : "POST";

      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price || 0);
      data.append("highlights", formData.highlights);
      if (imageFile) data.append("image", imageFile);

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const response = await res.json();
      if (!res.ok) {
        alert(response.message || "Something went wrong");
        return;
      }

      resetForm();
      fetchServices();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (srv) => {
    setFormData({
      name: srv.name,
      description: srv.description || "",
      price: srv.price !== undefined && srv.price !== null ? srv.price : "",
      highlights: (srv.highlights || []).join(", "),
    });
    setImageFile(null);
    setImagePreview(srv.image ? (srv.image.startsWith("http") ? srv.image : `${SERVER_URL}${srv.image}`) : null);
    setEditingId(srv._id);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/services/${deleteTarget._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await res.json();
      if (!res.ok) {
        alert(response.message || "Delete failed");
        return;
      }
      setDeleteTarget(null);
      fetchServices();
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredServices = services.filter((srv) =>
    srv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (srv.description && srv.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-main-content animate-fade-in">

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#C5A059", letterSpacing: "-0.02em" }}>
              Services Management
            </h1>
            <p style={{ fontSize: "0.875rem", color: "#E2E8F0" }}>
              Add, edit or remove event services with photos and feature highlights.
            </p>
          </div>
          <div style={{ position: "relative", minWidth: "260px" }}>
            <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
            <input
              type="text"
              placeholder="Filter services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: "38px", borderRadius: "9999px" }}
            />
          </div>
        </div>

        {/* Add / Edit Form Card */}
        <div className="card-modern" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#C5A059", marginBottom: "1.25rem" }}>
            {editingId ? "✏️ Edit Service" : "➕ Add New Service"}
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", marginBottom: "14px" }}>
              <div>
                <label className="form-label">Service Name *</label>
                <input name="name" value={formData.name} onChange={handleChange} required placeholder="Luxury Catering" className="form-input" />
              </div>
              <div>
                <label className="form-label">Price (₹) *</label>
                <input name="price" type="number" min="0" value={formData.price} onChange={handleChange} required placeholder="e.g. 25000" className="form-input" />
              </div>
              <div>
                <label className="form-label">Description</label>
                <input name="description" value={formData.description} onChange={handleChange} placeholder="Brief overview of the service..." className="form-input" />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label className="form-label">Highlights (comma separated)</label>
                <input name="highlights" value={formData.highlights} onChange={handleChange} placeholder="Custom Menus, Live Cooking, Beverage Bar" className="form-input" />
              </div>
            </div>

            {/* Image Upload with Drag & Drop */}
            <div style={{ marginBottom: "1rem" }}>
              <label className="form-label">Service Image</label>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${isDragging ? "#C5A059" : "#CBD5E1"}`,
                  borderRadius: "14px",
                  background: isDragging ? "#C5A059" : "#F8FAFC",
                  padding: "1.5rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "1.25rem",
                }}
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "12px", border: "2px solid #E2E8F0", flexShrink: 0 }}
                    />
                    <div>
                      <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0F172A" }}>Image selected</p>
                      <p style={{ fontSize: "0.75rem", color: "#64748B" }}>Click or drop a new image to replace</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ width: "56px", height: "56px", borderRadius: "12px", background: "rgba(197,160,89,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#C5A059", flexShrink: 0 }}>
                      <UploadCloud size={26} />
                    </div>
                    <div>
                      <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0F172A" }}>Drop image here or click to browse</p>
                      <p style={{ fontSize: "0.75rem", color: "#94A3B8" }}>PNG, JPG, WEBP up to 5MB</p>
                    </div>
                  </>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button type="submit" className="btn btn-primary" style={{ padding: "0.75rem 1.5rem" }}>
                {editingId ? <Check size={16} /> : <Plus size={16} />}
                <span>{editingId ? "Update Service" : "Add Service"}</span>
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="btn btn-outline" style={{ padding: "0.75rem 1rem" }}>
                  <X size={16} />
                  <span>Cancel</span>
                </button>
              )}
            </div>
          </form>
        </div>

        {errorMsg && <div style={{ color: "#BE123C", marginBottom: "1rem" }}>Error: {errorMsg}</div>}

        {/* Services Table */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#64748B" }}>
            <div style={{ width: "40px", height: "40px", border: "3px solid #E2E8F0", borderTopColor: "#C5A059", borderRadius: "50%", margin: "0 auto 1rem", animation: "spin 1s linear infinite" }} />
            <p style={{ fontWeight: 600 }}>Loading services...</p>
          </div>
        ) : (
          <div className="table-responsive card-modern">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Service Name</th>
                  <th>Price (₹)</th>
                  <th>Description</th>
                  <th>Highlights</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "3rem", color: "#64748B" }}>
                      <Sparkles size={28} style={{ marginBottom: "0.5rem", color: "#CBD5E1" }} />
                      <div>No services found. Add your first service above.</div>
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((srv) => (
                    <tr key={srv._id}>
                      <td>
                        {srv.image ? (
                          <img
                            src={srv.image.startsWith("http") ? srv.image : `${SERVER_URL}${srv.image}`}
                            alt={srv.name}
                            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "10px", border: "2px solid #F1F5F9" }}
                          />
                        ) : (
                          <div style={{ width: "50px", height: "50px", borderRadius: "10px", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8" }}>
                            <Sparkles size={20} />
                          </div>
                        )}
                      </td>
                      <td style={{ fontWeight: 700, color: "#C5A059" }}>{srv.name}</td>
                      <td style={{ fontWeight: 700, color: "#10B981" }}>
                        ₹{srv.price !== undefined ? Number(srv.price).toLocaleString("en-IN") : "0"}
                      </td>
                      <td style={{ color: "#64748B", maxWidth: "250px", fontSize: "0.85rem" }}>{srv.description || "—"}</td>
                      <td style={{ maxWidth: "220px" }}>
                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                          {(srv.highlights || []).slice(0, 3).map((h, i) => (
                            <span key={i} style={{ fontSize: "0.7rem", fontWeight: 600, background: "rgba(197,160,89,0.12)", color: "#C5A059", padding: "2px 8px", borderRadius: "9999px" }}>
                              {h}
                            </span>
                          ))}
                          {(srv.highlights || []).length > 3 && (
                            <span style={{ fontSize: "0.7rem", color: "#94A3B8" }}>+{srv.highlights.length - 3} more</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button onClick={() => handleEdit(srv)} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.75rem" }}>
                            <Edit2 size={14} /> Edit
                          </button>
                          <button onClick={() => setDeleteTarget(srv)} className="btn btn-danger" style={{ padding: "6px 12px", fontSize: "0.75rem" }}>
                            <Trash2 size={14} /> Delete
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

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "1rem" }}>
          <div className="card-modern" style={{ maxWidth: "380px", width: "100%", padding: "2rem", textAlign: "center" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#FFE4E6", color: "#F43F5E", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
              <Trash2 size={24} />
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0F172A", marginBottom: "6px" }}>Confirm Delete</h3>
            <p style={{ fontSize: "0.875rem", color: "#64748B", marginBottom: "1.5rem" }}>
              Are you sure you want to delete <strong style={{ color: "#0F172A" }}>{deleteTarget.name}</strong>?
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button onClick={() => setDeleteTarget(null)} className="btn btn-outline">Cancel</button>
              <button onClick={handleDelete} className="btn btn-danger">Delete Service</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
