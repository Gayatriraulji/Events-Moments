import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Sparkles, CheckCircle, ChevronRight, Star, Plus, Check, ArrowRight, Layers, ShoppingBag } from "lucide-react";

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

const availableServicesCatalog = [
  {
    id: "srv-1",
    name: "Grand Ceremony Floral Arch",
    price: 25000,
    category: "Ceremony & Stage",
    description: "Cascading bridal archway with white garden roses, hydrangeas, and trailing eucalyptus.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
  },
  {
    id: "srv-2",
    name: "Couture Bridal Bouquet & Boutonnières",
    price: 12000,
    category: "Bridal Suite",
    description: "Handcrafted English gardenia and blush peony bouquet wrapped in imported French silk.",
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&q=80",
  },
  {
    id: "srv-3",
    name: "Aisle Petal Pathway & Glass Lanterns",
    price: 18000,
    category: "Ceremony & Stage",
    description: "Thick ombre rose petal runner bordered by 24 warm candlelit glass hurricane lanterns.",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80",
  },
  {
    id: "srv-4",
    name: "Luxury Reception Tablescapes (Set of 8)",
    price: 24000,
    category: "Dining & Tables",
    description: "Elevated candelabra floral bowls and botanical low runners with aromatic greenery.",
    image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&q=80",
  },
  {
    id: "srv-5",
    name: "Enchanted Mandap / Botanical Canopy",
    price: 45000,
    category: "Ceremony & Stage",
    description: "Four-pillar architectural floral pavilion with hanging wisteria and 2,500 fresh stems.",
    image: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=600&q=80",
  },
  {
    id: "srv-6",
    name: "Welcome Floral Wall & Photo Moment",
    price: 20000,
    category: "Entry & Lounge",
    description: "8ft x 8ft immersive 3D botanical backdrop with personalized gold calligraphy signage.",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80",
  },
  {
    id: "srv-7",
    name: "Cocktail Lounge & Bar Florals",
    price: 15000,
    category: "Entry & Lounge",
    description: "Exotic anthuriums, monstera leaves, and amber glowing tabletop florals for bar and high-tops.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80",
  },
  {
    id: "srv-8",
    name: "Suspended Ceiling Chandelier & Lighting",
    price: 32000,
    category: "Scenography",
    description: "Overhead botanical rings draped in fairy string illuminations and trailing foliage.",
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&q=80",
  },
  {
    id: "srv-9",
    name: "VIP Solarium Table Styling & Menus",
    price: 16000,
    category: "Dining & Tables",
    description: "Velvet runners, brass cutlery stem ties, botanical menu cards, and bespoke votives.",
    image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600&q=80",
  },
  {
    id: "srv-10",
    name: "Stage Scenography & Uplighting Suite",
    price: 28000,
    category: "Scenography",
    description: "Architectural warm wash lights, floor floral meadows, and dynamic backdrop accents.",
    image: "https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=600&q=80",
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

  // Custom Package Builder State
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customEventName, setCustomEventName] = useState("");
  const [customTier, setCustomTier] = useState("luxury");
  const [selectedServices, setSelectedServices] = useState([]);
  const [customNotes, setCustomNotes] = useState("");
  const [creatingCustom, setCreatingCustom] = useState(false);
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState("All");
  const [availableServices, setAvailableServices] = useState(availableServicesCatalog);

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

  useEffect(() => {
    fetchPackages();

    // Fetch dynamic categories/services from database to merge into catalog
    const fetchDynamicServices = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const response = await res.json();
        if (res.ok && response.data && response.data.length > 0) {
          const dbServices = response.data.map((cat) => ({
            id: cat._id,
            name: cat.name,
            price: cat.price || 20000,
            category: "Bespoke Collection",
            description: cat.description || "Curated floral decor service.",
            image: cat.image ? (cat.image.startsWith("http") ? cat.image : `${SERVER_URL}${cat.image}`) : "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
          }));
          // Combine unique services
          setAvailableServices((prev) => {
            const existingNames = new Set(prev.map((s) => s.name.toLowerCase()));
            const newOnes = dbServices.filter((s) => !existingNames.has(s.name.toLowerCase()));
            return [...prev, ...newOnes];
          });
        }
      } catch (err) {
        // use default catalog
      }
    };
    fetchDynamicServices();
  }, [API_URL, SERVER_URL]);

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pkg.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const price = pkg.price || 0;
    const matchesMin = minPrice === "" || price >= Number(minPrice);
    const matchesMax = maxPrice === "" || price <= Number(maxPrice);
    return matchesSearch && matchesMin && matchesMax;
  });

  // Calculate Total Price of Selected Services
  const customTotalPrice = selectedServices.reduce((sum, s) => sum + (Number(s.price) || 0), 0);

  const handleToggleService = (service) => {
    const exists = selectedServices.some((s) => s.id === service.id || (s.name === service.name));
    if (exists) {
      setSelectedServices((prev) => prev.filter((s) => s.id !== service.id && s.name !== service.name));
    } else {
      setSelectedServices((prev) => [...prev, service]);
    }
  };

  const handleCreateAndOrderCustomPackage = async (e) => {
    e.preventDefault();
    if (!customEventName.trim()) {
      alert("Please write your Event or Package Name.");
      return;
    }
    if (selectedServices.length === 0) {
      alert("Please select at least 1 service to build your custom package.");
      return;
    }

    setCreatingCustom(true);
    try {
      const inclusionsList = selectedServices.map((s) => s.name);
      const chosenImage = selectedServices[0]?.image || "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80";

      const payload = {
        name: customEventName.trim(),
        description:
          customNotes.trim() ||
          `Bespoke custom package crafted with ${selectedServices.length} selected services: ${inclusionsList.join(", ")}.`,
        price: customTotalPrice,
        tier: customTier,
        inclusions: inclusionsList,
        image: chosenImage,
      };

      const res = await fetch(`${API_URL}/packages/custom`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const response = await res.json();

      if (res.ok && response.data) {
        const createdPkg = response.data;
        setPackages((prev) => [createdPkg, ...prev]);
        setCustomModalOpen(false);
        setCustomEventName("");
        setSelectedServices([]);
        setCustomNotes("");
        // Immediately navigate to order/booking flow for this custom package
        navigate(`/packages/${createdPkg._id}`);
      } else {
        // Fallback local package creation
        const localPkg = {
          _id: "custom-" + Date.now(),
          ...payload,
          features: inclusionsList,
        };
        setPackages((prev) => [localPkg, ...prev]);
        setCustomModalOpen(false);
        navigate(`/packages/${localPkg._id}`);
      }
    } catch (err) {
      const inclusionsList = selectedServices.map((s) => s.name);
      const localPkg = {
        _id: "custom-" + Date.now(),
        name: customEventName.trim(),
        description: customNotes.trim() || `Custom package with ${selectedServices.length} services.`,
        price: customTotalPrice,
        tier: customTier,
        inclusions: inclusionsList,
        features: inclusionsList,
        image: selectedServices[0]?.image || "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
      };
      setPackages((prev) => [localPkg, ...prev]);
      setCustomModalOpen(false);
      navigate(`/packages/${localPkg._id}`);
    } finally {
      setCreatingCustom(false);
    }
  };

  const categoriesSet = ["All", ...new Set(availableServices.map((s) => s.category).filter(Boolean))];

  const filteredServicesList = availableServices.filter((s) => {
    if (serviceCategoryFilter === "All") return true;
    return s.category === serviceCategoryFilter;
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

      {/* Search & Price Filter + Create Own Package Button */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "880px",
          margin: "0 auto 3.5rem",
        }}
      >
        <div style={{ position: "relative", flex: "1 1 220px" }}>
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
            width: "100px",
            padding: "11px 14px",
            borderRadius: "9999px",
            background: "#1C291D",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#FAF7F2",
            outline: "none",
            fontSize: "0.88rem",
          }}
        />

        {/* Max Price Input */}
        <input
          type="number"
          placeholder="Max ₹"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{
            width: "100px",
            padding: "11px 14px",
            borderRadius: "9999px",
            background: "#1C291D",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#FAF7F2",
            outline: "none",
            fontSize: "0.88rem",
          }}
        />

        {/* CREATE OWN PACKAGE BUTTON - RIGHT NEXT TO MAX */}
        <button
          type="button"
          onClick={() => setCustomModalOpen(true)}
          className="aloriga-pill-btn gold"
          style={{
            padding: "10px 22px",
            fontSize: "0.82rem",
            letterSpacing: "0.06em",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(197, 160, 89, 0.25)",
            whiteSpace: "nowrap",
          }}
          title="Build your custom event package with selected services"
        >
          <Sparkles size={15} />
          <span>CREATE OWN PACKAGE</span>
        </button>

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
        <div style={{ textAlign: "center", padding: "4rem 0", color: "#8EA990" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid rgba(255,255,255,0.1)",
              borderTopColor: "#C5A059",
              borderRadius: "50%",
              margin: "0 auto 1.5rem",
              animation: "spin 1s linear infinite",
            }}
          />
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.2rem" }}>
            Curating bespoke collections...
          </p>
        </div>
      ) : filteredPackages.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 1rem", color: "#A8BCA9" }}>
          <p style={{ fontSize: "1.1rem", marginBottom: "1.5rem" }}>
            No botanical collections matched your criteria.
          </p>
          <button
            onClick={() => setCustomModalOpen(true)}
            className="aloriga-pill-btn gold"
            style={{ padding: "12px 28px" }}
          >
            <span>CREATE YOUR OWN BESPOKE PACKAGE</span>
          </button>
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
            const tier = tierConfig[pkg.tier] || tierConfig.luxury;
            const isHovered = hoveredId === pkg._id;
            const packageImg = pkg.image
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
                  borderRadius: "28px",
                  overflow: "hidden",
                  border: isHovered ? "1px solid rgba(197, 160, 89, 0.5)" : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: isHovered
                    ? "0 25px 60px rgba(0,0,0,0.5), 0 0 30px rgba(197,160,89,0.15)"
                    : "0 10px 30px rgba(0,0,0,0.3)",
                  transition: "all 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
                  transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Image */}
                <div style={{ position: "relative", height: "240px", overflow: "hidden" }}>
                  <img
                    src={packageImg}
                    alt={pkg.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                      transform: isHovered ? "scale(1.06)" : "scale(1)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(28,41,29,0.9) 0%, transparent 50%)",
                    }}
                  />
                  {/* Tier Badge */}
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

                  {/* Features / Inclusions */}
                  {((pkg.features && pkg.features.length > 0) || (pkg.inclusions && pkg.inclusions.length > 0)) && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "0.5rem 0" }}>
                      {(pkg.features || pkg.inclusions || []).map((feat, idx) => (
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

      {/* ========================================================================= */}
      {/* CREATE OWN PACKAGE MODAL (BESPOKE BUILDER & INSTANT ORDER) */}
      {/* ========================================================================= */}
      {customModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.82)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "linear-gradient(145deg, #162418 0%, #0E160F 100%)",
              border: "1px solid rgba(223, 191, 128, 0.35)",
              borderRadius: "28px",
              maxWidth: "960px",
              width: "100%",
              maxHeight: "92vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 70px rgba(0,0,0,0.7), 0 0 35px rgba(197, 160, 89, 0.15)",
              color: "#FAF7F2",
              overflow: "hidden",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "2rem 2.5rem 1.2rem",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "1.5rem",
              }}
            >
              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "rgba(223, 191, 128, 0.15)",
                    border: "1px solid rgba(223, 191, 128, 0.3)",
                    padding: "4px 12px",
                    borderRadius: "9999px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    color: "#DFBF80",
                    textTransform: "uppercase",
                    marginBottom: "0.6rem",
                  }}
                >
                  <Sparkles size={12} />
                  <span>Atelier Bespoke Studio</span>
                </div>
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)",
                    fontWeight: 600,
                    margin: "0 0 0.3rem",
                    color: "#FAF7F2",
                  }}
                >
                  Build Your Own Custom Package
                </h2>
                <p style={{ color: "#A8BCA9", fontSize: "0.88rem", margin: 0 }}>
                  Write your event name, select services to include, and order your personalized floral package with automatic price calculation.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCustomModalOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#FAF7F2",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(244, 63, 94, 0.2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div style={{ padding: "2rem 2.5rem", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "2rem" }}>
              {/* Event Name & Tier Row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#DFBF80", fontWeight: 700, marginBottom: "8px" }}>
                    Event / Package Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Wedding Celebration, Horizon Gala, Aanya's 21st Soirée..."
                    value={customEventName}
                    onChange={(e) => setCustomEventName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "13px 16px",
                      borderRadius: "14px",
                      background: "rgba(0,0,0,0.35)",
                      border: "1px solid rgba(223, 191, 128, 0.35)",
                      color: "#FAF7F2",
                      fontSize: "0.95rem",
                      outline: "none",
                      boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#DFBF80", fontWeight: 700, marginBottom: "8px" }}>
                    Curation Tier
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {[
                      { key: "luxury", label: "Haute Couture", icon: "👑" },
                      { key: "premium", label: "Signature", icon: "🌸" },
                      { key: "basic", label: "Atelier", icon: "🌿" },
                    ].map((t) => (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => setCustomTier(t.key)}
                        style={{
                          flex: 1,
                          padding: "10px 8px",
                          borderRadius: "12px",
                          border: customTier === t.key ? "1px solid #DFBF80" : "1px solid rgba(255,255,255,0.1)",
                          background: customTier === t.key ? "rgba(223, 191, 128, 0.18)" : "rgba(0,0,0,0.25)",
                          color: customTier === t.key ? "#DFBF80" : "#A8BCA9",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <span>{t.icon}</span>
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Service Categories Filter Tabs */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "0.8rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#DFBF80", fontWeight: 700, marginBottom: "2px" }}>
                      Select Services To Add Into Package
                    </label>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#8EA990" }}>
                      Click on services to include them. Each service price automatically adds to your total.
                    </p>
                  </div>

                  {/* Category Pills */}
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {categoriesSet.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setServiceCategoryFilter(cat)}
                        style={{
                          padding: "5px 12px",
                          borderRadius: "9999px",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          border: serviceCategoryFilter === cat ? "1px solid #DFBF80" : "1px solid rgba(255,255,255,0.1)",
                          background: serviceCategoryFilter === cat ? "#DFBF80" : "rgba(255,255,255,0.04)",
                          color: serviceCategoryFilter === cat ? "#141E15" : "#B4C2B6",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Services Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: "1.2rem",
                    maxHeight: "360px",
                    overflowY: "auto",
                    padding: "4px",
                  }}
                >
                  {filteredServicesList.map((service) => {
                    const isSelected = selectedServices.some((s) => s.id === service.id || s.name === service.name);

                    return (
                      <div
                        key={service.id || service.name}
                        onClick={() => handleToggleService(service)}
                        style={{
                          borderRadius: "18px",
                          background: isSelected ? "rgba(223, 191, 128, 0.12)" : "rgba(255, 255, 255, 0.03)",
                          border: isSelected ? "1px solid #DFBF80" : "1px solid rgba(255, 255, 255, 0.08)",
                          padding: "1rem",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.8rem",
                          transition: "all 0.25s ease",
                          position: "relative",
                          boxShadow: isSelected ? "0 6px 20px rgba(197, 160, 89, 0.15)" : "none",
                        }}
                      >
                        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                          <img
                            src={service.image}
                            alt={service.name}
                            style={{
                              width: "56px",
                              height: "56px",
                              borderRadius: "12px",
                              objectFit: "cover",
                              flexShrink: 0,
                            }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#FAF7F2", lineHeight: 1.3, marginBottom: "2px" }}>
                              {service.name}
                            </div>
                            <div style={{ fontSize: "0.72rem", color: "#8EA990" }}>
                              {service.category}
                            </div>
                          </div>
                        </div>

                        <p style={{ fontSize: "0.78rem", color: "#A8BCA9", lineHeight: 1.5, margin: 0, flex: 1 }}>
                          {service.description}
                        </p>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.6rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.25rem", fontWeight: 700, color: "#DFBF80" }}>
                            ₹{Number(service.price).toLocaleString("en-IN")}
                          </div>

                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              fontSize: "0.74rem",
                              fontWeight: 700,
                              padding: "4px 10px",
                              borderRadius: "9999px",
                              background: isSelected ? "#DFBF80" : "rgba(255,255,255,0.08)",
                              color: isSelected ? "#141E15" : "#FAF7F2",
                              transition: "all 0.2s ease",
                            }}
                          >
                            {isSelected ? (
                              <>
                                <Check size={12} strokeWidth={3} />
                                <span>ADDED</span>
                              </>
                            ) : (
                              <>
                                <Plus size={12} />
                                <span>ADD</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Special Instructions / Notes */}
              <div>
                <label style={{ display: "block", fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#DFBF80", marginBottom: "6px" }}>
                  Special Instructions / Flower Palette Preference (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Prefer ivory & blush english garden roses with warm candlelit amber accents..."
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    background: "rgba(0,0,0,0.3)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#FAF7F2",
                    fontSize: "0.88rem",
                    outline: "none",
                    resize: "none",
                  }}
                />
              </div>
            </div>

            {/* Modal Bottom Bar: Live Price Count & Action */}
            <div
              style={{
                padding: "1.5rem 2.5rem",
                background: "rgba(10, 16, 11, 0.95)",
                borderTop: "1px solid rgba(223, 191, 128, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1.5rem",
              }}
            >
              <div>
                <div style={{ fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#A8BCA9", marginBottom: "2px" }}>
                  Selected Services ({selectedServices.length}):
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                  <span style={{ fontSize: "0.9rem", color: "#B4C2B6" }}>Calculated Package Price:</span>
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: "2.1rem",
                      fontWeight: 700,
                      color: "#DFBF80",
                    }}
                  >
                    ₹{customTotalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() => setCustomModalOpen(false)}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#FAF7F2",
                    padding: "12px 24px",
                    borderRadius: "9999px",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleCreateAndOrderCustomPackage}
                  disabled={creatingCustom || !customEventName.trim() || selectedServices.length === 0}
                  className="aloriga-pill-btn gold"
                  style={{
                    padding: "13px 32px",
                    fontSize: "0.85rem",
                    letterSpacing: "0.08em",
                    cursor: creatingCustom || !customEventName.trim() || selectedServices.length === 0 ? "not-allowed" : "pointer",
                    opacity: creatingCustom || !customEventName.trim() || selectedServices.length === 0 ? 0.6 : 1,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <ShoppingBag size={16} />
                  <span>{creatingCustom ? "CREATING & ORDERING..." : "CREATE & ORDER PACKAGE"}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Packages;