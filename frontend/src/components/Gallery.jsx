import React, { useEffect, useState } from "react";
import { Sparkles, X, ChevronLeft, ChevronRight, Grid, Columns, Maximize2 } from "lucide-react";

const defaultAlorigaGallery = [
  {
    _id: "gal-1",
    title: "Jessica & Andrew — Wedding Floral & Decor Styling",
    category: "Weddings",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=85",
    description: "Grand ivory floral arch with scented English roses and cascading eucalyptus.",
  },
  {
    _id: "gal-2",
    title: "The Executive Lounge — Club Nights & Lifestyle Events",
    category: "Corporate Events",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=85",
    description: "Dramatic green foliage, velvet staging, and golden floral centerpieces.",
  },
  {
    _id: "gal-3",
    title: "Elysian Gala — Luxury Botanical Scenography",
    category: "Installations",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=85",
    description: "Suspended botanical canopies with over 4,000 blooms and glass globes.",
  },
  {
    _id: "gal-4",
    title: "Solarium Botanical Vows",
    category: "Weddings",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=85",
    description: "Sunlit greenhouse wedding adorned with wisteria and white ranunculus.",
  },
  {
    _id: "gal-5",
    title: "Verdant Opulence Hotel Installation",
    category: "Installations",
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=1200&q=85",
    description: "Curated lobby floral architecture blending rare anthuriums and tropical foliage.",
  },
  {
    _id: "gal-6",
    title: "Private Villa Autumn Soirée",
    category: "Private Events",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=85",
    description: "Warm amber tablescapes, dried pampas, and terracotta floral arrangements.",
  },
  {
    _id: "gal-7",
    title: "Handcrafted Bridal Bouquet Suite",
    category: "Weddings",
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=1200&q=85",
    description: "Delicate peonies, garden roses, and silk trailing ribbons.",
  },
  {
    _id: "gal-8",
    title: "Vogue Runway Botanical Art",
    category: "Installations",
    image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&q=85",
    description: "High-fashion living botanical backdrop for runway presentation.",
  },
];

