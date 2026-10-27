import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Star,
  Play,
  ChevronLeft,
  ChevronRight,
  Heart,
  CheckCircle2,
  X,
  Sliders,
  Send,
  Calendar,
  Layers,
  Award,
  Pause,
  Maximize2,
  Image as ImageIcon,
  Eye,
} from "lucide-react";

// Featured Works Showcase Data (from Aloriga Dribbble Shot)
const featuredWorks = [
  {
    id: 1,
    title: "Jessica & Andrew",
    category: "Wedding Floral & Decor Styling",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1000&q=85",
    theme: "Romantic Ivory & English Gardenia",
    description: "Cascading bridal arches, scented garden roses, and candlelit botanical runners.",
  },
  {
    id: 2,
    title: "The Velvet Solarium",
    category: "Themed Club Nights & Lifestyle Events",
    image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1000&q=85",
    theme: "Emerald Luxe & Velvet Scenography",
    description: "Suspended botanical installations with deep monstera, orchids, and warm amber lighting.",
  },
  {
    id: 3,
    title: "Elysian Gala",
    category: "Luxury Botanical Scenography",
    image: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=1000&q=85",
    theme: "Opulent Banquet & Hanging Wisteria",
    description: "Grand ballrooms transformed into an enchanted botanical conservatory with 4,000 blooms.",
  },
  {
    id: 4,
    title: "Verdant Opulence",
    category: "Hotel Seasonal Installation",
    image: "https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=1000&q=85",
    theme: "High-Fashion Editorial Florals",
    description: "Sculptural floral art combining rare anthuriums, dried botanicals, and hand-blown glass.",
  },
  {
    id: 5,
    title: "Aura of Versailles",
    category: "Haute Couture Botanical Pavilion",
    image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1000&q=85",
    theme: "Blush Peony & French Chinoiserie",
    description: "Delicate ranunculus, pastel hydrangeas, and trailing jasmine framing sunlit champagne towers.",
  },
];

// Offerings / Services Data
const offerings = [
  {
    id: "weddings",
    title: "Weddings",
    subtitle: "Special Bouquet, Aisle Flowers, Reception Centerpiece, Ceremony Arches",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80",
    tags: ["Bridal Suites", "Aisles", "Arches"],
    link: "/categories",
  },
  {
    id: "corporate",
    title: "Corporate Events",
    subtitle: "Stage Decor, Welcome Flowers, VIP Tables, Branding Integration",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80",
    tags: ["Brand Activations", "Galas", "Conferences"],
    link: "/categories",
  },
  {
    id: "private",
    title: "Private Events",
    subtitle: "Birthday, Anniversary, Ambassador Parties, Intimate Dinners",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80",
    tags: ["Anniversaries", "Milestones", "Bespoke Soirées"],
    link: "/categories",
  },
  {
    id: "installations",
    title: "Floral Installations",
    subtitle: "Hotels, Retail, Seasonal Setups, Studio, Shop & Mall Spaces",
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&q=80",
    tags: ["Hotel Lobbies", "Runways", "Retail Windows"],
    link: "/services",
  },
];

// Curated Cinematic Showcase Gallery Data (with High-res images & transitions)
const homeGalleryShowcase = [
  {
    id: "g1",
    title: "The Regal Mandap of Umaid Bhawan",
    category: "Royal Weddings",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=85",
    theme: "Cascading Ivory Orchids & Amber Crystal Chandeliers",
    description: "4,500 handcrafted English roses, live water lilies, and suspended brass lanterns.",
    location: "Palace Courtyard",
    accent: "Masterpiece",
  },
  {
    id: "g2",
    title: "Elysian Glasshouse Sunset Soirée",
    category: "Luxury Receptions",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1600&q=85",
    theme: "Sunlit Glasshouse, Scented Gardenias & Trailing Jasmine",
    description: "Botanical arches intertwining delicate blush ranunculus and gold leaf tablescapes.",
    location: "Conservatory Atrium",
    accent: "Bespoke",
  },
  {
    id: "g3",
    title: "Midnight Emerald & Velvet Ballroom Gala",
    category: "Banquets & Galas",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=85",
    theme: "Dramatic Monsteras, Gold Leaf Urns & Velvet Staging",
    description: "Immersive nocturnal styling featuring candlelit dinner runways and exotic anthuriums.",
    location: "Grand Ballroom",
    accent: "Signature",
  },
  {
    id: "g4",
    title: "Versailles Chinoiserie Champagne Pavilion",
    category: "Floral Mandaps",
    image: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=1600&q=85",
    theme: "Pastel Hydrangeas, White Peonies & Tiered Floral Towers",
    description: "A dreamlike floral sanctuary with hanging wisteria blossoms and hand-blown teardrop glass.",
    location: "Lakeside Lawn",
    accent: "Haute Couture",
  },
  {
    id: "g5",
    title: "Vogue Autumn Runway Editorial Scenography",
    category: "Editorial & Runways",
    image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1600&q=85",
    theme: "Dried Pampas, Terracotta Florals & High-Fashion Textures",
    description: "Architectural botanical installation framing high-fashion bridal presentation.",
    location: "Design Studio",
    accent: "Editorial",
  },
  {
    id: "g6",
    title: "Scented White Gardenia Aisle Pathway",
    category: "Royal Weddings",
    image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1600&q=85",
    theme: "White Ranunculus, Delicate Ferns & Scented Pillar Candles",
    description: "A 40-meter petal carpet framed by lush floral borders and vintage brass lanterns.",
    location: "Cathedral Lawn",
    accent: "Romantic",
  },
];

