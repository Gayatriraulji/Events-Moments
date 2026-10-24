import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Sparkles, CheckCircle, ChevronRight, Star } from "lucide-react";

const tierConfig = {
  basic: {
    color: "#8EA990",
    bg: "rgba(142, 169, 144, 0.15)",
    border: "rgba(142, 169, 144, 0.3)",
    label: "Atelier",
    icon: "🌿",
  },
  premium: {
    color: "#DFBF80",
    bg: "rgba(223, 191, 128, 0.15)",
    border: "rgba(223, 191, 128, 0.35)",
    label: "Signature",
    icon: "🌸",
  },
  luxury: {
    color: "#C5A059",
    bg: "rgba(197, 160, 89, 0.2)",
    border: "rgba(197, 160, 89, 0.45)",
    label: "Haute Couture",
    icon: "👑",
  },
};

const defaultFloralPackages = [
  {
    _id: "pkg-1",
    name: "The Atelier Botanical Package",
    tier: "basic",
    price: 38000,
    description: "Designed for intimate celebrations and micro-weddings. Curated bridal bouquet, groom boutonnière, and 4 delicate reception centerpieces.",
    features: [
      "Handcrafted Bridal Bouquet",
      "Groom Boutonnière Set",
      "4 Bespoke Tablescapes",
      "Palette Consultation with Luna",
      "On-site Setup & Styling",
    ],
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&q=80",
  },
  {
    _id: "pkg-2",
    name: "The Elysian Signature Experience",
    tier: "premium",
    price: 85000,
    description: "Our most coveted wedding package. Grand ceremony archway, statement entrance urns, full bridal party flowers, and 12 lush floral runners.",
    features: [
      "Grand Ceremony Floral Arch",
      "Complete Bridal Party Set",
      "12 Scented Gardenia Tablescapes",
      "Aisle Petal Pathway & Lanterns",
      "AI Mood Harmonization Report",
      "Full Day Floral Management",
    ],
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
  },
  {
    _id: "pkg-3",
    name: "Haute Couture Botanical Scenography",
    tier: "luxury",
    price: 180000,
    description: "Full venue botanical transformation for grand weddings and luxury galas. Suspended ceilings, massive floral walls, and custom living floral sculptures.",
    features: [
      "Suspended Botanical Floral Ceiling",
      "Monumental Entry Arch & Photo Wall",
      "Unlimited Luxury Tablescapes",
      "Rare & Imported Organic Stems",
      "Dedicated Senior Floral Architect",
      "Pre-event 3D VR Simulation",
    ],
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  },
];