const API_URL = process.env.REACT_APP_API_URL;
const SERVER_URL = API_URL ? API_URL.replace("/api/v1", "") : "http://localhost:8000";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [layout, setLayout] = useState("masonry");
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`${API_URL}/gallery`);
        const response = await res.json();
        if (res.ok && response.data && response.data.length > 0) {
          setImages(response.data);
        } else {
          setImages(defaultAlorigaGallery);
        }
      } catch (error) {
        setImages(defaultAlorigaGallery);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const openLightbox = (img, index) => {
    setLightboxImage(img);
    setLightboxIndex(index);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    const newIndex = (lightboxIndex - 1 + filteredImages.length) % filteredImages.length;
    setLightboxIndex(newIndex);
    setLightboxImage(filteredImages[newIndex]);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    const newIndex = (lightboxIndex + 1) % filteredImages.length;
    setLightboxIndex(newIndex);
    setLightboxImage(filteredImages[newIndex]);
  };

  const getImgSrc = (img) => {
    if (!img.image) return "";
    return img.image.startsWith("http") ? img.image : `${SERVER_URL}${img.image}`;
  };

  const categories = ["ALL", "Weddings", "Corporate Events", "Private Events", "Installations"];

  const filteredImages =
    selectedFilter === "ALL"
      ? images
      : images.filter((img) => img.category?.toLowerCase() === selectedFilter.toLowerCase());

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
          <span>Atelier Archives & Installations</span>
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
          Featured Work
        </h1>
        <div style={{ width: "50px", height: "1px", background: "#C5A059", margin: "0 auto 1.2rem" }} />
        <p style={{ color: "#B4C2B6", maxWidth: "600px", margin: "0 auto", fontSize: "1rem", lineHeight: 1.7 }}>
          Handcrafted Designs That Tell a Story — A visual portfolio of bespoke botanical scenography.
        </p>
      </div>

      {/* Filter Tabs & Layout Switcher */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto 2.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.2rem",
        }}
      >
        {/* Category Pills */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              style={{
                background: selectedFilter === cat ? "rgba(197, 160, 89, 0.25)" : "rgba(255, 255, 255, 0.04)",
                border: `1px solid ${selectedFilter === cat ? "#C5A059" : "rgba(255, 255, 255, 0.1)"}`,
                color: selectedFilter === cat ? "#DFBF80" : "#B4C2B6",
                padding: "8px 18px",
                borderRadius: "9999px",
                fontSize: "0.78rem",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Layout Buttons */}
        <div style={{ display: "flex", gap: "8px" }}>
          {[
            { id: "masonry", icon: <Columns size={16} />, label: "Masonry" },
            { id: "grid", icon: <Grid size={16} />, label: "Grid" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setLayout(btn.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 16px",
                borderRadius: "9999px",
                border: `1px solid ${layout === btn.id ? "rgba(197, 160, 89, 0.45)" : "rgba(255, 255, 255, 0.08)"}`,
                background: layout === btn.id ? "rgba(197, 160, 89, 0.15)" : "rgba(255, 255, 255, 0.03)",
                color: layout === btn.id ? "#DFBF80" : "#A6B8A8",
                cursor: "pointer",
                fontSize: "0.78rem",
                fontWeight: 600,
                transition: "all 0.25s ease",
              }}
            >
              {btn.icon}
              <span>{btn.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Showcase */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "6rem 0" }}>
          <div className="spinner" style={{ borderTopColor: "#C5A059" }} />
          <p style={{ color: "#8EA990", fontWeight: 500 }}>Loading visual archives...</p>
        </div>
      ) : (
        <div
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
            columns: layout === "masonry" ? "3 320px" : "initial",
            columnGap: "1.5rem",
            display: layout === "grid" ? "grid" : "block",
            gridTemplateColumns: layout === "grid" ? "repeat(auto-fill, minmax(340px, 1fr))" : "initial",
            gap: layout === "grid" ? "1.5rem" : "initial",
          }}
        >
          {filteredImages.map((img, i) => {
            const isHovered = hoveredId === (img._id || i);
            return (
              <div
                key={img._id || i}
                onClick={() => openLightbox(img, i)}
                onMouseEnter={() => setHoveredId(img._id || i)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  position: "relative",
                  breakInside: "avoid",
                  marginBottom: layout === "masonry" ? "1.5rem" : 0,
                  borderRadius: "22px",
                  overflow: "hidden",
                  cursor: "pointer",
                  border: isHovered ? "1px solid rgba(197, 160, 89, 0.5)" : "1px solid rgba(255,255,255,0.08)",
                  transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                  boxShadow: isHovered ? "0 20px 45px rgba(0,0,0,0.5), 0 0 30px rgba(197,160,89,0.15)" : "0 8px 25px rgba(0,0,0,0.3)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: "#1C291D",
                }}
              >
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img
                    src={getImgSrc(img)}
                    alt={img.title || "Floral composition"}
                    style={{
                      width: "100%",
                      display: "block",
                      objectFit: "cover",
                      transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
                      transform: isHovered ? "scale(1.08)" : "scale(1)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(14, 22, 15, 0.9) 0%, rgba(14, 22, 15, 0.2) 60%, transparent 100%)",
                      opacity: isHovered ? 1 : 0.6,
                      transition: "opacity 0.35s ease",
                    }}
                  />

                  {/* Overlaid Information */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "1.5rem",
                      zIndex: 3,
                    }}
                  >
                    {img.category && (
                      <span
                        style={{
                          fontSize: "0.68rem",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "#DFBF80",
                          fontWeight: 700,
                          display: "block",
                          marginBottom: "4px",
                        }}
                      >
                        {img.category}
                      </span>
                    )}
                    <h3
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: "1.4rem",
                        fontWeight: 600,
                        color: "#FAF7F2",
                        margin: "0 0 4px",
                      }}
                    >
                      {img.title || "Bespoke Botanical Commission"}
                    </h3>
                    {img.description && (
                      <p style={{ fontSize: "0.82rem", color: "#B4C2B6", margin: 0, lineHeight: 1.5 }}>
                        {img.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 16, 11, 0.94)",
            backdropFilter: "blur(20px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <button
            onClick={() => setLightboxImage(null)}
            style={{
              position: "absolute",
              top: "2rem",
              right: "2rem",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#FAF7F2",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={20} />
          </button>

          <button
            onClick={prevImage}
            style={{
              position: "absolute",
              left: "2rem",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#FAF7F2",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextImage}
            style={{
              position: "absolute",
              right: "2rem",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#FAF7F2",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ChevronRight size={24} />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "900px",
              maxHeight: "85vh",
              borderRadius: "24px",
              overflow: "hidden",
              border: "1px solid rgba(197, 160, 89, 0.4)",
              background: "#182319",
              boxShadow: "0 25px 60px rgba(0,0,0,0.8)",
            }}
          >
            <img
              src={getImgSrc(lightboxImage)}
              alt={lightboxImage.title || "Full view"}
              style={{ width: "100%", maxHeight: "70vh", objectFit: "contain", display: "block" }}
            />
            <div style={{ padding: "1.5rem 2rem", background: "#1C291D" }}>
              <div style={{ fontSize: "0.74rem", textTransform: "uppercase", color: "#DFBF80", letterSpacing: "0.1em" }}>
                {lightboxImage.category || "Aloriga Collection"}
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.8rem", color: "#FAF7F2", margin: "4px 0" }}>
                {lightboxImage.title}
              </h3>
              {lightboxImage.description && (
                <p style={{ color: "#B4C2B6", fontSize: "0.9rem", margin: 0 }}>
                  {lightboxImage.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;