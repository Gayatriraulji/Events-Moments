import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, User, Mail, Lock, UserPlus, ArrowRight } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;
  const BASE_URL = API_URL ? `${API_URL}/users` : "http://localhost:8000/api/v1/users";

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      let data = {};
      try {
        data = await response.json();
      } catch (jsonErr) {
        data = { message: `Server Error (${response.status})` };
      }

      if (response.ok) {
        const successMsg = typeof data.message === "string" ? data.message : "Account created successfully! Redirecting to login...";
        setMessage({ text: successMsg, type: "success" });

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        const errorMsg = typeof data.message === "string" ? data.message : "Registration failed. Please check your details.";
        setMessage({ text: errorMsg, type: "danger" });
      }
    } catch (error) {
      setMessage({ text: "Unable to connect to backend server. Please check CORS and server status.", type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 72px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1.5rem",
        background: "#141E15",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Botanical ambient halos */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "550px",
          height: "550px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(142, 169, 144, 0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(197, 160, 89, 0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="animate-fade-in"
        style={{
          maxWidth: "460px",
          width: "100%",
          background: "#1B271C",
          borderRadius: "28px",
          border: "1px solid rgba(197, 160, 89, 0.28)",
          padding: "3rem 2.25rem",
          boxShadow: "0 30px 60px rgba(0, 0, 0, 0.45)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Top gold accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "20%",
            right: "20%",
            height: "2px",
            background: "linear-gradient(90deg, transparent, #C5A059, transparent)",
            borderRadius: "0 0 4px 4px",
          }}
        />

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.25rem" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "rgba(197, 160, 89, 0.15)",
              border: "1px solid rgba(197, 160, 89, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#DFBF80",
              margin: "0 auto 1.25rem",
              boxShadow: "0 8px 24px rgba(197, 160, 89, 0.2)",
            }}
          >
            <UserPlus size={26} color="#C5A059" />
          </div>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "2.1rem",
              fontWeight: 500,
              color: "#FAF7F2",
              marginBottom: "6px",
              letterSpacing: "-0.01em",
            }}
          >
            Join the Atelier
          </h2>
          <p style={{ fontSize: "0.875rem", color: "#8EA990" }}>
            Create an account to reserve bespoke floral arrangements & events
          </p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            style={{
              padding: "0.85rem 1rem",
              borderRadius: "14px",
              fontSize: "0.85rem",
              fontWeight: 600,
              marginBottom: "1.5rem",
              background: message.type === "success" ? "rgba(142, 169, 144, 0.18)" : "rgba(226, 104, 90, 0.15)",
              color: message.type === "success" ? "#8EA990" : "#E2685A",
              border: `1px solid ${message.type === "success" ? "rgba(142, 169, 144, 0.4)" : "rgba(226, 104, 90, 0.35)"}`,
              textAlign: "center",
            }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="fullName" style={{ color: "#B4C2B6" }}>Full Name</label>
            <div style={{ position: "relative" }}>
              <User
                size={17}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: focused === "fullName" ? "#C5A059" : "#728274",
                  transition: "color 0.2s",
                }}
              />
              <input
                type="text"
                id="fullName"
                placeholder="Eleanor Vance"
                value={formData.fullName}
                onChange={handleChange}
                onFocus={() => setFocused("fullName")}
                onBlur={() => setFocused(null)}
                required
                className="form-input"
                style={{
                  paddingLeft: "42px",
                  background: "#223224",
                  borderColor: focused === "fullName" ? "#C5A059" : "rgba(255, 255, 255, 0.1)",
                  color: "#FAF7F2",
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="username" style={{ color: "#B4C2B6" }}>Username</label>
            <div style={{ position: "relative" }}>
              <User
                size={17}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: focused === "username" ? "#C5A059" : "#728274",
                  transition: "color 0.2s",
                }}
              />
              <input
                type="text"
                id="username"
                placeholder="eleanor_v"
                value={formData.username}
                onChange={handleChange}
                onFocus={() => setFocused("username")}
                onBlur={() => setFocused(null)}
                minLength={3}
                required
                className="form-input"
                style={{
                  paddingLeft: "42px",
                  background: "#223224",
                  borderColor: focused === "username" ? "#C5A059" : "rgba(255, 255, 255, 0.1)",
                  color: "#FAF7F2",
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email" style={{ color: "#B4C2B6" }}>Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail
                size={17}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: focused === "email" ? "#C5A059" : "#728274",
                  transition: "color 0.2s",
                }}
              />
              <input
                type="email"
                id="email"
                placeholder="eleanor@luxury.com"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                required
                className="form-input"
                style={{
                  paddingLeft: "42px",
                  background: "#223224",
                  borderColor: focused === "email" ? "#C5A059" : "rgba(255, 255, 255, 0.1)",
                  color: "#FAF7F2",
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password" style={{ color: "#B4C2B6" }}>Password</label>
            <div style={{ position: "relative" }}>
              <Lock
                size={17}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: focused === "password" ? "#C5A059" : "#728274",
                  transition: "color 0.2s",
                }}
              />
              <input
                type="password"
                id="password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                minLength={6}
                required
                className="form-input"
                style={{
                  paddingLeft: "42px",
                  background: "#223224",
                  borderColor: focused === "password" ? "#C5A059" : "rgba(255, 255, 255, 0.1)",
                  color: "#FAF7F2",
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="aloriga-pill-btn gold"
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "0.88rem",
              marginTop: "0.75rem",
              opacity: loading ? 0.7 : 1,
            }}
          >
            <UserPlus size={16} />
            <span>{loading ? "Creating Account..." : "Create Atelier Account"}</span>
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.75rem", fontSize: "0.875rem", color: "#8EA990" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#DFBF80", fontWeight: 700, textDecoration: "none" }}>
            Sign in here <ArrowRight size={13} style={{ display: "inline", verticalAlign: "middle" }} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;