const API_URL = process.env.REACT_APP_API_URL;
const SERVER_URL = API_URL ? API_URL.replace("/api/v1", "") : "http://localhost:8000";

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(`${API_URL}/packages`);
        const response = await res.json();
        if (res.ok && response.data && response.data.length > 0) {
          setPackages(response.data);
        } else {
          setPackages(defaultFloralPackages);
        }
      } catch (error) {
        setPackages(defaultFloralPackages);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pkg.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const price = pkg.price || 0;
    const matchesMin = minPrice === "" || price >= Number(minPrice);
    const matchesMax = maxPrice === "" || price <= Number(maxPrice);
    return matchesSearch && matchesMin && matchesMax;
  });

  return (
    <div style={{ background: "#141E15", minHeight: "100vh", padding: "4rem 1.5rem 6rem", color: "#F6F4EE" }}>
      {/* Header */}
      <div className="page-header" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
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
          <span>Curated Collections</span>
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
          Bespoke Packages
        </h1>
        <div style={{ width: "50px", height: "1px", background: "#C5A059", margin: "0 auto 1.2rem" }} />
        <p style={{ color: "#B4C2B6", maxWidth: "600px", margin: "0 auto", fontSize: "1rem", lineHeight: 1.7 }}>
          From intimate celebrations to grand architectural scenography — tailored with devotion and art.
        </p>
      </div>



      {/* Search & Price Filter */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "760px",
          margin: "0 auto 3.5rem",
        }}
      >
        <div style={{ position: "relative", flex: "1 1 240px" }}>
          <Search
            size={16}
            color="#8EA990"
            style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            type="text"
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "11px 16px 11px 44px",
              borderRadius: "9999px",
              background: "#1C291D",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#FAF7F2",
              outline: "none",
              fontSize: "0.88rem",
            }}
          />
        </div>

        <input
          type="number"
          placeholder="Min ₹"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={{
            width: "110px",
            padding: "11px 14px",
            borderRadius: "9999px",
            background: "#1C291D",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#FAF7F2",
            outline: "none",
            fontSize: "0.88rem",
          }}
        />

        <input
          type="number"
          placeholder="Max ₹"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{
            width: "110px",
            padding: "11px 14px",
            borderRadius: "9999px",
            background: "#1C291D",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#FAF7F2",
            outline: "none",
            fontSize: "0.88rem",
          }}
        />

        {(searchTerm || minPrice || maxPrice) && (
          <button
            onClick={() => {
              setSearchTerm("");
              setMinPrice("");
              setMaxPrice("");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "0.75rem 1.2rem",
              borderRadius: "9999px",
              border: "1px solid rgba(197, 160, 89, 0.4)",
              background: "rgba(197, 160, 89, 0.12)",
              color: "#DFBF80",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            <X size={14} />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Packages Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "6rem 0" }}>
          <div className="spinner" style={{ borderTopColor: "#C5A059" }} />
          <p style={{ color: "#8EA990", fontWeight: 500 }}>Loading packages...</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "2.5rem",
            maxWidth: "1280px",
            margin: "0 auto",
          }}
        >
          {filteredPackages.map((pkg) => {
            const tier = tierConfig[pkg.tier] || tierConfig.basic;
            const isHovered = hoveredId === pkg._id;
            const imgSrc = pkg.image
              ? pkg.image.startsWith("http")
                ? pkg.image
                : `${SERVER_URL}${pkg.image}`
              : "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80";

            return (
              <div
                key={pkg._id}
                onMouseEnter={() => setHoveredId(pkg._id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  background: "#1C291D",
                  borderRadius: "26px",
                  overflow: "hidden",
                  border: isHovered ? `1px solid ${tier.border}` : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: isHovered
                    ? `0 25px 60px rgba(0,0,0,0.5), 0 0 35px ${tier.color}20`
                    : "0 8px 30px rgba(0,0,0,0.3)",
                  transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                  transition: "all 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Image */}
                <div style={{ width: "100%", height: "240px", overflow: "hidden", position: "relative" }}>
                  <img
                    src={imgSrc}
                    alt={pkg.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
                      transform: isHovered ? "scale(1.08)" : "scale(1)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(14,22,15,0.85) 0%, transparent 60%)",
                    }}
                  />
                  {/* Badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: "14px",
                      left: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 14px",
                      borderRadius: "9999px",
                      background: "rgba(14,22,15,0.8)",
                      backdropFilter: "blur(10px)",
                      border: `1px solid ${tier.border}`,
                      color: tier.color,
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    <span>{tier.icon}</span>
                    <span>{tier.label}</span>
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: "2rem", flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: "1.75rem",
                      fontWeight: 600,
                      color: "#FAF7F2",
                      margin: 0,
                    }}
                  >
                    {pkg.name}
                  </h3>

                  <p style={{ fontSize: "0.88rem", color: "#B4C2B6", lineHeight: 1.65, margin: 0 }}>
                    {pkg.description}
                  </p>

                  {/* Features */}
                  {pkg.features && pkg.features.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "0.5rem 0" }}>
                      {pkg.features.map((feat, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem", color: "#DFE7E0" }}>
                          <CheckCircle size={14} color="#C5A059" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Price + CTA */}
                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: "1.5rem",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: "1.6rem",
                          fontWeight: 700,
                          color: "#DFBF80",
                        }}
                      >
                        ₹{pkg.price ? pkg.price.toLocaleString("en-IN") : "Inquire"}
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/packages/${pkg._id}`)}
                      className="aloriga-pill-btn gold"
                      style={{ padding: "9px 20px", fontSize: "0.78rem" }}
                    >
                      <span>BOOK PACKAGE</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Packages;