import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../components/sidebar";
import { UploadCloud, Trash2, Image as ImageIcon, X } from "lucide-react";

const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [title, setTitle] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("accessToken");
  const API_URL = process.env.REACT_APP_API_URL;
  const SERVER_URL = API_URL ? API_URL.replace("/api/v1", "") : "http://localhost:8000";

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/gallery`);
      const response = await res.json();
      if (!res.ok) {
        setErrorMsg(response.message || "Failed to fetch images");
        return;
      }
      setImages(response.data || []);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const processFiles = (files) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setSelectedFiles((prev) => [...prev, ...fileArray]);
    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => setPreviews((prev) => [...prev, { name: file.name, src: e.target.result }]);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e) => {
    processFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const removePreview = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      alert("Please select at least one image");
      return;
    }

    setUploading(true);
    try {
      const data = new FormData();
      data.append("title", title);
      selectedFiles.forEach((file) => data.append("images", file));

      const res = await fetch(`${API_URL}/gallery`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const response = await res.json();
      if (!res.ok) {
        alert(response.message || "Upload failed");
        return;
      }

      setTitle("");
      setSelectedFiles([]);
      setPreviews([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchImages();
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/gallery/${deleteTarget._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await res.json();
      if (!res.ok) {
        alert(response.message || "Delete failed");
        return;
      }
      setDeleteTarget(null);
      fetchImages();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-main-content animate-fade-in">
        <div style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
            Gallery Management
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#64748B" }}>
            Upload high-res event photographs to display in the public showcase portfolio.
          </p>
        </div>

        {/* Upload Form Card */}
        <div className="card-modern" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0F172A", marginBottom: "1.25rem" }}>
            📸 Upload Event Photos
          </h3>

          <form onSubmit={handleUpload}>
            <div style={{ marginBottom: "1rem" }}>
              <label className="form-label">Title / Caption (Optional)</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Royal Wedding Stage Setup"
                className="form-input"
                style={{ maxWidth: "400px" }}
              />
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${isDragging ? "#4F46E5" : "#CBD5E1"}`,
                borderRadius: "16px",
                background: isDragging ? "rgba(79,70,229,0.05)" : "#F8FAFC",
                padding: "2rem 1.5rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textAlign: "center",
                marginBottom: "1rem",
              }}
            >
              <div style={{ width: "60px", height: "60px", borderRadius: "14px", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#4F46E5", margin: "0 auto 0.75rem" }}>
                <UploadCloud size={28} />
              </div>
              <p style={{ fontSize: "1rem", fontWeight: 700, color: "#0F172A", marginBottom: "4px" }}>
                {isDragging ? "Release to upload!" : "Drop photos here or click to browse"}
              </p>
              <p style={{ fontSize: "0.8rem", color: "#94A3B8" }}>Multiple images allowed • PNG, JPG, WEBP</p>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} style={{ display: "none" }} />
            </div>

            {/* Selected Files Previews */}
            {previews.length > 0 && (
              <div style={{ marginBottom: "1rem" }}>
                <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748B", marginBottom: "0.5rem" }}>
                  {previews.length} image{previews.length > 1 ? "s" : ""} selected:
                </p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {previews.map((p, i) => (
                    <div key={i} style={{ position: "relative", width: "80px", height: "80px" }}>
                      <img
                        src={p.src}
                        alt={p.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px", border: "2px solid #E2E8F0" }}
                      />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removePreview(i); }}
                        style={{
                          position: "absolute",
                          top: "-6px",
                          right: "-6px",
                          width: "20px",
                          height: "20px",
                          background: "#F43F5E",
                          color: "#FFF",
                          border: "none",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          fontSize: "10px",
                        }}
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button type="submit" disabled={uploading} className="btn btn-primary" style={{ padding: "0.75rem 1.5rem" }}>
              <UploadCloud size={18} />
              <span>{uploading ? "Uploading..." : `Upload ${selectedFiles.length > 0 ? selectedFiles.length + " Photo" + (selectedFiles.length > 1 ? "s" : "") : "Photos"}`}</span>
            </button>
          </form>
        </div>

        {errorMsg && <div style={{ color: "#BE123C", marginBottom: "1rem" }}>Error: {errorMsg}</div>}

        {/* Image Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#64748B" }}>
            <div style={{ width: "40px", height: "40px", border: "3px solid #E2E8F0", borderTopColor: "#4F46E5", borderRadius: "50%", margin: "0 auto 1rem", animation: "spin 1s linear infinite" }} />
            <p style={{ fontWeight: 600 }}>Loading gallery photos...</p>
          </div>
        ) : images.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", background: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0" }}>
            <ImageIcon size={40} color="#94A3B8" style={{ marginBottom: "1rem" }} />
            <p style={{ color: "#64748B" }}>No photos uploaded yet. Use the form above to add event pictures.</p>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <p style={{ fontWeight: 700, color: "#0F172A", fontSize: "1rem" }}>
                📷 {images.length} Photo{images.length !== 1 ? "s" : ""} in Gallery
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "12px",
              }}
            >
              {images.map((img) => (
                <div
                  key={img._id}
                  className="card-modern"
                  style={{
                    position: "relative",
                    paddingTop: "100%",
                    overflow: "hidden",
                    borderRadius: "14px",
                  }}
                >
                  <img
                    src={img.image.startsWith("http") ? img.image : `${SERVER_URL}${img.image}`}
                    alt={img.title || "Gallery photo"}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  {img.title && (
                    <div style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: "linear-gradient(transparent, rgba(15,23,42,0.7))",
                      color: "#FFF",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      padding: "20px 8px 6px",
                    }}>
                      {img.title}
                    </div>
                  )}
                  <button
                    onClick={() => setDeleteTarget(img)}
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      background: "rgba(244, 63, 94, 0.9)",
                      color: "#FFF",
                      border: "none",
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "1rem" }}>
          <div className="card-modern" style={{ maxWidth: "380px", width: "100%", padding: "2rem", textAlign: "center" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#FFE4E6", color: "#F43F5E", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
              <Trash2 size={24} />
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0F172A", marginBottom: "6px" }}>Delete Image</h3>
            <p style={{ fontSize: "0.875rem", color: "#64748B", marginBottom: "1.5rem" }}>
              Are you sure you want to delete this photo from the gallery?
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button onClick={() => setDeleteTarget(null)} className="btn btn-outline">Cancel</button>
              <button onClick={handleDelete} className="btn btn-danger">Delete Image</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;