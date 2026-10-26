import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Gem,
  LogIn,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  CalendarCheck,
  Home as HomeIcon,
  Info,
  Package as PackageIcon,
  Layers,
  Image as GalleryIcon,
  Star,
  PhoneCall,
  Briefcase,
  ChevronDown,
} from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [siteName, setSiteName] = useState("Evento");
  const [scrolled, setScrolled] = useState(false);

  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_URL}/settings`);
        const response = await res.json();
        if (res.ok && response.data?.siteName) {
          setSiteName(response.data.siteName);
        }
      } catch (error) {}
    };
    fetchSettings();
  }, [API_URL]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (location.pathname.startsWith("/admin")) return null;

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const isItemActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navItems = [
    { label: "Home", desktopLabel: "HOME", path: "/", icon: <HomeIcon size={15} /> },
    { label: "About", desktopLabel: "ABOUT", path: "/about", icon: <Info size={15} /> },
    { label: "Services", desktopLabel: "SERVICES", path: "/services", icon: <Briefcase size={15} /> },
    { label: "Categories", desktopLabel: "CATEGORIES", path: "/categories", icon: <Layers size={15} /> },
    { label: "Packages", desktopLabel: "PACKAGES", path: "/packages", icon: <PackageIcon size={15} /> },
    { label: "Reviews", desktopLabel: "REVIEWS", path: "/reviews", icon: <Star size={15} /> },
    { label: "Contact", desktopLabel: "CONTACT", path: "/contact", icon: <PhoneCall size={15} /> },
  ];

  return (
    <>
      {/* Top Excellence Ribbon */}
      <div className="aloriga-ribbon">
        <span>International Floral Design Excellence Award – 2023</span>
        <span style={{ margin: "0 12px", opacity: 0.5 }}>•</span>
        <span>AI Design Innovation Award – 2024</span>
        <span style={{ margin: "0 12px", opacity: 0.5 }}>•</span>
        <span>Floral Design Innovation Award – 2025</span>
      </div>

      <header
        style={{
          background: scrolled
            ? "rgba(20, 30, 21, 0.95)"
            : "rgba(20, 30, 21, 0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.4)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: "1360px",
            margin: "0 auto",
            padding: "0 1.5rem",
            height: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.5rem",
          }}
        >
          {/* Brand Logo - Aloriga Style */}
          <Link
            to="/"
            className="aloriga-logo"
            style={{ textDecoration: "none" }}
          >
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "2rem", fontWeight: 600, color: "#F6F4EE" }}>
              aloriga
            </span>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#C5A059", display: "inline-block", marginLeft: "2px" }} />
          </Link>

          {/* Desktop Navigation */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            className="desktop-nav"
          >
            {navItems.map((item) => {
              const isActive = isItemActive(item.path);
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  style={{
                    textDecoration: "none",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    color: isActive ? "#F6F4EE" : "#A6B8A8",
                    padding: "7px 14px",
                    borderRadius: "9999px",
                    background: isActive ? "rgba(95, 119, 97, 0.28)" : "transparent",
                    border: isActive ? "1px solid rgba(197, 160, 89, 0.35)" : "1px solid transparent",
                    transition: "all 0.25s ease",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#FFFFFF";
                      e.currentTarget.style.background = "rgba(95, 119, 97, 0.15)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#A6B8A8";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {item.desktopLabel}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            <Link
              to="/my-bookings"
              className="desktop-nav"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.78rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
                color: location.pathname === "/my-bookings" ? "#DFBF80" : "#A6B8A8",
                background: location.pathname === "/my-bookings"
                  ? "rgba(197, 160, 89, 0.14)"
                  : "rgba(255,255,255,0.04)",
                border: `1px solid ${location.pathname === "/my-bookings" ? "rgba(197,160,89,0.3)" : "rgba(255,255,255,0.06)"}`,
                padding: "7px 14px",
                borderRadius: "9999px",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#DFBF80";
                e.currentTarget.style.borderColor = "rgba(197,160,89,0.3)";
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== "/my-bookings") {
                  e.currentTarget.style.color = "#A6B8A8";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                }
              }}
            >
              <CalendarCheck size={14} color="#C5A059" />
              <span>Bookings</span>
            </Link>

            {token ? (
              <>
                {role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className="btn btn-secondary desktop-nav"
                    style={{ padding: "7px 14px", fontSize: "0.82rem", borderRadius: "9999px" }}
                  >
                    <LayoutDashboard size={14} />
                    <span>Admin</span>
                  </Link>
                )}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(201, 168, 76, 0.08)",
                    padding: "5px 12px 5px 6px",
                    borderRadius: "9999px",
                    border: "1px solid rgba(201, 168, 76, 0.2)",
                  }}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 100%)",
                      color: "#0A0A0F",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                    }}
                  >
                    {username ? username.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#E8C97A" }}>
                    {username || "Account"}
                  </span>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#5C5650",
                      display: "flex",
                      alignItems: "center",
                      padding: "2px",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#D4698A")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#5C5650")}
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary"
                style={{
                  borderRadius: "9999px",
                  padding: "8px 18px",
                  fontSize: "0.85rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <LogIn size={14} />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: "none",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                cursor: "pointer",
                color: "#F0EDE8",
                padding: "8px",
                transition: "all 0.2s",
              }}
              className="mobile-toggle"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div
            style={{
              padding: "1rem 1.25rem 1.5rem",
              background: "rgba(10, 10, 15, 0.98)",
              borderTop: "1px solid rgba(201, 168, 76, 0.1)",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              animation: "fadeIn 0.25s ease",
            }}
          >
            {navItems.map((item) => {
              const isActive = isItemActive(item.path);
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    textDecoration: "none",
                    padding: "11px 14px",
                    borderRadius: "10px",
                    color: isActive ? "#C9A84C" : "#A89E8E",
                    fontWeight: isActive ? 600 : 400,
                    background: isActive ? "rgba(201, 168, 76, 0.08)" : "transparent",
                    border: `1px solid ${isActive ? "rgba(201,168,76,0.2)" : "transparent"}`,
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "0.92rem",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span style={{ color: isActive ? "#C9A84C" : "#5C5650" }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "6px 0" }} />
            <Link
              to="/my-bookings"
              onClick={() => setMobileOpen(false)}
              style={{
                textDecoration: "none",
                padding: "11px 14px",
                borderRadius: "10px",
                color: "#C9A84C",
                fontWeight: 600,
                background: "rgba(201, 168, 76, 0.06)",
                border: "1px solid rgba(201, 168, 76, 0.15)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "0.92rem",
              }}
            >
              <CalendarCheck size={15} color="#C9A84C" />
              <span>My Bookings</span>
            </Link>
          </div>
        )}
      </header>

      <style>{`
        @keyframes goldGlow {
          0%, 100% { box-shadow: 0 4px 16px rgba(201, 168, 76, 0.4); }
          50% { box-shadow: 0 4px 28px rgba(201, 168, 76, 0.7); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 1100px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;