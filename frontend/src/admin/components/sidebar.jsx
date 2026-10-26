import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Sparkles,
  LayoutDashboard,
  Users,
  FolderTree,
  Package,
  Image as ImageIcon,
  Star,
  CalendarCheck,
  BookOpen,
  Settings,
  LogOut,
  Zap,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/admin/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={15} /> },
    { name: "Users", path: "/admin/users", icon: <Users size={15} /> },
    { name: "Categories", path: "/admin/categories", icon: <FolderTree size={15} /> },
    { name: "Packages", path: "/admin/packages", icon: <Package size={15} /> },
    { name: "Services", path: "/admin/services", icon: <Zap size={15} /> },
    { name: "Gallery", path: "/admin/gallery", icon: <ImageIcon size={15} /> },
    { name: "Reviews", path: "/admin/reviews", icon: <Star size={15} /> },
    { name: "Bookings", path: "/admin/bookings", icon: <CalendarCheck size={15} /> },
    { name: "Package Bookings", path: "/admin/package-bookings", icon: <BookOpen size={15} /> },
    { name: "Settings", path: "/admin/settings", icon: <Settings size={15} /> },
  ];

  const linkStyle = (isActive) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "9px 14px",
    fontSize: "0.82rem",
    borderRadius: "9999px",
    textDecoration: "none",
    color: isActive ? "#FAF7F2" : "#A6B8A8",
    background: isActive ? "rgba(197, 160, 89, 0.18)" : "transparent",
    border: isActive ? "1px solid rgba(197, 160, 89, 0.35)" : "1px solid transparent",
    fontWeight: isActive ? 700 : 500,
    transition: "all 0.2s ease",
  });

  return (
    <aside
      className="admin-sidebar"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#1B271C",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      {/* Brand Header */}
      <div
        className="admin-sidebar-brand"
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "1.25rem 1.25rem 1rem",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "12px",
            background: "rgba(197, 160, 89, 0.18)",
            border: "1px solid rgba(197, 160, 89, 0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#DFBF80",
          }}
        >
          <Sparkles size={18} color="#C5A059" />
        </div>
        <div>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "1.45rem",
              fontWeight: 600,
              color: "#FAF7F2",
              letterSpacing: "-0.01em",
              display: "block",
              lineHeight: 1.1,
            }}
          >
            aloriga
          </span>
          <span
            style={{
              fontSize: "0.65rem",
              display: "block",
              color: "#8EA990",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Atelier Console
          </span>
        </div>
      </div>

      {/* Scrollable Navigation Items */}
      <div
        className="admin-sidebar-nav hide-scrollbar"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px 10px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <div
          style={{
            fontSize: "0.68rem",
            fontWeight: 700,
            color: "#728274",
            textTransform: "uppercase",
            padding: "8px 12px 4px",
            letterSpacing: "0.1em",
          }}
        >
          Curation & Management
        </div>

        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              style={linkStyle(isActive)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(197, 160, 89, 0.25)";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                // Reset to original style based on active state
                const isActive = location.pathname === item.path;
                e.currentTarget.style.background = isActive ? "rgba(197, 160, 89, 0.18)" : "transparent";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Logout Footer */}
      <div style={{ flexShrink: 0, padding: "0.85rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "0.6rem 1rem",
            borderRadius: "9999px",
            background: "rgba(226, 104, 90, 0.14)",
            color: "#E2685A",
            border: "1px solid rgba(226, 104, 90, 0.3)",
            fontWeight: 700,
            fontSize: "0.8rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(226, 104, 90, 0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(226, 104, 90, 0.14)";
          }}
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
    </aside>
  );
};

export default Sidebar;