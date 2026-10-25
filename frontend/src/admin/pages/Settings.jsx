import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";

const AdminSettings = () => {
  const [formData, setFormData] = useState({
    siteName: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    instagram: "",
    facebook: "",
    whatsapp: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const token = localStorage.getItem("accessToken");
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_URL}/settings`);
        const response = await res.json();
        if (!res.ok) {
          setErrorMsg(response.message || "Failed to fetch settings");
          return;
        }
        setFormData({
          siteName: response.data.siteName || "",
          contactEmail: response.data.contactEmail || "",
          contactPhone: response.data.contactPhone || "",
          address: response.data.address || "",
          instagram: response.data.instagram || "",
          facebook: response.data.facebook || "",
          whatsapp: response.data.whatsapp || "",
        });
      } catch (error) {
        setErrorMsg(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    try {
      const res = await fetch(`${API_URL}/settings`, {
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

      setSuccessMsg("Settings saved successfully!");
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", background: "#F7F7FA", minHeight: "100vh" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "1.5rem" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", background: "#F7F7FA", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "1.5rem" }}>
        <h2 style={{ fontWeight: 500, fontSize: "20px", color: "#C5A059", margin: "0 0 1.2rem" }}>
          Settings
        </h2>

        {errorMsg && <p style={{ color: "red" }}>Error: {errorMsg}</p>}
        {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

        <form
          onSubmit={handleSubmit}
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "1.5rem",
            maxWidth: "500px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div>
            <label style={{ fontSize: "13px", color: "#555" }}>Site Name</label>
            <input name="siteName" value={formData.siteName} onChange={handleChange}
              style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #ddd", marginTop: "4px" }} />
          </div>

          <div>
            <label style={{ fontSize: "13px", color: "#555" }}>Contact Email</label>
            <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange}
              style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #ddd", marginTop: "4px" }} />
          </div>

          <div>
            <label style={{ fontSize: "13px", color: "#555" }}>Contact Phone</label>
            <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange}
              style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #ddd", marginTop: "4px" }} />
          </div>

          <div>
            <label style={{ fontSize: "13px", color: "#555" }}>Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} rows="2"
              style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #ddd", marginTop: "4px", resize: "vertical" }} />
          </div>

          <div>
            <label style={{ fontSize: "13px", color: "#555" }}>Instagram URL</label>
            <input name="instagram" value={formData.instagram} onChange={handleChange}
              style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #ddd", marginTop: "4px" }} />
          </div>

          <div>
            <label style={{ fontSize: "13px", color: "#555" }}>Facebook URL</label>
            <input name="facebook" value={formData.facebook} onChange={handleChange}
              style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #ddd", marginTop: "4px" }} />
          </div>

          <div>
            <label style={{ fontSize: "13px", color: "#555" }}>WhatsApp Number</label>
            <input name="whatsapp" value={formData.whatsapp} onChange={handleChange}
              style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #ddd", marginTop: "4px" }} />
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{ padding: "12px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #C5A059 0%, #DFBF80 100%)", color: "#141E15", fontSize: "14px", cursor: "pointer", fontWeight: 700 }}
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;