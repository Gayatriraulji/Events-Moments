import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../components/sidebar";
import { FolderTree, Plus, Edit2, Trash2, Image as ImageIcon, Check, X, Search, UploadCloud } from "lucide-react";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({ name: "", description: "", price: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("accessToken");
  const API_URL = process.env.REACT_APP_API_URL;
  const SERVER_URL = API_URL ? API_URL.replace("/api/v1", "") : "http://localhost:8000";

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/categories`);
      const response = await res.json();
      if (!res.ok) {
        setErrorMsg(response.message || "Failed to fetch categories");
        return;
      }
      setCategories(response.data || []);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
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
    setFormData({ name: "", description: "", price: "" });
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `${API_URL}/categories/${editingId}`
        : `${API_URL}/categories`;
      const method = editingId ? "PUT" : "POST";

      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      if (imageFile) {
        data.append("image", imageFile);
      }

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
      fetchCategories();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (cat) => {
    setFormData({ name: cat.name, description: cat.description || "", price: cat.price || "" });
    setImageFile(null);
    setImagePreview(cat.image ? (cat.image.startsWith("http") ? cat.image : `${SERVER_URL}${cat.image}`) : null);
    setEditingId(cat._id);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/categories/${deleteTarget._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await res.json();
      if (!res.ok) {
        alert(response.message || "Delete failed");
        return;
      }
      setDeleteTarget(null);
      fetchCategories();
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-main-content animate-fade-in">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
              Category Management
            </h1>
            <p style={{ fontSize: "0.875rem", color: "#64748B" }}>
              Add, edit, or remove event categories and set pricing.
            </p>
          </div>

          <div style={{ position: "relative", minWidth: "260px" }}>
            <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
            <input
              type="text"
              placeholder="Filter categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: "38px", borderRadius: "9999px" }}
            />
          </div>
        </div>

        {/* Add / Edit Form Card */}
        <div className="card-modern" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0F172A", marginBottom: "1.25rem" }}>
            {editingId ? "✏️ Edit Event Category" : "➕ Add New Event Category"}
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "14px" }}>
              <div>
                <label className="form-label">Category Name *</label>
                <input name="name" value={formData.name} onChange={handleChange} required placeholder="Wedding Special" className="form-input" />
              </div>
              <div>
                <label className="form-label">Description</label>
                <input name="description" value={formData.description} onChange={handleChange} placeholder="Brief summary of offering..." className="form-input" />
              </div>
              <div>
                <label className="form-label">Price (₹) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="25000" className="form-input" />
              </div>
            </div>

            {/* Drag & Drop Image Upload */}
            <div style={{ marginBottom: "1rem" }}>
              <label className="form-label">Category Image</label>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${isDragging ? "#4F46E5" : "#CBD5E1"}`,
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
                      <p style={{ fontSize: "0.75rem", color: "#64748B" }}>Click or drop to replace</p>
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
                    <div style={{ width: "56px", height: "56px", borderRadius: "12px", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#4F46E5", flexShrink: 0 }}>
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
                <span>{editingId ? "Update Category" : "Add Category"}</span>
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

        {/* Categories Table */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#64748B" }}>
            <div style={{ width: "40px", height: "40px", border: "3px solid #E2E8F0", borderTopColor: "#4F46E5", borderRadius: "50%", margin: "0 auto 1rem", animation: "spin 1s linear infinite" }} />
            <p style={{ fontWeight: 600 }}>Loading categories...</p>
          </div>
        ) : (
          <div className="table-responsive card-modern">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Base Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "2rem", color: "#64748B" }}>
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((cat) => (
                    <tr key={cat._id}>
                      <td>
                        {cat.image ? (
                          <img
                            src={cat.image.startsWith("http") ? cat.image : `${SERVER_URL}${cat.image}`}
                            alt={cat.name}
                            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "10px", border: "2px solid #F1F5F9" }}
                          />
                        ) : (
                          <div style={{ width: "50px", height: "50px", borderRadius: "10px", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8" }}>
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </td>
                      <td style={{ fontWeight: 700, color: "#0F172A" }}>{cat.name}</td>
                      <td style={{ color: "#64748B", maxWidth: "300px" }}>{cat.description || "—"}</td>
                      <td style={{ fontWeight: 700, color: "#4F46E5" }}>
                        ₹{cat.price ? cat.price.toLocaleString("en-IN") : "0"}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button onClick={() => handleEdit(cat)} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.75rem" }}>
                            <Edit2 size={14} /> Edit
                          </button>
                          <button onClick={() => setDeleteTarget(cat)} className="btn btn-danger" style={{ padding: "6px 12px", fontSize: "0.75rem" }}>
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

      {/* Delete Target Modal */}
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
              <button onClick={handleDelete} className="btn btn-danger">Delete Category</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;