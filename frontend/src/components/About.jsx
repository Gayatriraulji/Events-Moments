import React, { useState } from "react";
import { Sparkles, ShieldCheck, Heart, Award, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  const [imgHovered, setImgHovered] = useState(false);

  const values = [
    {
      icon: <Award size={24} />,
      title: "Artisanal Precision",
      desc: "Every stem, petal, and branch is hand-selected and styled by certified master botanists.",
      color: "#C5A059",
      bg: "rgba(197, 160, 89, 0.15)",
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Intelligent AI Curation",
      desc: "We marry classical floral architecture with mood-based algorithms to discover your signature aesthetic.",
      color: "#8EA990",
      bg: "rgba(142, 169, 144, 0.15)",
    },
    {
      icon: <Heart size={24} />,
      title: "Sustainable & Ethical",
      desc: "100% locally sourced and fair-trade blooms from certified organic growers worldwide.",
      color: "#DFBF80",
      bg: "rgba(223, 191, 128, 0.15)",
    },
  ];

  const teamImages = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80",
    "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&q=80",
  ];

  return (
    <div style={{ background: "#141E15", minHeight: "100vh", padding: "4rem 1.5rem", color: "#F6F4EE" }}>
      {/* Header */}
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
          <span>The Atelier & Philosophy</span>
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
          About Aloriga
        </h1>
        <div style={{ width: "50px", height: "1px", background: "#C5A059", margin: "0 auto 1.2rem" }} />
        <p style={{ color: "#B4C2B6", maxWidth: "600px", margin: "0 auto", fontSize: "1rem", lineHeight: 1.7 }}>
          Designing stories in petals, not just bouquets. Where bespoke botanical craftsmanship meets intelligent floral discovery.
        </p>
      </div>

      {/* Main Grid */}
      <div
        style={{
          maxWidth: "1160px",
          margin: "0 auto 5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "3rem",
          alignItems: "center",
        }}
      >
        {/* Text Card */}
        <div
          style={{
            background: "#1C291D",
            borderRadius: "26px",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "2.8rem",
            boxShadow: "0 20px 45px rgba(0,0,0,0.3)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "2rem",
              fontWeight: 600,
              color: "#FAF7F2",
              marginBottom: "1.25rem",
              lineHeight: 1.25,
            }}
          >
            Crafting Living Art for{" "}
            <span style={{ fontStyle: "italic", color: "#E0C283" }}>
              Unforgettable Celebrations
            </span>
          </h2>

          <p style={{ fontSize: "0.95rem", color: "#B4C2B6", lineHeight: 1.8, marginBottom: "1.25rem" }}>
            Founded by Luna Sage, Aloriga is a premier floral design studio recognized internationally for sculptural floral installations, bespoke wedding scenography, and luxury brand activations.
          </p>

          <p style={{ fontSize: "0.95rem", color: "#B4C2B6", lineHeight: 1.8, marginBottom: "2rem" }}>
            Luna’s approach unites Japanese Ikebana balance with Paris haute couture botanical architecture. With our intelligent AI studio, every client discovers palettes and arrangements that resonate with their celebration’s true soul.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "2rem",
            }}
          >
            {[
              "Paris & Kyoto Trained",
              "AI Mood Discovery",
              "100% Organic Sourcing",
              "On-Site Master Styling",
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "#FAF7F2",
                }}
              >
                <CheckCircle size={15} color="#C5A059" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/contact")}
            className="aloriga-pill-btn gold"
            style={{ width: "100%", justifyContent: "center", padding: "12px" }}
          >
            <span>BOOK A CONSULTATION</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Event Celebration Showcase Card */}
        <div
          style={{
            position: "relative",
            borderRadius: "26px",
            overflow: "hidden",
            border: imgHovered ? "1px solid rgba(197, 160, 89, 0.5)" : "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
            transition: "all 0.45s ease",
            cursor: "pointer",
          }}
          onMouseEnter={() => setImgHovered(true)}
          onMouseLeave={() => setImgHovered(false)}
        >
          <img
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=85"
            alt="Luxury Event Celebration & Scenography"
            style={{
              width: "100%",
              height: "460px",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: imgHovered ? "scale(1.05)" : "scale(1)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(14,22,15,0.85) 0%, transparent 60%)",
            }}
          />
          <div style={{ position: "absolute", bottom: "1.8rem", left: "1.8rem", right: "1.8rem" }}>
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "1.6rem",
                color: "#FAF7F2",
                fontWeight: 600,
                margin: "0 0 4px",
              }}
            >
              Signature Events & Scenography
            </h3>
            <p style={{ fontSize: "0.84rem", color: "#DFBF80", margin: 0, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Bespoke Weddings & Grand Celebrations
            </p>
          </div>
        </div>
      </div>

      {/* Values Strip */}
      <div style={{ maxWidth: "1160px", margin: "0 auto 5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.8rem",
          }}
        >
          {values.map((v, i) => (
            <div
              key={i}
              style={{
                background: "#182319",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "20px",
                padding: "2rem",
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: v.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: v.color,
                  marginBottom: "1.2rem",
                }}
              >
                {v.icon}
              </div>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "1.35rem",
                  fontWeight: 600,
                  color: "#FAF7F2",
                  marginBottom: "0.5rem",
                }}
              >
                {v.title}
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#A8BCA9", lineHeight: 1.6, margin: 0 }}>
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Atelier Gallery Strip */}
      <div
        style={{
          maxWidth: "1160px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.2rem",
        }}
      >
        {teamImages.map((src, i) => (
          <div
            key={i}
            style={{
              height: "220px",
              borderRadius: "18px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <img
              src={src}
              alt={`Atelier work ${i + 1}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;