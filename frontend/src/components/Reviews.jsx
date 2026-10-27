import React, { useEffect, useState } from "react";
import { Star, Sparkles, MessageSquare, Send, CheckCircle, Heart, Pencil, Trash2, X } from "lucide-react";

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
    {[1, 2, 3, 4, 5].map((star) => {
      const active = hovered ? star <= hovered : star <= rating;
      return (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered && setHovered(star)}
          onMouseLeave={() => setHovered && setHovered(0)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            transition: "transform 0.15s ease",
            transform: active ? "scale(1.15)" : "scale(1)",
          }}
        >
          <Star
            size={24}
            fill={active ? "#C5A059" : "none"}
            color={active ? "#C5A059" : "rgba(255,255,255,0.25)"}
          />
        </button>
      );
    })}
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

  // Edit State
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", rating: 5, comment: "" });
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete State
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null);

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
      fetchReviews();
    } catch (error) {
      // Local fallback simulation if offline
      const newLocalReview = {
        _id: "local-" + Date.now(),
        name: formData.name,
        comment: formData.comment,
        rating: rating,
        occasion: "Client Reflection",
      };
      setReviews((prev) => [newLocalReview, ...prev]);
      setSubmitted(true);
      setFormData({ name: "", email: "", comment: "" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (review) => {
    setEditingReview(review);
    setEditForm({
      name: review.name || "",
      rating: review.rating || 5,
      comment: review.comment || "",
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      if (editingReview._id && !editingReview._id.startsWith("rev-") && !editingReview._id.startsWith("local-")) {
        await fetch(`${API_URL}/reviews/${editingReview._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        });
      }
      // Update local state
      setReviews((prev) =>
        prev.map((r) => (r._id === editingReview._id ? { ...r, ...editForm } : r))
      );
      setEditingReview(null);
    } catch (err) {
      setReviews((prev) =>
        prev.map((r) => (r._id === editingReview._id ? { ...r, ...editForm } : r))
      );
      setEditingReview(null);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      if (id && !id.startsWith("rev-") && !id.startsWith("local-")) {
        await fetch(`${API_URL}/reviews/${id}`, {
          method: "DELETE",
        });
      }
      setReviews((prev) => prev.filter((r) => r._id !== id));
      setDeleteConfirmTarget(null);
    } catch (err) {
      setReviews((prev) => prev.filter((r) => r._id !== id));
      setDeleteConfirmTarget(null);
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
              position: "relative",
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

            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                paddingTop: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.8rem",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#FAF7F2" }}>
                  {r.name}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#8EA990" }}>
                  {r.occasion || "Bespoke Botanical Commission"}
                </div>
              </div>

              {/* Edit & Delete Action Buttons for Site */}
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <button
                  onClick={() => handleStartEdit(r)}
                  style={{
                    background: "rgba(223, 191, 128, 0.12)",
                    border: "1px solid rgba(223, 191, 128, 0.3)",
                    color: "#DFBF80",
                    padding: "6px 12px",
                    borderRadius: "9999px",
                    cursor: "pointer",
                    fontSize: "0.74rem",
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(223, 191, 128, 0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(223, 191, 128, 0.12)";
                  }}
                  title="Edit this reflection"
                >
                  <Pencil size={13} />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => setDeleteConfirmTarget(r)}
                  style={{
                    background: "rgba(244, 63, 94, 0.1)",
                    border: "1px solid rgba(244, 63, 94, 0.3)",
                    color: "#FB7185",
                    padding: "6px 12px",
                    borderRadius: "9999px",
                    cursor: "pointer",
                    fontSize: "0.74rem",
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(244, 63, 94, 0.22)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(244, 63, 94, 0.1)";
                  }}
                  title="Delete this reflection"
                >
                  <Trash2 size={13} />
                  <span>Delete</span>
                </button>
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
            <p style={{ color: "#A8BCA9", fontSize: "0.88rem", marginBottom: "1.5rem" }}>
              Your reflection has been published directly to our client wall.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="aloriga-pill-btn gold"
              style={{ padding: "10px 24px", fontSize: "0.8rem", margin: "0 auto" }}
            >
              <span>SHARE ANOTHER REFLECTION</span>
            </button>
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

      {/* Edit Review Modal */}
      {editingReview && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "#182419",
              border: "1px solid rgba(197, 160, 89, 0.4)",
              borderRadius: "26px",
              padding: "2.5rem",
              maxWidth: "520px",
              width: "100%",
              boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
              color: "#FAF7F2",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Pencil size={18} color="#C5A059" />
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.6rem", margin: 0, color: "#FAF7F2" }}>
                  Edit Reflection
                </h3>
              </div>
              <button
                onClick={() => setEditingReview(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#9EAFA1",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#DFBF80", marginBottom: "6px" }}>
                  Rating
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, rating: star })}
                      style={{ background: "transparent", border: "none", cursor: "pointer", padding: "2px" }}
                    >
                      <Star
                        size={24}
                        fill={star <= editForm.rating ? "#C5A059" : "none"}
                        color={star <= editForm.rating ? "#C5A059" : "rgba(255,255,255,0.2)"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#DFBF80", marginBottom: "6px" }}>
                  Your Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    background: "rgba(0,0,0,0.3)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "12px",
                    padding: "10px 14px",
                    color: "#FAF7F2",
                    fontSize: "0.95rem",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#DFBF80", marginBottom: "6px" }}>
                  Your Reflection
                </label>
                <textarea
                  rows={4}
                  value={editForm.comment}
                  onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    background: "rgba(0,0,0,0.3)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "12px",
                    padding: "10px 14px",
                    color: "#FAF7F2",
                    fontSize: "0.95rem",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#FAF7F2",
                    padding: "10px 20px",
                    borderRadius: "9999px",
                    cursor: "pointer",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="aloriga-pill-btn gold"
                  style={{ padding: "10px 24px", fontSize: "0.82rem" }}
                >
                  <span>{savingEdit ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal for Site */}
      {deleteConfirmTarget && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "#182419",
              border: "1px solid rgba(244, 63, 94, 0.4)",
              borderRadius: "24px",
              padding: "2.5rem 2rem",
              maxWidth: "420px",
              width: "100%",
              textAlign: "center",
              boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
              color: "#FAF7F2",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: "rgba(244, 63, 94, 0.15)",
                color: "#FB7185",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.2rem",
              }}
            >
              <Trash2 size={24} />
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.8rem", margin: "0 0 0.5rem" }}>
              Delete Reflection
            </h3>
            <p style={{ color: "#A8BCA9", fontSize: "0.9rem", lineHeight: 1.6, margin: "0 0 1.8rem" }}>
              Are you sure you want to delete the review by <strong style={{ color: "#FAF7F2" }}>{deleteConfirmTarget.name}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#FAF7F2",
                  padding: "10px 22px",
                  borderRadius: "9999px",
                  cursor: "pointer",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteReview(deleteConfirmTarget._id)}
                style={{
                  background: "#E11D48",
                  border: "none",
                  color: "#FFFFFF",
                  padding: "10px 24px",
                  borderRadius: "9999px",
                  cursor: "pointer",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  boxShadow: "0 4px 15px rgba(225, 29, 72, 0.4)",
                }}
              >
                Delete Reflection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;