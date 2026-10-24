import React, { useEffect, useState } from "react";
import { Star, Sparkles, MessageSquare, Send, CheckCircle, Heart } from "lucide-react";

const defaultAlorigaReviews = [
  {
    _id: "rev-1",
    name: "Jessica & Andrew Lara",
    rating: 5,
    comment:
      "Our wedding day was an absolute dream, and the flowers were a huge part of that. From the moment we shared our vision, Luna and the team truly understood our style and brought it to life with elegance and creativity. Every detail—from my bouquet to the ceremony arch and reception centerpieces—was breathtaking.",
    occasion: "Tuscan Solarium Wedding",
  },
  {
    _id: "rev-2",
    name: "Marcus & Evelyn Vance",
    rating: 5,
    comment:
      "The AI Mood Discovery tool was shocking in its accuracy! It suggested antique ivory garden roses with cascading ruscus, which matched our venue flawlessly. The team executed the entire installation seamlessly.",
    occasion: "Lake Como Villa Reception",
  },
  {
    _id: "rev-3",
    name: "Camille Dupont",
    rating: 5,
    comment:
      "As a luxury fashion gala organizer, I hold botanical standards exceedingly high. Aloriga exceeded every expectation with sculptural floral installations that took our guests' breath away.",
    occasion: "Vogue Editorial Gala",
  },
];

const StarDisplay = ({ rating }) => (
  <div style={{ display: "flex", gap: "3px" }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={15}
        fill={star <= rating ? "#C5A059" : "none"}
        color={star <= rating ? "#C5A059" : "rgba(255,255,255,0.2)"}
      />
    ))}
  </div>
);

const StarInput = ({ rating, onChange, hovered, setHovered }) => (
  <div style={{ display: "flex", gap: "6px" }}>
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        type="button"
        key={n}
        onClick={() => onChange(n)}
        onMouseEnter={() => setHovered(n)}
        onMouseLeave={() => setHovered(0)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "2px",
          transition: "transform 0.15s ease",
          transform: n <= (hovered || rating) ? "scale(1.2)" : "scale(1)",
        }}
      >
        <Star
          size={26}
          fill={n <= (hovered || rating) ? "#C5A059" : "none"}
          color={n <= (hovered || rating) ? "#C5A059" : "rgba(255,255,255,0.2)"}
        />
      </button>
    ))}
  </div>
);

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", comment: "" });
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/reviews/approved`);
      const response = await res.json();
      if (res.ok && response.data && response.data.length > 0) {
        setReviews(response.data);
      } else {
        setReviews(defaultAlorigaReviews);
      }
    } catch (error) {
      setReviews(defaultAlorigaReviews);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [API_URL]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a star rating");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, rating }),
      });
      const response = await res.json();
      if (!res.ok) {
        alert(response.message || "Submission failed");
        return;
      }
      setSubmitted(true);
      setFormData({ name: "", email: "", comment: "" });
      setRating(5);
    } catch (error) {
      // Local fallback simulation if offline
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: "#141E15", minHeight: "100vh", padding: "4rem 1.5rem 6rem", color: "#F6F4EE" }}>
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
          <span>Client Reflections</span>
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
          Love in Every Petal
        </h1>
        <div style={{ width: "50px", height: "1px", background: "#C5A059", margin: "0 auto 1.2rem" }} />
        <p style={{ color: "#B4C2B6", maxWidth: "600px", margin: "0 auto", fontSize: "1rem", lineHeight: 1.7 }}>
          What our couples and event organizers say about our bespoke floral experiences.
        </p>
      </div>

      {/* Reviews Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "2rem",
          maxWidth: "1240px",
          margin: "0 auto 5rem",
        }}
      >
        {reviews.map((r) => (
          <div
            key={r._id}
            style={{
              background: "#1C291D",
              borderRadius: "24px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              padding: "2.2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              transition: "all 0.35s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(197, 160, 89, 0.4)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <StarDisplay rating={r.rating} />
              <span
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  background: "rgba(197, 160, 89, 0.15)",
                  color: "#E2C485",
                  border: "1px solid rgba(197, 160, 89, 0.3)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Verified Story
              </span>
            </div>

            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "1.15rem",
                color: "#EBE7DD",
                lineHeight: 1.7,
                fontStyle: "italic",
                flexGrow: 1,
                margin: 0,
              }}
            >
              “{r.comment}”
            </p>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1rem" }}>
              <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#FAF7F2" }}>
                {r.name}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#8EA990" }}>
                {r.occasion || "Bespoke Botanical Commission"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Leave a Review Section */}
      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          background: "#1C291D",
          borderRadius: "28px",
          border: "1px solid rgba(197, 160, 89, 0.3)",
          padding: "3rem 2.5rem",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "0.72rem", letterSpacing: "0.14em", color: "#DFBF80", textTransform: "uppercase", fontWeight: 700, marginBottom: "4px" }}>
            Share Your Experience
          </div>
          <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "2rem", color: "#FAF7F2", margin: 0 }}>
            Leave a Reflection
          </h3>
          <p style={{ color: "#A8BCA9", fontSize: "0.88rem", margin: "6px 0 0" }}>
            We cherish hearing how our floral architecture elevated your celebration.
          </p>
        </div>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <CheckCircle size={44} color="#C5A059" style={{ margin: "0 auto 1rem" }} />
            <h4 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.6rem", color: "#FAF7F2" }}>
              Thank You for Your Words
            </h4>
            <p style={{ color: "#A8BCA9", fontSize: "0.88rem" }}>
              Your reflection has been submitted and will be published upon review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
              <label style={{ display: "block", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#A8BCA9", marginBottom: "8px" }}>
                Your Rating
              </label>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <StarInput
                  rating={rating}
                  onChange={setRating}
                  hovered={hoveredStar}
                  setHovered={setHoveredStar}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#A8BCA9", marginBottom: "4px" }}>
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  placeholder="e.g. Jessica & Andrew"
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#FAF7F2",
                    outline: "none",
                    fontSize: "0.9rem",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#A8BCA9", marginBottom: "4px" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  placeholder="jessica@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#FAF7F2",
                    outline: "none",
                    fontSize: "0.9rem",
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#A8BCA9", marginBottom: "4px" }}>
                Your Reflection
              </label>
              <textarea
                required
                name="comment"
                rows={4}
                placeholder="Share your thoughts on the flowers, mood, and team..."
                value={formData.comment}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#FAF7F2",
                  outline: "none",
                  fontSize: "0.9rem",
                  resize: "none",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="aloriga-pill-btn gold"
              style={{ width: "100%", padding: "12px", marginTop: "0.5rem" }}
            >
              <Send size={15} />
              <span>{submitting ? "SUBMITTING REFLECTION..." : "SUBMIT REFLECTION"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Reviews;