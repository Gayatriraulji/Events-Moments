import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Heart, Award, Layers } from "lucide-react";

const defaultFloralServices = [
  {
    _id: "weddings",
    name: "Weddings & Bridal Scenography",
    description: "Bridal bouquets, ceremony aisle styling, statement archways, and candlelit reception centerpieces designed to embody your love story.",
    highlights: ["Bridal Suites", "Grand Arches", "Tablescapes", "Personalized Florals"],
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
  },
  {
    _id: "corporate",
    name: "Corporate & Brand Galas",
    description: "Immersive floral installations, VIP lounge arrangements, stage botanical architecture, and bespoke branded botanical styling.",
    highlights: ["Brand Integration", "Stage Scenography", "Welcome Displays", "Gala Banquets"],
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
  },
  {
    _id: "private",
    name: "Private Celebrations & Dinners",
    description: "Milestone anniversaries, intimate candlelit birthdays, and luxury ambassador soirées with sensory botanical concepts.",
    highlights: ["Private Villas", "Seasonal Themes", "Floral Sculptures", "Table Setting"],
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
  },
  {
    _id: "installations",
    name: "Architectural Floral Installations",
    description: "Permanent and seasonal botanical art installations for luxury hotel lobbies, high-fashion runways, retail flagships, and studio galleries.",
    highlights: ["Hotel Lobbies", "Fashion Runways", "Sculptural Stems", "Seasonal Curation"],
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&q=80",
  },
];

const API_URL = process.env.REACT_APP_API_URL;
const SERVER_URL = API_URL ? API_URL.replace("/api/v1", "") : "http://localhost:8000";

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_URL}/services`);
        const response = await res.json();
        if (res.ok && response.data && response.data.length > 0) {
          setServices(response.data);
        } else {
          setServices(defaultFloralServices);
        }
      } catch (err) {
        setServices(defaultFloralServices);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div style={{ background: "#141E15", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div>
          <div className="spinner" style={{ borderTopColor: "#C5A059" }} />
          <p style={{ color: "#8EA990", fontWeight: 500, textAlign: "center" }}>Loading botanical suites...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#141E15", minHeight: "100vh", padding: "4rem 1.5rem 6rem", color: "#F6F4EE" }}>
      {/* Page Header */}
      <div className="page-header" style={{ textAlign: "center", marginBottom: "4rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            fontSize: "0.74rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#DFBF80",
            fontWeight: 700,
            marginBottom: "0.8rem",
          }}
        >
          <span>Curated Offerings & Design</span>
        </div>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(2.6rem, 5vw, 4rem)",
            fontWeight: 500,
            color: "#FAF7F2",
            margin: "0 0 1rem",
          }}
        >
          Signature Floral Offerings
        </h1>
        <div style={{ width: "50px", height: "1px", background: "#C5A059", margin: "0 auto 1.2rem" }} />
        <p style={{ color: "#B4C2B6", maxWidth: "600px", margin: "0 auto", fontSize: "1rem", lineHeight: 1.7 }}>
          Thoughtfully crafted botanical styling for extraordinary occasions, tailored by our master floral artisans.
        </p>
      </div>

      {/* Services List */}
      <div
        style={{
          maxWidth: "1120px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.8rem",
        }}
      >
        {services.map((srv) => {
          const isHovered = hoveredId === srv._id;
          const imgSrc = srv.image
            ? srv.image.startsWith("http")
              ? srv.image
              : `${SERVER_URL}${srv.image}`
            : "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80";

          return (
            <div
              key={srv._id}
              onMouseEnter={() => setHoveredId(srv._id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                background: isHovered ? "#233325" : "#1C291D",
                borderRadius: "24px",
                border: isHovered ? "1px solid rgba(197, 160, 89, 0.45)" : "1px solid rgba(255,255,255,0.08)",
                boxShadow: isHovered ? "0 20px 45px rgba(0,0,0,0.4), 0 0 30px rgba(197,160,89,0.12)" : "0 8px 25px rgba(0,0,0,0.25)",
                padding: "2rem",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "2rem",
                alignItems: "center",
                transform: isHovered ? "translateY(-3px)" : "translateY(0)",
                transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {/* Left: Image & Description */}
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                <div
                  style={{
                    position: "relative",
                    width: "100px",
                    height: "100px",
                    borderRadius: "20px",
                    flexShrink: 0,
                    overflow: "hidden",
                    border: "1px solid rgba(197, 160, 89, 0.3)",
                  }}
                >
                  <img
                    src={imgSrc}
                    alt={srv.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.6s ease",
                      transform: isHovered ? "scale(1.12)" : "scale(1)",
                    }}
                  />
                </div>

                <div>
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: "1.6rem",
                      fontWeight: 600,
                      color: "#FAF7F2",
                      marginBottom: "6px",
                    }}
                  >
                    {srv.name}
                  </h3>
                  <p style={{ fontSize: "0.88rem", color: "#B4C2B6", lineHeight: 1.65, margin: 0 }}>
                    {srv.description}
                  </p>
                </div>
              </div>

              {/* Right: Highlights & Action */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1.2rem",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {(srv.highlights || []).map((h, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        background: "rgba(95, 119, 97, 0.22)",
                        color: "#DFBF80",
                        padding: "5px 12px",
                        borderRadius: "9999px",
                        border: "1px solid rgba(197, 160, 89, 0.25)",
                      }}
                    >
                      {h}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => navigate("/categories")}
                  className="aloriga-pill-btn gold"
                  style={{ padding: "10px 22px", fontSize: "0.78rem" }}
                >
                  <span>BOOK SUITE</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Services;