// Infinite Marquee Track 1 (Sliding Left)
const marqueeImagesRow1 = [
  { id: "m1", title: "Grand Ceremony Arch", tag: "Royal Weddings", img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80", desc: "Ivory garden roses and cascading eucalyptus" },
  { id: "m2", title: "Floating Velvet Urns", tag: "Luxe Gala", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80", desc: "Gold leaf pedestals and deep emerald foliage" },
  { id: "m3", title: "Bespoke Bridal Bouquet", tag: "Atelier", img: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&q=80", desc: "White peonies and trailing silk ribbon" },
  { id: "m4", title: "Amber Candlelit Tablescape", tag: "Private Dinner", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80", desc: "Warm amber glassware and terracotta florals" },
  { id: "m5", title: "Solarium Greenhouse Vows", tag: "Bespoke Vows", img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80", desc: "Sunlit greenhouse adorned with wisteria" },
  { id: "m6", title: "Runway Botanical Art", tag: "Fashion Editorial", img: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&q=80", desc: "Sculptural living runway installation" },
];

// Infinite Marquee Track 2 (Sliding Right)
const marqueeImagesRow2 = [
  { id: "m7", title: "Suspended Wisteria Cloud", tag: "Installations", img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80", desc: "4,000 blossoms hanging from grand ceiling" },
  { id: "m8", title: "Lobby Botanical Canopy", tag: "Hotel Living Art", img: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&q=80", desc: "Anthuriums, orchids, and subtropical palms" },
  { id: "m9", title: "Romantic Evening Aisle", tag: "Weddings", img: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80", desc: "Candlelit petal carpet and warm fairy lights" },
  { id: "m10", title: "French Chinoiserie Pavilion", tag: "Haute Couture", img: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=800&q=80", desc: "Blush hydrangeas and French porcelain vases" },
  { id: "m11", title: "Curated Boutonnière Suite", tag: "Floristry", img: "https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&q=80", desc: "Micro ranunculus with waxflower accents" },
  { id: "m12", title: "Champagne Tower Florals", tag: "Celebrations", img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80", desc: "Cascading garden roses framing crystal towers" },
];

const Home = () => {
  const navigate = useNavigate();

  // Hero Card Carousel
  const [heroCardIndex, setHeroCardIndex] = useState(0);
  const heroCards = [
    {
      title: "Royal Wedding Celebrations",
      theme: "Grand Ballroom & Aisle Styling",
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=90",
      accent: "Luxury Wedding Decor",
    },
    {
      title: "Grand Banquet & Gala Evenings",
      theme: "Opulent Lighting & Table Scenography",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=90",
      accent: "Signature Event Styling",
    },
    {
      title: "Romantic Outdoor Ceremonies",
      theme: "Enchanted Floral Canopy & Stage",
      image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=90",
      accent: "Bespoke Floral Decor",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroCardIndex((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Cinematic Animated Gallery Showcase State
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [galleryIsPlaying, setGalleryIsPlaying] = useState(true);
  const [galleryFilter, setGalleryFilter] = useState("ALL");
  const [homeLightbox, setHomeLightbox] = useState(null);

  // Gallery Auto-Transition Timer (every 5 seconds)
  useEffect(() => {
    if (!galleryIsPlaying) return;
    const gTimer = setInterval(() => {
      setActiveGalleryIndex((prev) => (prev + 1) % homeGalleryShowcase.length);
    }, 5000);
    return () => clearInterval(gTimer);
  }, [galleryIsPlaying]);

  const nextGallerySlide = () => {
    setActiveGalleryIndex((prev) => (prev + 1) % homeGalleryShowcase.length);
  };
  const prevGallerySlide = () => {
    setActiveGalleryIndex((prev) => (prev - 1 + homeGalleryShowcase.length) % homeGalleryShowcase.length);
  };

  // Featured Work Carousel Slider State
  const [workIndex, setWorkIndex] = useState(0);
  const nextWork = () => setWorkIndex((prev) => (prev + 1) % featuredWorks.length);
  const prevWork = () => setWorkIndex((prev) => (prev - 1 + featuredWorks.length) % featuredWorks.length);

  // AI Floral Match Modal State & Form
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiStep, setAiStep] = useState(1);
  const [aiOccasion, setAiOccasion] = useState("Wedding");
  const [aiMood, setAiMood] = useState("Romantic & Dreamy");
  const [aiPalette, setAiPalette] = useState("Antique Ivory & Gold");
  const [aiBudget, setAiBudget] = useState("Luxury Bespoke");
  const [aiCalculating, setAiCalculating] = useState(false);
  const [aiResult, setAiResult] = useState(null);


  const handleRunAiMatch = () => {
    setAiCalculating(true);
    setTimeout(() => {
      setAiCalculating(false);
      setAiResult({
        name: `${aiOccasion} — The ${aiMood.split(" ")[0]} Botanical Suite`,
        palette: aiPalette,
        harmonyScore: "99.2% Aesthetic Harmony",
        flowers: [
          "English Garden Roses",
          "Hydrangea Alba",
          "Cascading Seeded Eucalyptus",
          "White Ranunculus",
          "Italian Ruscus",
        ],
        vibeSummary: `Tailored for a ${aiMood.toLowerCase()} atmosphere with warm ${aiPalette.toLowerCase()} accents, optimized for photography and ambient evening illumination.`,
        recommendedPackage: "Signature Bespoke Floral Experience",
      });
      setAiStep(3);
    }, 1200);
  };


  return (
    <div style={{ background: "#141E15", color: "#F6F4EE", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (ALORIGA ICONIC SPLIT LAYOUT) */}
      {/* ========================================================================= */}
      <section
        style={{
          position: "relative",
          minHeight: "92vh",
          display: "flex",
          alignItems: "center",
          padding: "3.5rem 1.5rem 5rem",
          background: "radial-gradient(ellipse at 70% 30%, #203023 0%, #141E15 70%, #0E160F 100%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* Subtle Botanical Ambient Grain */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.12,
            backgroundImage: "radial-gradient(#8EA990 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "1360px",
            margin: "0 auto",
            width: "100%",
            position: "relative",
            zIndex: 2,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "3.5rem",
            alignItems: "center",
          }}
        >
          {/* Left Column: Big Editorial Headline & CTA */}
          <div style={{ maxWidth: "620px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "rgba(95, 119, 97, 0.2)",
                border: "1px solid rgba(197, 160, 89, 0.35)",
                padding: "6px 16px",
                borderRadius: "9999px",
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#DFBF80",
                marginBottom: "1.8rem",
              }}
            >
              <span>Couture Botanical Studio & Intelligent Curation</span>
            </div>

            <h1
              style={{
                fontFamily: "'Cormorant Garamond', 'Italiana', Georgia, serif",
                fontSize: "clamp(3.4rem, 6.5vw, 5.8rem)",
                fontWeight: 500,
                lineHeight: 1.02,
                color: "#F7F5F0",
                letterSpacing: "-0.02em",
                marginBottom: "1.8rem",
              }}
            >
              Floral<br />
              Artistry<br />
              Passion<br />
              <span style={{ fontStyle: "italic", color: "#E0C283" }}>& AI Insight</span>
            </h1>

            <p
              style={{
                fontSize: "1.08rem",
                color: "#C2D1C4",
                lineHeight: 1.8,
                maxWidth: "540px",
                marginBottom: "2.6rem",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 400,
              }}
            >
              Transform your special moments into unforgettable celebrations. We create breathtaking wedding decor, luxury floral styling, and bespoke event setups tailored to perfection for your cherished occasions.
            </p>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
              <Link
                to="/contact"
                className="aloriga-pill-btn primary"
                style={{ padding: "14px 30px", fontSize: "0.85rem", textDecoration: "none" }}
              >
                <span>CONTACT US</span>
                <ArrowRight size={16} />
              </Link>

              <button
                onClick={() => setAiModalOpen(true)}
                className="aloriga-pill-btn outline"
                style={{
                  padding: "14px 26px",
                  fontSize: "0.85rem",
                  borderColor: "rgba(197, 160, 89, 0.4)",
                  background: "rgba(197, 160, 89, 0.08)",
                  color: "#E2C485",
                }}
              >
                <span>TRY AI FLORAL MATCH</span>
              </button>
            </div>

            {/* Micro Accolades Row */}
            <div
              style={{
                display: "flex",
                gap: "2.5rem",
                marginTop: "3.5rem",
                paddingTop: "2rem",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.8rem", fontWeight: 700, color: "#E0C283" }}>
                  1,200+
                </div>
                <div style={{ fontSize: "0.76rem", color: "#8EA990", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Bespoke Commissions
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.8rem", fontWeight: 700, color: "#E0C283" }}>
                  99.4%
                </div>
                <div style={{ fontSize: "0.76rem", color: "#8EA990", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Mood Harmony Score
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.8rem", fontWeight: 700, color: "#E0C283" }}>
                  2023–25
                </div>
                <div style={{ fontSize: "0.76rem", color: "#8EA990", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Design Excellence Awards
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Aloriga Hero Editorial Photo Composition */}
          <div style={{ position: "relative" }}>
            {/* Main Featured Photo Card */}
            <div
              style={{
                position: "relative",
                borderRadius: "28px",
                overflow: "hidden",
                boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(95, 119, 97, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                background: "#1E2A20",
                aspectRatio: "4/4.8",
                maxHeight: "580px",
              }}
            >
              <img
                src={heroCards[heroCardIndex].image}
                alt={heroCards[heroCardIndex].title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.8s ease",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(14, 22, 15, 0.9) 0%, rgba(14, 22, 15, 0.2) 50%, transparent 100%)",
                }}
              />

              {/* Overlaid Title & Category Pill */}
              <div
                style={{
                  position: "absolute",
                  top: "1.5rem",
                  left: "1.5rem",
                  background: "rgba(20, 30, 21, 0.75)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  padding: "8px 18px",
                  borderRadius: "9999px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#C5A059" }} />
                <span style={{ fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.06em", color: "#F7F5F0" }}>
                  {heroCards[heroCardIndex].accent}
                </span>
              </div>

              {/* Play / Story Preview Button */}
              <button
                onClick={() => navigate("/gallery")}
                title="View Gallery Reel"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "rgba(20, 30, 21, 0.85)",
                  border: "1px solid rgba(197, 160, 89, 0.6)",
                  color: "#DFBF80",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.1)";
                  e.currentTarget.style.borderColor = "#E2C485";
                  e.currentTarget.style.background = "#2D3E2E";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)";
                  e.currentTarget.style.borderColor = "rgba(197, 160, 89, 0.6)";
                  e.currentTarget.style.background = "rgba(20, 30, 21, 0.85)";
                }}
              >
                <Play size={24} fill="#DFBF80" style={{ marginLeft: "3px" }} />
              </button>

              {/* Bottom Card Title Details */}
              <div style={{ position: "absolute", bottom: "1.8rem", left: "2rem", right: "2rem" }}>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "2rem",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    marginBottom: "4px",
                  }}
                >
                  {heroCards[heroCardIndex].title}
                </h3>
                <div style={{ fontSize: "0.85rem", color: "#B4C2B6", letterSpacing: "0.04em" }}>
                  {heroCards[heroCardIndex].theme}
                </div>
              </div>
            </div>

            {/* Overlapping Secondary Card (Bridal Bouquet Detail) */}
            <div
              style={{
                position: "absolute",
                bottom: "-25px",
                right: "-20px",
                width: "160px",
                height: "160px",
                borderRadius: "22px",
                overflow: "hidden",
                border: "2px solid rgba(197, 160, 89, 0.5)",
                boxShadow: "0 15px 35px rgba(0,0,0,0.5)",
                display: "none",
              }}
              className="desktop-secondary-badge"
            >
              <img
                src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&q=80"
                alt="Floral detail"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Carousel Dots */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "1.5rem",
              }}
            >
              {heroCards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHeroCardIndex(i)}
                  style={{
                    width: i === heroCardIndex ? "28px" : "8px",
                    height: "8px",
                    borderRadius: "9999px",
                    background: i === heroCardIndex ? "#C5A059" : "rgba(255,255,255,0.25)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    padding: 0,
                  }}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. "DISCOVER YOUR PERFECT FLORAL MATCH WITH AI" BANNER (EXACT DRIBBBLE SHOT) */}
      {/* ========================================================================= */}
      <section style={{ padding: "3rem 1.5rem" }}>
        <div
          style={{
            maxWidth: "1140px",
            margin: "0 auto",
            borderRadius: "9999px",
            background: "linear-gradient(135deg, #1C2B1E 0%, #243627 50%, #1A271C 100%)",
            border: "1px solid rgba(197, 160, 89, 0.4)",
            padding: "1.8rem 2.8rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "2rem",
            flexWrap: "wrap",
            boxShadow: "0 15px 40px rgba(0,0,0,0.4), 0 0 30px rgba(95, 119, 97, 0.25)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Left Decorative Flower */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <span style={{ fontSize: "2.4rem", filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.3))" }}>🌸</span>
            <div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)",
                  fontWeight: 600,
                  color: "#FAF7F2",
                  margin: 0,
                  lineHeight: 1.15,
                }}
              >
                Discover Your Perfect Floral Match with AI
              </h2>
              <p style={{ margin: "4px 0 0", fontSize: "0.86rem", color: "#A8BCA9", letterSpacing: "0.02em" }}>
                Select your occasion, palette, or mood — our intelligent studio crafts your bespoke floral theme.
              </p>
            </div>
          </div>

          {/* Right Button & Right Flower */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <button
              onClick={() => setAiModalOpen(true)}
              className="aloriga-pill-btn gold"
              style={{ padding: "12px 28px", fontSize: "0.82rem", letterSpacing: "0.08em" }}
            >
              <span>TRY AI FLORAL MATCH</span>
            </button>
            <span style={{ fontSize: "2.4rem", filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.3))" }}>✿</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SIGNATURE FLORAL OFFERINGS (SERVICES GRID) */}
      {/* ========================================================================= */}
      <section style={{ padding: "5rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
          {/* Section Header */}
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div
              style={{
                fontSize: "0.74rem",
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                color: "#DFBF80",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              Curated Botanical Architecture
            </div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(2.4rem, 4vw, 3.5rem)",
                fontWeight: 600,
                color: "#FAF7F2",
                margin: "0 0 1rem",
              }}
            >
              Signature Floral Offerings
            </h2>
            <div style={{ width: "50px", height: "1px", background: "#C5A059", margin: "0 auto 1rem" }} />
            <p style={{ color: "#B4C2B6", maxWidth: "600px", margin: "0 auto", fontSize: "0.95rem" }}>
              Explore our core botanical suites, custom-tailored to transform venues into living poetry.
            </p>
          </div>

          {/* 4 Offerings Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2rem",
            }}
          >
            {offerings.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(item.link)}
                style={{
                  background: "#1C291D",
                  borderRadius: "24px",
                  overflow: "hidden",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  cursor: "pointer",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.borderColor = "rgba(197, 160, 89, 0.5)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.4), 0 0 25px rgba(197, 160, 89, 0.15)";
                  e.currentTarget.querySelector("img").style.transform = "scale(1.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.querySelector("img").style.transform = "scale(1)";
                }}
              >
                <div style={{ height: "240px", overflow: "hidden", position: "relative" }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.7s ease",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(20, 30, 21, 0.8) 0%, transparent 60%)",
                    }}
                  />
                </div>

                <div style={{ padding: "1.8rem", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: "1.65rem",
                      fontWeight: 600,
                      color: "#FAF7F2",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ color: "#A2B4A4", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "1.2rem", flexGrow: 1 }}>
                    {item.subtitle}
                  </p>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "1.2rem" }}>
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "0.7rem",
                          background: "rgba(95, 119, 97, 0.2)",
                          border: "1px solid rgba(142, 169, 144, 0.25)",
                          color: "#CFDEC3",
                          padding: "3px 10px",
                          borderRadius: "9999px",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      color: "#DFBF80",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    <span>EXPLORE SUITE</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FEATURED WORK (HANDCRAFTED DESIGNS THAT TELL A STORY) */}
      {/* ========================================================================= */}
      <section style={{ padding: "5rem 1.5rem 6rem", background: "#111A12", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
          {/* Header with Carousel Navigation Arrows */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: "3rem",
              flexWrap: "wrap",
              gap: "1.5rem",
            }}
          >
            <div>
              <div style={{ fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "#DFBF80", marginBottom: "0.4rem" }}>
                Curated Portfolio
              </div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(2.3rem, 4vw, 3.4rem)",
                  fontWeight: 600,
                  color: "#FAF7F2",
                  margin: 0,
                }}
              >
                Featured Work
              </h2>
              <p style={{ color: "#9DB0A0", fontSize: "0.95rem", margin: "6px 0 0" }}>
                Handcrafted Designs That Tell a Story
              </p>
            </div>

            {/* Prev / Next Arrows */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={prevWork}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#FAF7F2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#263628";
                  e.currentTarget.style.borderColor = "#C5A059";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                }}
                aria-label="Previous Project"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextWork}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#FAF7F2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#263628";
                  e.currentTarget.style.borderColor = "#C5A059";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                }}
                aria-label="Next Project"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Featured Work Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "2rem",
            }}
          >
            {featuredWorks.slice(workIndex, workIndex + 3).concat(
              featuredWorks.slice(0, Math.max(0, workIndex + 3 - featuredWorks.length))
            ).map((project, idx) => (
              <div
                key={`${project.id}-${idx}`}
                onClick={() => navigate("/gallery")}
                style={{
                  position: "relative",
                  borderRadius: "24px",
                  overflow: "hidden",
                  cursor: "pointer",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  background: "#182319",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.35)",
                  transition: "all 0.4s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.borderColor = "rgba(197, 160, 89, 0.4)";
                  e.currentTarget.querySelector("img").style.transform = "scale(1.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.querySelector("img").style.transform = "scale(1)";
                }}
              >
                <div style={{ height: "380px", overflow: "hidden", position: "relative" }}>
                  <img
                    src={project.image}
                    alt={project.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(14, 22, 15, 0.95) 0%, rgba(14, 22, 15, 0.25) 55%, transparent 100%)",
                    }}
                  />

                  {/* Overlaid Info */}
                  <div style={{ position: "absolute", bottom: "1.8rem", left: "1.8rem", right: "1.8rem" }}>
                    <div
                      style={{
                        fontSize: "0.72rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        color: "#DFBF80",
                        marginBottom: "4px",
                      }}
                    >
                      {project.category}
                    </div>
                    <h3
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: "1.85rem",
                        fontWeight: 600,
                        color: "#FAF7F2",
                        marginBottom: "6px",
                      }}
                    >
                      {project.title}
                    </h3>
                    <p style={{ fontSize: "0.82rem", color: "#B4C2B6", margin: 0, lineHeight: 1.5 }}>
                      {project.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. "LOVE IN EVERY PETAL" (EDITORIAL CREAM TESTIMONIAL SECTION) */}
      {/* ========================================================================= */}
      <section
        style={{
          padding: "6rem 1.5rem",
          background: "#FAF7F2",
          color: "#1C241D",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "4rem",
            alignItems: "center",
          }}
        >
          {/* Left Text: Heartfelt Testimonial */}
          <div>
            <div
              style={{
                fontSize: "0.74rem",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "#5F7761",
                fontWeight: 700,
                marginBottom: "0.6rem",
              }}
            >
              Client Reflections
            </div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(2.6rem, 4.5vw, 4rem)",
                fontWeight: 600,
                color: "#182219",
                lineHeight: 1.08,
                marginBottom: "2rem",
              }}
            >
              Love in Every Petal
            </h2>

            {/* Stars */}
            <div style={{ display: "flex", gap: "4px", color: "#C5A059", marginBottom: "1.5rem" }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="#C5A059" />
              ))}
            </div>

            <blockquote
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "1.45rem",
                lineHeight: 1.6,
                fontStyle: "italic",
                color: "#2C3B2E",
                margin: "0 0 2rem",
              }}
            >
              “Our wedding day was an absolute dream, and the flowers were a huge part of that. From the moment we shared our vision, the team truly understood our style and brought it to life with elegance and creativity. Every detail—from my bouquet to the ceremony arch and reception centerpieces—was breathtaking.”
            </blockquote>

            <div>
              <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#182219" }}>
                Jessica & Andrew Lara
              </div>
              <div style={{ fontSize: "0.85rem", color: "#6C7E6E", letterSpacing: "0.04em" }}>
                Tuscan Solarium Wedding • Lake Como Celebration
              </div>
            </div>

            <div style={{ marginTop: "2.5rem" }}>
              <button
                onClick={() => navigate("/reviews")}
                style={{
                  background: "transparent",
                  border: "1px solid #182219",
                  padding: "10px 24px",
                  borderRadius: "9999px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: "#182219",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#182219";
                  e.currentTarget.style.color = "#FAF7F2";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#182219";
                }}
              >
                <span>READ MORE REVIEWS</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Right Image: Couple Portrait in Floral Setting */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                borderRadius: "28px",
                overflow: "hidden",
                boxShadow: "0 25px 60px rgba(0,0,0,0.18)",
                aspectRatio: "4/5",
                border: "1px solid rgba(197, 160, 89, 0.3)",
                background: "#EBE5D8",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=95"
                alt="Jessica and Andrew Wedding Celebration"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              />
            </div>
            {/* Subtle botanical floral stamp */}
            <div
              style={{
                position: "absolute",
                bottom: "-20px",
                left: "-20px",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: "18px",
                padding: "16px 22px",
                boxShadow: "0 12px 35px rgba(0,0,0,0.12)",
                border: "1px solid rgba(197, 160, 89, 0.35)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "rgba(197, 160, 89, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Heart size={20} color="#C5A059" fill="#C5A059" />
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#182219", letterSpacing: "0.02em" }}>
                  Verified Client Commission
                </div>
                <div style={{ fontSize: "0.72rem", color: "#5E7162" }}>
                  Tuscan Solarium • October 2025
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FOUNDER SPOTLIGHT: "LUNA SAGE" (COUTURE ATELIER REDESIGN) */}
      {/* ========================================================================= */}
      <section
        style={{
          position: "relative",
          padding: "7rem 1.5rem",
          background: "linear-gradient(135deg, #111A12 0%, #172418 50%, #0E160F 100%)",
          color: "#FAF7F2",
          borderTop: "1px solid rgba(223, 191, 128, 0.2)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          overflow: "hidden",
        }}
      >
        {/* Subtle Ambient Glow */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "-5%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(197, 160, 89, 0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Top Pill Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(223, 191, 128, 0.12)",
              border: "1px solid rgba(223, 191, 128, 0.35)",
              padding: "7px 20px",
              borderRadius: "9999px",
              fontSize: "0.74rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#DFBF80",
              marginBottom: "1.5rem",
              boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
            }}
          >
            <Sparkles size={14} color="#DFBF80" />
            <span>The Visionary Behind Aloriga • Creative Director & Founder</span>
          </div>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(3.4rem, 6vw, 5.2rem)",
              fontWeight: 500,
              color: "#FAF7F2",
              margin: "0 0 1rem",
              lineHeight: 1.02,
              letterSpacing: "-0.01em",
            }}
          >
            Luna Sage
          </h2>

          <div
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(1.35rem, 2.2vw, 1.7rem)",
              fontStyle: "italic",
              color: "#DFBF80",
              marginBottom: "2rem",
              lineHeight: 1.4,
              maxWidth: "720px",
              margin: "0 auto 2rem",
            }}
          >
            “Designing stories in living petals, not just bouquets.”
          </div>

          <p
            style={{
              color: "#C6D4C8",
              fontSize: "1.06rem",
              lineHeight: 1.85,
              maxWidth: "780px",
              margin: "0 auto 1.2rem",
            }}
          >
            Luna believes true floral artistry is living architecture—poetic, emotional, and transcendent. By blending traditional European couture styling, Japanese Ikebana balance, and cutting-edge AI floral harmony insight, she curates celebrations that feel utterly magical.
          </p>

          <p
            style={{
              color: "#9DB3A0",
              fontSize: "0.95rem",
              lineHeight: 1.8,
              maxWidth: "760px",
              margin: "0 auto 3rem",
            }}
          >
            From historic châteaux in Provence to high-fashion galas across Tokyo and New York, Luna has shaped unforgettable botanical experiences for royalty, luxury Maisons, and discerning couples worldwide.
          </p>

          {/* 3 Metric Badges Centered */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
              maxWidth: "820px",
              margin: "0 auto 3.2rem",
              padding: "1.8rem 2rem",
              background: "rgba(255, 255, 255, 0.03)",
              borderRadius: "24px",
              border: "1px solid rgba(223, 191, 128, 0.2)",
              boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "2.2rem",
                  fontWeight: 600,
                  color: "#DFBF80",
                }}
              >
                14+
              </div>
              <div
                style={{
                  fontSize: "0.74rem",
                  color: "#A8BCA9",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginTop: "4px",
                }}
              >
                Years Haute Floristry
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "2.2rem",
                  fontWeight: 600,
                  color: "#DFBF80",
                }}
              >
                650+
              </div>
              <div
                style={{
                  fontSize: "0.74rem",
                  color: "#A8BCA9",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginTop: "4px",
                }}
              >
                Bespoke Galas & Weddings
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "2.2rem",
                  fontWeight: 600,
                  color: "#DFBF80",
                }}
              >
                4
              </div>
              <div
                style={{
                  fontSize: "0.74rem",
                  color: "#A8BCA9",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginTop: "4px",
                }}
              >
                Continents Installed
              </div>
            </div>
          </div>

          {/* Action Buttons Centered */}
          <div
            style={{
              display: "flex",
              gap: "1.2rem",
              justifyContent: "center",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <button
              onClick={() => navigate("/about")}
              className="aloriga-pill-btn gold"
              style={{
                padding: "15px 36px",
                fontSize: "0.84rem",
                letterSpacing: "0.1em",
              }}
            >
              <span>DISCOVER LUNA'S STORY</span>
              <ArrowRight size={15} />
            </button>

            <button
              onClick={() => navigate("/contact")}
              style={{
                background: "transparent",
                color: "#FAF7F2",
                border: "1px solid rgba(223, 191, 128, 0.35)",
                padding: "14px 28px",
                borderRadius: "9999px",
                fontSize: "0.82rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#DFBF80";
                e.currentTarget.style.color = "#DFBF80";
                e.currentTarget.style.background = "rgba(223, 191, 128, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(223, 191, 128, 0.35)";
                e.currentTarget.style.color = "#FAF7F2";
                e.currentTarget.style.background = "transparent";
              }}
            >
              Consult With Luna
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. LIVING BOTANICAL GALLERY & MOTION CHRONICLES (ANIMATED SHOWCASE) */}
      {/* ========================================================================= */}
      <section
        style={{
          position: "relative",
          padding: "6.5rem 1.5rem 7rem",
          background: "linear-gradient(180deg, #0B120C 0%, #131F14 40%, #172718 70%, #0B120C 100%)",
          color: "#FAF7F2",
          borderTop: "1px solid rgba(223, 191, 128, 0.25)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          overflow: "hidden",
        }}
      >
        {/* Ambient Glow Orbs */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "5%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(197, 160, 89, 0.09) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            right: "5%",
            width: "550px",
            height: "550px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(95, 119, 97, 0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: "1360px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          {/* Section Header */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(223, 191, 128, 0.12)",
                border: "1px solid rgba(223, 191, 128, 0.35)",
                padding: "6px 18px",
                borderRadius: "9999px",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#DFBF80",
                marginBottom: "0.8rem",
              }}
            >
              <Sparkles size={13} color="#DFBF80" />
              <span>Living Visual Archives & Motion</span>
            </div>

            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
                fontWeight: 600,
                color: "#FAF7F2",
                margin: "0 0 0.8rem",
                lineHeight: 1.12,
              }}
            >
              Immersive Moments & Botanical Chronicles
            </h2>
            <div style={{ width: "60px", height: "1.5px", background: "#C5A059", margin: "0 auto 1.2rem" }} />
            <p style={{ color: "#B4C2B6", maxWidth: "660px", margin: "0 auto", fontSize: "0.96rem", lineHeight: 1.65 }}>
              Glide through our handcrafted floral architecture in continuous motion — from regal palace mandaps to sunlit conservatory vows and editorial runways.
            </p>

            {/* Filter Pills */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                flexWrap: "wrap",
                marginTop: "2rem",
              }}
            >
              {[
                { id: "ALL", label: "All Chronicles" },
                { id: "Royal Weddings", label: "Royal Weddings" },
                { id: "Luxury Receptions", label: "Luxury Receptions" },
                { id: "Floral Mandaps", label: "Floral Mandaps" },
                { id: "Banquets & Galas", label: "Banquets & Galas" },
                { id: "Editorial & Runways", label: "Editorial & Runways" },
              ].map((filter) => {
                const isActive = galleryFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    onClick={() => {
                      setGalleryFilter(filter.id);
                      if (filter.id !== "ALL") {
                        const idx = homeGalleryShowcase.findIndex((g) => g.category === filter.id);
                        if (idx !== -1) setActiveGalleryIndex(idx);
                      }
                    }}
                    style={{
                      padding: "8px 18px",
                      borderRadius: "9999px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      transition: "all 0.25s ease",
                      border: isActive ? "1px solid #DFBF80" : "1px solid rgba(255, 255, 255, 0.1)",
                      background: isActive ? "rgba(223, 191, 128, 0.22)" : "rgba(255, 255, 255, 0.04)",
                      color: isActive ? "#DFBF80" : "#B4C2B6",
                      boxShadow: isActive ? "0 4px 20px rgba(197, 160, 89, 0.25)" : "none",
                    }}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* MAIN CINEMATIC TRANSITION STAGE */}
          {(() => {
            const currentItem = homeGalleryShowcase[activeGalleryIndex];
            return (
              <div
                style={{
                  background: "#141F15",
                  borderRadius: "28px",
                  overflow: "hidden",
                  border: "1px solid rgba(223, 191, 128, 0.35)",
                  boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6), 0 0 35px rgba(197, 160, 89, 0.15)",
                  marginBottom: "4.5rem",
                }}
              >
                {/* Progress bar timer */}
                <div style={{ height: "3px", width: "100%", background: "rgba(255, 255, 255, 0.08)", position: "relative", overflow: "hidden" }}>
                  <div
                    key={activeGalleryIndex}
                    style={{
                      height: "100%",
                      background: "linear-gradient(90deg, #C5A059, #DFBF80)",
                      width: galleryIsPlaying ? "100%" : "0%",
                      transition: galleryIsPlaying ? "width 5s linear" : "none",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                    minHeight: "500px",
                  }}
                >
                  {/* Left: Animated Photo Frame with Ken-Burns Transition */}
                  <div
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      minHeight: "420px",
                      cursor: "pointer",
                    }}
                    onClick={() => setHomeLightbox(currentItem)}
                  >
                    <img
                      key={currentItem.id}
                      src={currentItem.image}
                      alt={currentItem.title}
                      className="ken-burns-active"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        transition: "opacity 0.7s ease, transform 12s ease",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(14, 22, 15, 0.85) 0%, rgba(14, 22, 15, 0.2) 60%, transparent 100%)",
                      }}
                    />

                    {/* Top Bar Controls Inside Photo */}
                    <div
                      style={{
                        position: "absolute",
                        top: "1.2rem",
                        left: "1.2rem",
                        right: "1.2rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        zIndex: 3,
                      }}
                    >
                      <span
                        style={{
                          background: "rgba(14, 22, 15, 0.75)",
                          backdropFilter: "blur(12px)",
                          border: "1px solid rgba(223, 191, 128, 0.4)",
                          color: "#DFBF80",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          padding: "5px 14px",
                          borderRadius: "9999px",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        {currentItem.accent} • {currentItem.location}
                      </span>

                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setGalleryIsPlaying(!galleryIsPlaying);
                          }}
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            background: "rgba(14, 22, 15, 0.75)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            color: "#FAF7F2",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          title={galleryIsPlaying ? "Pause Transition" : "Play Transition"}
                        >
                          {galleryIsPlaying ? <Pause size={14} /> : <Play size={14} fill="#FAF7F2" />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setHomeLightbox(currentItem);
                          }}
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            background: "rgba(14, 22, 15, 0.75)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            color: "#FAF7F2",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          title="Fullscreen Lightbox"
                        >
                          <Maximize2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Bottom Indicator on Mobile */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "1.2rem",
                        left: "1.2rem",
                        zIndex: 3,
                        color: "#DFBF80",
                        fontSize: "0.74rem",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Eye size={14} />
                      <span>Click photo to expand high-res</span>
                    </div>
                  </div>

                  {/* Right: Details & Interactive Thumbnail Palette */}
                  <div
                    style={{
                      padding: "2.5rem",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      background: "rgba(22, 33, 23, 0.95)",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "0.74rem",
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: "#DFBF80",
                          fontWeight: 700,
                          marginBottom: "0.5rem",
                        }}
                      >
                        {currentItem.category}
                      </div>

                      <h3
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: "clamp(1.9rem, 3vw, 2.5rem)",
                          fontWeight: 600,
                          color: "#FAF7F2",
                          margin: "0 0 0.8rem",
                          lineHeight: 1.15,
                        }}
                      >
                        {currentItem.title}
                      </h3>

                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: "#DFBF80",
                          fontWeight: 600,
                          marginBottom: "1rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#C5A059" }} />
                        <span>Theme: {currentItem.theme}</span>
                      </div>

                      <p
                        style={{
                          color: "#B4C2B6",
                          fontSize: "0.92rem",
                          lineHeight: 1.65,
                          marginBottom: "1.5rem",
                        }}
                      >
                        {currentItem.description}
                      </p>

                      {/* Navigation Chevrons & Slide Counter */}
                      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "2rem" }}>
                        <button
                          onClick={prevGallerySlide}
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "50%",
                            background: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(223, 191, 128, 0.3)",
                            color: "#FAF7F2",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#2D3F2E";
                            e.currentTarget.style.borderColor = "#DFBF80";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                            e.currentTarget.style.borderColor = "rgba(223, 191, 128, 0.3)";
                          }}
                        >
                          <ChevronLeft size={18} />
                        </button>

                        <span style={{ fontSize: "0.85rem", color: "#DFBF80", fontWeight: 700, letterSpacing: "0.1em" }}>
                          0{activeGalleryIndex + 1} / 0{homeGalleryShowcase.length}
                        </span>

                        <button
                          onClick={nextGallerySlide}
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "50%",
                            background: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(223, 191, 128, 0.3)",
                            color: "#FAF7F2",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#2D3F2E";
                            e.currentTarget.style.borderColor = "#DFBF80";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                            e.currentTarget.style.borderColor = "rgba(223, 191, 128, 0.3)";
                          }}
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Interactive Thumbnail Selector Track */}
                    <div>
                      <div
                        style={{
                          fontSize: "0.72rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                          color: "#8EA990",
                          fontWeight: 600,
                          marginBottom: "8px",
                        }}
                      >
                        Select Story to Transition:
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(6, 1fr)",
                          gap: "8px",
                        }}
                      >
                        {homeGalleryShowcase.map((g, idx) => {
                          const isCur = idx === activeGalleryIndex;
                          return (
                            <div
                              key={g.id}
                              onClick={() => setActiveGalleryIndex(idx)}
                              style={{
                                height: "54px",
                                borderRadius: "10px",
                                overflow: "hidden",
                                cursor: "pointer",
                                border: isCur ? "2px solid #DFBF80" : "1px solid rgba(255, 255, 255, 0.15)",
                                opacity: isCur ? 1 : 0.55,
                                transform: isCur ? "scale(1.05)" : "scale(1)",
                                transition: "all 0.25s ease",
                                boxShadow: isCur ? "0 4px 15px rgba(197, 160, 89, 0.35)" : "none",
                              }}
                              onMouseEnter={(e) => {
                                if (!isCur) e.currentTarget.style.opacity = "0.9";
                              }}
                              onMouseLeave={(e) => {
                                if (!isCur) e.currentTarget.style.opacity = "0.55";
                              }}
                            >
                              <img
                                src={g.image}
                                alt={g.title}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* DUAL CONTINUOUS MOVING MARQUEE RIBBON */}
          <div style={{ marginBottom: "3.5rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.2rem",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "0.72rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#DFBF80",
                    fontWeight: 700,
                  }}
                >
                  Continuous Atelier Stream
                </span>
                <h4
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "1.5rem",
                    color: "#FAF7F2",
                    margin: "2px 0 0",
                  }}
                >
                  Live Visual Flow (Hover to Pause & Zoom)
                </h4>
              </div>

              <span style={{ fontSize: "0.78rem", color: "#8EA990" }}>
                Hover any card to inspect botanical details
              </span>
            </div>

            {/* Track 1: Gliding Left */}
            <div
              className="gallery-marquee-track"
              style={{
                overflow: "hidden",
                maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
                WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
                marginBottom: "1.2rem",
              }}
            >
              <div className="gallery-marquee-left" style={{ gap: "1.2rem" }}>
                {[...marqueeImagesRow1, ...marqueeImagesRow1].map((item, index) => (
                  <div
                    key={`row1-${index}`}
                    onClick={() => setHomeLightbox(item)}
                    style={{
                      width: "280px",
                      height: "190px",
                      borderRadius: "18px",
                      overflow: "hidden",
                      position: "relative",
                      flexShrink: 0,
                      cursor: "pointer",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      background: "#182419",
                      transition: "transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.04) translateY(-4px)";
                      e.currentTarget.style.borderColor = "#DFBF80";
                      e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.5), 0 0 20px rgba(197, 160, 89, 0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1) translateY(0)";
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(14, 22, 15, 0.9) 0%, transparent 70%)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "12px",
                        left: "14px",
                        right: "14px",
                        zIndex: 2,
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.64rem",
                          color: "#DFBF80",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          fontWeight: 700,
                        }}
                      >
                        {item.tag}
                      </span>
                      <div
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 700,
                          color: "#FAF7F2",
                          marginTop: "2px",
                        }}
                      >
                        {item.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Track 2: Gliding Right */}
            <div
              className="gallery-marquee-track"
              style={{
                overflow: "hidden",
                maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
                WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
              }}
            >
              <div className="gallery-marquee-right" style={{ gap: "1.2rem" }}>
                {[...marqueeImagesRow2, ...marqueeImagesRow2].map((item, index) => (
                  <div
                    key={`row2-${index}`}
                    onClick={() => setHomeLightbox(item)}
                    style={{
                      width: "280px",
                      height: "190px",
                      borderRadius: "18px",
                      overflow: "hidden",
                      position: "relative",
                      flexShrink: 0,
                      cursor: "pointer",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      background: "#182419",
                      transition: "transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.04) translateY(-4px)";
                      e.currentTarget.style.borderColor = "#DFBF80";
                      e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.5), 0 0 20px rgba(197, 160, 89, 0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1) translateY(0)";
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(14, 22, 15, 0.9) 0%, transparent 70%)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "12px",
                        left: "14px",
                        right: "14px",
                        zIndex: 2,
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.64rem",
                          color: "#DFBF80",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          fontWeight: 700,
                        }}
                      >
                        {item.tag}
                      </span>
                      <div
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 700,
                          color: "#FAF7F2",
                          marginTop: "2px",
                        }}
                      >
                        {item.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Callout Bar */}
          <div
            style={{
              textAlign: "center",
              background: "rgba(223, 191, 128, 0.05)",
              border: "1px solid rgba(223, 191, 128, 0.25)",
              borderRadius: "20px",
              padding: "2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1.5rem",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "1.2rem", fontFamily: "'Cormorant Garamond', Georgia, serif", color: "#FAF7F2", fontWeight: 700 }}>
                Looking for a specific theme or floral installation?
              </div>
              <div style={{ fontSize: "0.85rem", color: "#A8BCA9", marginTop: "3px" }}>
                Browse our complete full-screen visual library with over 50+ bespoke wedding and gala designs.
              </div>
            </div>

            <button
              onClick={() => navigate("/gallery")}
              className="aloriga-pill-btn gold"
              style={{ padding: "14px 30px", fontSize: "0.82rem" }}
            >
              <span>EXPLORE FULL GALLERY</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. ALORIGA LUXURY EDITORIAL FOOTER */}
      {/* ========================================================================= */}
      <footer
        style={{
          background: "#FAF7F2",
          color: "#1C241D",
          padding: "5rem 1.5rem 3rem",
          borderTop: "1px solid #E5DFD1",
        }}
      >
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "3rem",
              marginBottom: "4rem",
            }}
          >
            {/* Brand Column */}
            <div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "2.4rem",
                  fontWeight: 600,
                  color: "#182219",
                  marginBottom: "0.8rem",
                }}
              >
                aloriga
              </div>
              <p style={{ fontSize: "0.88rem", color: "#637465", lineHeight: 1.7, maxWidth: "280px" }}>
                Bespoke floral architecture, bridal scenography & intelligent mood curation.
              </p>
              <div style={{ marginTop: "1.2rem", fontSize: "0.82rem", color: "#7F9181" }}>
                New York • Paris • Milan • London
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.2rem", color: "#182219" }}>
                Atelier
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.88rem" }}>
                <span onClick={() => navigate("/gallery")} style={{ cursor: "pointer", color: "#546456" }}>WORK</span>
                <span onClick={() => navigate("/services")} style={{ cursor: "pointer", color: "#546456" }}>SERVICES</span>
                <span onClick={() => navigate("/packages")} style={{ cursor: "pointer", color: "#546456" }}>PACKAGES</span>
                <span onClick={() => navigate("/about")} style={{ cursor: "pointer", color: "#546456" }}>ABOUT LUNA</span>
                <span onClick={() => navigate("/reviews")} style={{ cursor: "pointer", color: "#546456" }}>REVIEWS</span>
              </div>
            </div>

            {/* Offerings Links */}
            <div>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.2rem", color: "#182219" }}>
                Offerings
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.88rem" }}>
                <span onClick={() => navigate("/categories")} style={{ cursor: "pointer", color: "#546456" }}>WEDDINGS</span>
                <span onClick={() => navigate("/categories")} style={{ cursor: "pointer", color: "#546456" }}>CORPORATE EVENTS</span>
                <span onClick={() => navigate("/categories")} style={{ cursor: "pointer", color: "#546456" }}>PRIVATE SOIRÉES</span>
                <span onClick={() => navigate("/services")} style={{ cursor: "pointer", color: "#546456" }}>FLORAL INSTALLATIONS</span>
              </div>
            </div>

            {/* Newsletter Column */}
            <div>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.2rem", color: "#182219" }}>
                The Botanical Circle
              </div>
              <p style={{ fontSize: "0.85rem", color: "#637465", lineHeight: 1.6, marginBottom: "1rem" }}>
                Receive private invitations to seasonal floral previews and interior botanical journals.
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #D5CEBE",
                    borderRadius: "9999px",
                    padding: "10px 16px",
                    fontSize: "0.85rem",
                    outline: "none",
                    width: "100%",
                  }}
                />
                <button
                  style={{
                    background: "#182219",
                    color: "#FAF7F2",
                    border: "none",
                    borderRadius: "9999px",
                    padding: "10px 18px",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  JOIN
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div
            style={{
              paddingTop: "2rem",
              borderTop: "1px solid #E5DFD1",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.78rem",
              color: "#839485",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              © 2026 Aloriga Floral Studio. All rights reserved.
            </div>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              <span style={{ cursor: "pointer" }}>INSTAGRAM</span>
              <span style={{ cursor: "pointer" }}>PINTEREST</span>
              <span style={{ cursor: "pointer" }}>TWITTER</span>
              <span style={{ cursor: "pointer" }}>VOGUE RUNWAY</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 8. INTERACTIVE AI FLORAL MATCH MODAL / STUDIO */}
      {/* ========================================================================= */}
      {aiModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 16, 11, 0.85)",
            backdropFilter: "blur(16px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              background: "#1C291D",
              borderRadius: "28px",
              border: "1px solid rgba(197, 160, 89, 0.4)",
              maxWidth: "680px",
              width: "100%",
              padding: "2.5rem",
              position: "relative",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8), 0 0 50px rgba(197, 160, 89, 0.2)",
              color: "#F6F4EE",
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setAiModalOpen(false);
                setAiStep(1);
                setAiResult(null);
              }}
              style={{
                position: "absolute",
                top: "1.5rem",
                right: "1.5rem",
                background: "rgba(255, 255, 255, 0.08)",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#F6F4EE",
                cursor: "pointer",
              }}
            >
              <X size={18} />
            </button>

            {/* Modal Title */}
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div
                style={{
                  fontSize: "0.72rem",
                  letterSpacing: "0.12em",
                  color: "#DFBF80",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  marginBottom: "6px",
                }}
              >
                <span>Aloriga AI Studio</span>
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "2.2rem", margin: 0 }}>
                {aiStep === 3 ? "Your Tailored Floral Match" : "Discover Your Perfect Floral Match"}
              </h3>
            </div>

            {/* Step 1: Occasion & Mood */}
            {aiStep === 1 && (
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#A8BCA9", marginBottom: "8px" }}>
                  1. Select Occasion
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "8px", marginBottom: "1.5rem" }}>
                  {["Wedding", "Corporate Event", "Private Soirée", "Installation", "Milestone Gala"].map((occ) => (
                    <button
                      key={occ}
                      onClick={() => setAiOccasion(occ)}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "12px",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        background: aiOccasion === occ ? "rgba(197, 160, 89, 0.25)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${aiOccasion === occ ? "#C5A059" : "rgba(255,255,255,0.1)"}`,
                        color: aiOccasion === occ ? "#DFBF80" : "#B4C2B6",
                      }}
                    >
                      {occ}
                    </button>
                  ))}
                </div>

                <label style={{ display: "block", fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#A8BCA9", marginBottom: "8px" }}>
                  2. Desired Mood & Atmosphere
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "8px", marginBottom: "2rem" }}>
                  {[
                    "Romantic & Dreamy",
                    "Bold & Dramatic",
                    "Calm & Botanical",
                    "High Fashion Editorial",
                    "Royal Baroque",
                  ].map((m) => (
                    <button
                      key={m}
                      onClick={() => setAiMood(m)}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "12px",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        background: aiMood === m ? "rgba(197, 160, 89, 0.25)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${aiMood === m ? "#C5A059" : "rgba(255,255,255,0.1)"}`,
                        color: aiMood === m ? "#DFBF80" : "#B4C2B6",
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setAiStep(2)}
                  className="aloriga-pill-btn gold"
                  style={{ width: "100%", padding: "12px" }}
                >
                  <span>NEXT: COLOR & BUDGET</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            )}

            {/* Step 2: Palette & Budget */}
            {aiStep === 2 && (
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#A8BCA9", marginBottom: "8px" }}>
                  3. Color Palette Direction
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "8px", marginBottom: "1.5rem" }}>
                  {[
                    "Antique Ivory & Gold",
                    "Dusty Blush & English Rose",
                    "Deep Emerald & Velvet Forest",
                    "Terracotta & Sunset Amber",
                  ].map((pal) => (
                    <button
                      key={pal}
                      onClick={() => setAiPalette(pal)}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "12px",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        background: aiPalette === pal ? "rgba(197, 160, 89, 0.25)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${aiPalette === pal ? "#C5A059" : "rgba(255,255,255,0.1)"}`,
                        color: aiPalette === pal ? "#DFBF80" : "#B4C2B6",
                      }}
                    >
                      {pal}
                    </button>
                  ))}
                </div>

                <label style={{ display: "block", fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#A8BCA9", marginBottom: "8px" }}>
                  4. Budget Tier
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "8px", marginBottom: "2rem" }}>
                  {["Atelier Boutique", "Luxury Bespoke", "Couture Gala Scale"].map((b) => (
                    <button
                      key={b}
                      onClick={() => setAiBudget(b)}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "12px",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        background: aiBudget === b ? "rgba(197, 160, 89, 0.25)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${aiBudget === b ? "#C5A059" : "rgba(255,255,255,0.1)"}`,
                        color: aiBudget === b ? "#DFBF80" : "#B4C2B6",
                      }}
                    >
                      {b}
                    </button>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => setAiStep(1)}
                    className="aloriga-pill-btn outline"
                    style={{ flex: 1, padding: "12px" }}
                  >
                    BACK
                  </button>
                  <button
                    onClick={handleRunAiMatch}
                    disabled={aiCalculating}
                    className="aloriga-pill-btn gold"
                    style={{ flex: 2, padding: "12px" }}
                  >
                    {aiCalculating ? (
                      <span>GENERATING AI BOTANICAL SUITE...</span>
                    ) : (
                      <span>ANALYZE & GENERATE MATCH</span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: AI Recommendation Result */}
            {aiStep === 3 && aiResult && (
              <div>
                <div
                  style={{
                    background: "rgba(35, 50, 36, 0.7)",
                    borderRadius: "18px",
                    border: "1px solid rgba(197, 160, 89, 0.4)",
                    padding: "1.8rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "#DFBF80", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
                      RECOMMENDED BOTANICAL CONCEPT
                    </span>
                    <span
                      style={{
                        background: "rgba(52, 211, 153, 0.15)",
                        border: "1px solid rgba(52, 211, 153, 0.3)",
                        color: "#34D399",
                        padding: "3px 10px",
                        borderRadius: "9999px",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                      }}
                    >
                      {aiResult.harmonyScore}
                    </span>
                  </div>

                  <h4 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.8rem", color: "#FFFFFF", margin: "0 0 8px" }}>
                    {aiResult.name}
                  </h4>
                  <p style={{ color: "#B4C2B6", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "1rem" }}>
                    {aiResult.vibeSummary}
                  </p>

                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1rem" }}>
                    <div style={{ fontSize: "0.75rem", color: "#8EA990", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                      Curated Florals Included:
                    </div>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {aiResult.flowers.map((f) => (
                        <span
                          key={f}
                          style={{
                            background: "rgba(197, 160, 89, 0.12)",
                            border: "1px solid rgba(197, 160, 89, 0.25)",
                            color: "#E2C485",
                            padding: "4px 10px",
                            borderRadius: "9999px",
                            fontSize: "0.74rem",
                          }}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => {
                      setAiStep(1);
                      setAiResult(null);
                    }}
                    className="aloriga-pill-btn outline"
                    style={{ flex: 1, padding: "12px" }}
                  >
                    TRY AGAIN
                  </button>
                  <button
                    onClick={() => {
                      setAiModalOpen(false);
                      navigate("/packages");
                    }}
                    className="aloriga-pill-btn gold"
                    style={{ flex: 2, padding: "12px" }}
                  >
                    <span>BOOK THIS BOTANICAL SUITE</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Home Gallery Lightbox Modal */}
      {homeLightbox && (
        <div
          onClick={() => setHomeLightbox(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(8, 14, 9, 0.94)",
            backdropFilter: "blur(20px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "920px",
              width: "100%",
              background: "#162317",
              borderRadius: "24px",
              overflow: "hidden",
              border: "1px solid rgba(223, 191, 128, 0.4)",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8)",
              position: "relative",
              animation: "fadeInScaleUp 0.3s ease",
            }}
          >
            <button
              onClick={() => setHomeLightbox(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "rgba(0, 0, 0, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#FAF7F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10,
              }}
            >
              <X size={18} />
            </button>

            <div style={{ maxHeight: "68vh", overflow: "hidden", background: "#0D160E" }}>
              <img
                src={homeLightbox.image || homeLightbox.img}
                alt={homeLightbox.title}
                style={{ width: "100%", height: "100%", maxHeight: "68vh", objectFit: "contain", display: "block", margin: "0 auto" }}
              />
            </div>

            <div style={{ padding: "1.6rem 2rem", background: "#162317" }}>
              <span style={{ fontSize: "0.72rem", color: "#DFBF80", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
                {homeLightbox.category || homeLightbox.tag || "Bespoke Installation"}
              </span>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.6rem", color: "#FAF7F2", margin: "4px 0 8px" }}>
                {homeLightbox.title}
              </h3>
              <p style={{ color: "#A8BCA9", fontSize: "0.88rem", lineHeight: 1.5, margin: 0 }}>
                {homeLightbox.description || homeLightbox.desc || "Curated botanical commission handcrafted for bespoke celebrations."}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;