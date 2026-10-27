import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../components/sidebar";
import { Package, Plus, Edit2, Trash2, Image as ImageIcon, Check, X, Search, UploadCloud } from "lucide-react";

const tierBadges = {
  basic: { bg: "#F1F5F9", color: "#475569" },
  premium: { bg: "rgba(197,160,89,0.12)", color: "#C5A059" },
  luxury: { bg: "#FEF3C7", color: "#D97706" },
};

const AdminPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({ name: "", description: "", price: "", tier: "basic", inclusions: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const [tabFilter, setTabFilter] = useState("all"); // "all", "standard", "custom"

  const token = localStorage.getItem("accessToken");
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";
  const SERVER_URL = API_URL ? API_URL.replace("/api/v1", "") : "http://localhost:8000";

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/packages?includeCustom=true`);
      const response = await res.json();
      if (!res.ok) {
        setErrorMsg(response.message || "Failed to fetch packages");
        return;
      }
      setPackages(response.data || []);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
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
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", tier: "basic", inclusions: "" });
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `${API_URL}/packages/${editingId}` : `${API_URL}/packages`;
      const method = editingId ? "PUT" : "POST";

      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("tier", formData.tier);
      data.append("inclusions", formData.inclusions);
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
      fetchPackages();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (pkg) => {
    setFormData({
      name: pkg.name,
      description: pkg.description || "",
      price: pkg.price || "",
      tier: pkg.tier || "basic",
      inclusions: (pkg.inclusions || []).join(", "),
    });
    setImageFile(null);
    setImagePreview(pkg.image ? (pkg.image.startsWith("http") ? pkg.image : `${SERVER_URL}${pkg.image}`) : null);
    setEditingId(pkg._id);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/packages/${deleteTarget._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await res.json();
      if (!res.ok) {
        alert(response.message || "Delete failed");
        return;
      }
      setDeleteTarget(null);
      fetchPackages();
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredPackages = packages.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tier.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (tabFilter === "standard") return !p.isCustom;
    if (tabFilter === "custom") return !!p.isCustom;
    return true;
  });

  const customCount = packages.filter((p) => p.isCustom).length;
  const standardCount = packages.filter((p) => !p.isCustom).length;

  const tierColor = formData.tier === "luxury" ? "#D97706" : formData.tier === "premium" ? "#C5A059" : "#475569";
  const tierBg = formData.tier === "luxury" ? "#FEF3C7" : formData.tier === "premium" ? "rgba(197,160,89,0.12)" : "#F1F5F9";

  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-main-content animate-fade-in">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#C5A059", letterSpacing: "-0.02em" }}>
              Package Management
            </h1>
            <p style={{ fontSize: "0.875rem", color: "#E2E8F0" }}>
              Configure event package bundles, view custom user requests, and set pricing.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            {/* Filter Tabs */}
            <div style={{ display: "flex", background: "rgba(255,255,255,0.06)", padding: "4px", borderRadius: "10px", gap: "4px" }}>
              <button
                type="button"
                onClick={() => setTabFilter("all")}
                style={{
                  border: "none",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  background: tabFilter === "all" ? "#C5A059" : "transparent",
                  color: tabFilter === "all" ? "#141E15" : "#CBD5E1",
                  transition: "all 0.2s ease",
                }}
              >
                All ({packages.length})
              </button>
              <button
                type="button"
                onClick={() => setTabFilter("standard")}
                style={{
                  border: "none",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  background: tabFilter === "standard" ? "#C5A059" : "transparent",
                  color: tabFilter === "standard" ? "#141E15" : "#CBD5E1",
                  transition: "all 0.2s ease",
                }}
              >
                Standard ({standardCount})
              </button>
              <button
                type="button"
                onClick={() => setTabFilter("custom")}
                style={{
                  border: "none",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  background: tabFilter === "custom" ? "#C5A059" : "transparent",
                  color: tabFilter === "custom" ? "#141E15" : "#CBD5E1",
                  transition: "all 0.2s ease",
                }}
              >
                ✨ Custom Requests ({customCount})
              </button>
            </div>

            <div style={{ position: "relative", minWidth: "220px" }}>
              <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
              <input
                type="text"
                placeholder="Filter packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: "38px", borderRadius: "9999px" }}
              />
            </div>
          </div>
        </div>

        {/* Add / Edit Package Form Card */}
        <div className="card-modern" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#C5A059", marginBottom: "1.25rem" }}>
            {editingId ? "✏️ Edit Event Package" : "➕ Create New Event Package"}
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "14px" }}>
              <div>
                <label className="form-label">Package Name *</label>
                <input name="name" value={formData.name} onChange={handleChange} required placeholder="Gold Wedding Bundle" className="form-input" />
              </div>
              <div>
                <label className="form-label">Description</label>
                <input name="description" value={formData.description} onChange={handleChange} placeholder="Package overview..." className="form-input" />
              </div>
              <div>
                <label className="form-label">Price (₹) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="50000" className="form-input" />
              </div>
              <div>
                <label className="form-label">Tier</label>
                <select name="tier" value={formData.tier} onChange={handleChange} className="form-select"
                  style={{ background: tierBg, color: tierColor, fontWeight: 700 }}>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label className="form-label">Inclusions (comma separated)</label>
                <input name="inclusions" value={formData.inclusions} onChange={handleChange} placeholder="Catering, DJ, Floral Arch, Lighting" className="form-input" />
              </div>
            </div>

            {/* Drag & Drop Image Upload */}
            <div style={{ marginBottom: "1rem" }}>
              <label className="form-label">Package Image</label>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${isDragging ? "#C5A059" : "#CBD5E1"}`,
                  borderRadius: "14px",
                  background: isDragging ? "rgba(79,70,229,0.04)" : "#F8FAFC",
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
                      <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0F172A" }}>Image selected ✓</p>
                      <p style={{ fontSize: "0.75rem", color: "#64748B" }}>Click or drop a new image to replace</p>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null); }}
                        style={{ marginTop: "6px", fontSize: "0.7rem", color: "#F43F5E", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
                      >
                        ✕ Remove image
                      </button>
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
                <span>{editingId ? "Update Package" : "Add Package"}</span>
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="btn btn-outline" style={{ padding: "0.75rem 1rem" }}>
                  <X size={16} /> Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {errorMsg && <div style={{ color: "#BE123C", marginBottom: "1rem" }}>Error: {errorMsg}</div>}

        {/* Packages Table */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#64748B" }}>
            <div style={{ width: "40px", height: "40px", border: "3px solid #E2E8F0", borderTopColor: "#C5A059", borderRadius: "50%", margin: "0 auto 1rem", animation: "spin 1s linear infinite" }} />
            <p style={{ fontWeight: 600 }}>Loading packages...</p>
          </div>
        ) : (
          <div className="table-responsive card-modern">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Package Name</th>
                  <th>Tier</th>
                  <th>Inclusions</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPackages.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "2rem", color: "#64748B" }}>
                      No packages found.
                    </td>
                  </tr>
                ) : (
                  filteredPackages.map((pkg) => {
                    const badge = tierBadges[pkg.tier] || tierBadges.basic;
                    return (
                      <tr key={pkg._id}>
                        <td>
                          {pkg.image ? (
                            <img
                              src={pkg.image.startsWith("http") ? pkg.image : `${SERVER_URL}${pkg.image}`}
                              alt={pkg.name}
                              style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "10px", border: "2px solid #F1F5F9" }}
                            />
                          ) : (
                            <div style={{ width: "50px", height: "50px", borderRadius: "10px", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8" }}>
                              <Package size={20} />
                            </div>
                          )}
                        </td>
                        <td style={{ fontWeight: 700, color: "#C5A059" }}>
                          <div>{pkg.name}</div>
                          {pkg.isCustom && (
                            <span
                              style={{
                                display: "inline-block",
                                marginTop: "3px",
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                letterSpacing: "0.04em",
                                textTransform: "uppercase",
                                background: "rgba(197, 160, 89, 0.16)",
                                color: "#C5A059",
                                border: "1px solid rgba(197, 160, 89, 0.35)",
                                padding: "2px 6px",
                                borderRadius: "9999px",
                              }}
                            >
                              ✨ Custom Event
                            </span>
                          )}
                        </td>
                        <td>
                          <span className="badge" style={{ background: badge.bg, color: badge.color }}>
                            {pkg.tier}
                          </span>
                        </td>
                        <td style={{ color: "#64748B", maxWidth: "260px" }}>
                          {(pkg.inclusions || []).join(", ") || "—"}
                        </td>
                        <td style={{ fontWeight: 700, color: "#C5A059" }}>
                          ₹{pkg.price ? pkg.price.toLocaleString("en-IN") : "0"}
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button onClick={() => handleEdit(pkg)} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.75rem" }}>
                              <Edit2 size={14} /> Edit
                            </button>
                            <button onClick={() => setDeleteTarget(pkg)} className="btn btn-danger" style={{ padding: "6px 12px", fontSize: "0.75rem" }}>
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
              <button onClick={handleDelete} className="btn btn-danger">Delete Package</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPackages;
