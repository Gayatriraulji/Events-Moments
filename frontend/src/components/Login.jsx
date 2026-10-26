import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, Mail, Lock, LogIn, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");
    if (token) {
      navigate(role === "admin" ? "/admin/dashboard" : "/");
    }
  }, [navigate]);

  const API_URL = process.env.REACT_APP_API_URL;
  const BASE_URL = API_URL ? `${API_URL}/users` : "http://localhost:8000/api/v1/users";

  const handleChange = (e) => setCredentials({ ...credentials, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });
      let data = {};
      try { data = await response.json(); } catch { data = { message: `Server Error (${response.status})` }; }
      if (response.ok) {
        const { accessToken, refreshToken, user } = data.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("role", user.role);
        localStorage.setItem("username", user.username || user.fullName);
        setMessage({ text: "Welcome back! Entering the atelier...", type: "success" });
        setTimeout(() => { navigate(user.role === "admin" ? "/admin/dashboard" : "/"); }, 1000);
      } else {
        setMessage({ text: typeof data.message === "string" ? data.message : "Authentication failed.", type: "danger" });
      }
    } catch {
      setMessage({ text: "Unable to reach the atelier server. Please verify backend status.", type: "danger" });
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
      {/* Background botanical ambient halos */}
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
          maxWidth: "440px",
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
            <LogIn size={26} color="#C5A059" />
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
            Welcome Back
          </h2>
          <p style={{ fontSize: "0.875rem", color: "#8EA990" }}>
            Sign in to manage your botanical reservations & event consults
          </p>
        </div>

        {/* Alert */}
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
          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email" style={{ color: "#B4C2B6" }}>Client Email</label>
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
                placeholder="client@luxury.com"
                value={credentials.email}
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

          {/* Password */}
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
                type={showPass ? "text" : "password"}
                id="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleChange}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                required
                className="form-input"
                style={{
                  paddingLeft: "42px",
                  paddingRight: "42px",
                  background: "#223224",
                  borderColor: focused === "password" ? "#C5A059" : "rgba(255, 255, 255, 0.1)",
                  color: "#FAF7F2",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#8EA990",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
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
            <LogIn size={16} />
            <span>{loading ? "Verifying Credentials..." : "Access Atelier Account"}</span>
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <div style={{ fontSize: "0.875rem", color: "#8EA990" }}>
            New to Aloriga?{" "}
            <Link to="/register" style={{ color: "#DFBF80", fontWeight: 700, textDecoration: "none" }}>
              Join the Studio <ArrowRight size={13} style={{ display: "inline", verticalAlign: "middle" }} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;