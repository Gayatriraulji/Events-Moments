import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, ChevronRight, Sparkles, X, ArrowRight } from "lucide-react";

const defaultFloralCategories = [
  {
    _id: "cat-weddings",
    name: "Luxury Wedding Scenography",
    description: "Bridal bouquets, grand ceremony aisle styling, statement archways, and reception tablescapes.",
    price: 45000,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
  },
  {
    _id: "cat-corporate",
    name: "Corporate & Brand Galas",
    description: "Bespoke stage botanical backdrops, VIP floral runners, and executive brand flower curation.",
    price: 35000,
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
  },
  {
    _id: "cat-private",
    name: "Private Celebrations & Banquets",
    description: "Intimate villa soirées, milestone birthday florals, and candlelight botanical experiences.",
    price: 25000,
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
  },
  {
    _id: "cat-installations",
    name: "Permanent & Seasonal Installations",
    description: "Sculptural floral art for hotel lobbies, high-fashion boutiques, and luxury commercial flagships.",
    price: 60000,
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&q=80",
  },
  {
    _id: "cat-bouquets",
    name: "Couture Bridal Bouquets",
    description: "Handcrafted peony, garden rose, and ranunculus arrangements with imported silk ribbons.",
    price: 12000,
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&q=80",
  },
  {
    _id: "cat-solarium",
    name: "Solarium & Garden Ceremonies",
    description: "Enchanted botanical canopies, hanging wisteria, and meadow-style floral pathways.",
    price: 50000,
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
  },
];

const API_URL = process.env.REACT_APP_API_URL;
const SERVER_URL = API_URL ? API_URL.replace("/api/v1", "") : "http://localhost:8000";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const response = await res.json();
        if (res.ok && response.data && response.data.length > 0) {
          setCategories(response.data);
        } else {
          setCategories(defaultFloralCategories);
        }
      } catch (error) {
        setCategories(defaultFloralCategories);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cat.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const price = cat.price || 0;
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
          <span>Curated Offerings</span>
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
          Floral Categories
        </h1>
        <div style={{ width: "50px", height: "1px", background: "#C5A059", margin: "0 auto 1.2rem" }} />
        <p style={{ color: "#B4C2B6", maxWidth: "600px", margin: "0 auto", fontSize: "1rem", lineHeight: 1.7 }}>
          Explore our bespoke botanical collections designed for defining moments.
        </p>
      </div>

      {/* Filters Bar */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "800px",
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
            placeholder="Search floral themes..."
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

      {/* Categories Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "6rem 0" }}>
          <div className="spinner" style={{ borderTopColor: "#C5A059" }} />
          <p style={{ color: "#8EA990", fontWeight: 500 }}>Loading botanical collections...</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "2rem",
            maxWidth: "1320px",
            margin: "0 auto",
          }}
        >
          {filteredCategories.map((cat, i) => {
            const isHovered = hoveredId === cat._id;
            const imgSrc = cat.image
              ? cat.image.startsWith("http")
                ? cat.image
                : `${SERVER_URL}${cat.image}`
              : "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80";

            return (
              <div
                key={cat._id}
                onClick={() => navigate(`/categories/${cat._id}`)}
                onMouseEnter={() => setHoveredId(cat._id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  position: "relative",
                  borderRadius: "24px",
                  overflow: "hidden",
                  height: "380px",
                  cursor: "pointer",
                  border: isHovered
                    ? "1px solid rgba(197, 160, 89, 0.5)"
                    : "1px solid rgba(255, 255, 255, 0.08)",
                  transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                  boxShadow: isHovered
                    ? "0 25px 50px rgba(0,0,0,0.5), 0 0 30px rgba(197,160,89,0.15)"
                    : "0 8px 30px rgba(0,0,0,0.3)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: "#182319",
                }}
              >
                <img
                  src={imgSrc}
                  alt={cat.name}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: isHovered ? "scale(1.08)" : "scale(1)",
                  }}
                />

                {/* Dark Gradient Overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: isHovered
                      ? "linear-gradient(to top, rgba(14,22,15,0.95) 0%, rgba(14,22,15,0.3) 55%, transparent 100%)"
                      : "linear-gradient(to top, rgba(14,22,15,0.88) 0%, rgba(14,22,15,0.2) 60%, transparent 100%)",
                    transition: "background 0.35s ease",
                  }}
                />

                {/* Bottom Content */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "1.8rem",
                    zIndex: 3,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: "1.7rem",
                      fontWeight: 600,
                      color: "#FAF7F2",
                      margin: "0 0 6px",
                    }}
                  >
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p
                      style={{
                        fontSize: "0.84rem",
                        color: "#B4C2B6",
                        margin: "0 0 16px",
                        lineHeight: 1.55,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {cat.description}
                    </p>
                  )}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {cat.price && (
                      <span
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          background: "rgba(197, 160, 89, 0.16)",
                          border: "1px solid rgba(197, 160, 89, 0.3)",
                          color: "#DFBF80",
                          padding: "5px 14px",
                          borderRadius: "9999px",
                        }}
                      >
                        From ₹{cat.price.toLocaleString("en-IN")}
                      </span>
                    )}

                    <button
                      className="aloriga-pill-btn gold"
                      style={{ padding: "8px 18px", fontSize: "0.76rem" }}
                    >
                      <span>BOOK NOW</span>
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

export default Categories;