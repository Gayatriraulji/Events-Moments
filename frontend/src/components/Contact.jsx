import React, { useState } from "react";
import { Sparkles, Mail, Phone, MapPin, Clock, Send, CheckCircle, Heart } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", occasion: "Wedding", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", occasion: "Wedding", message: "" });
  };

  const contactDetails = [
    {
      icon: <Mail size={20} />,
      title: "Private Inquiries",
      value: "studio@aloriga.com",
      sub: "Bespoke commission requests",
      color: "#DFBF80",
      bg: "rgba(197, 160, 89, 0.16)",
    },
    {
      icon: <Phone size={20} />,
      title: "Concierge & Appointments",
      value: "+1 (555) 349-2810",
      sub: "Monday – Saturday (9 AM – 7 PM)",
      color: "#8EA990",
      bg: "rgba(142, 169, 144, 0.16)",
    },
    {
      icon: <MapPin size={20} />,
      title: "Ateliers",
      value: "New York • Paris • Milan",
      sub: "Private studio visits by appointment",
      color: "#C5A059",
      bg: "rgba(197, 160, 89, 0.16)",
    },
  ];

  return (
    <div style={{ background: "#141E15", minHeight: "100vh", padding: "4rem 1.5rem 6rem", color: "#F6F4EE" }}>
      {/* Header */}
      <div className="page-header" style={{ textAlign: "center", marginBottom: "4rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.74rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#DFBF80",
            fontWeight: 700,
            marginBottom: "0.8rem",
          }}
        >
          <Sparkles size={14} color="#C5A059" />
          <span>Atelier Consultation</span>
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
          Book a Consultation
        </h1>
        <div style={{ width: "50px", height: "1px", background: "#C5A059", margin: "0 auto 1.2rem" }} />
        <p style={{ color: "#B4C2B6", maxWidth: "600px", margin: "0 auto", fontSize: "1rem", lineHeight: 1.7 }}>
          Connect with Luna Sage and our master floral architects to craft your celebration's living poetry.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "3rem",
          maxWidth: "1140px",
          margin: "0 auto",
          alignItems: "start",
        }}
      >
        {/* Left: Contact Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {contactDetails.map((detail, i) => (
            <div
              key={i}
              style={{
                background: "#1C291D",
                borderRadius: "22px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                padding: "1.6rem",
                display: "flex",
                gap: "1.2rem",
                alignItems: "center",
                boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(197, 160, 89, 0.4)";
                e.currentTarget.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "16px",
                  background: detail.bg,
                  border: `1px solid ${detail.color}35`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: detail.color,
                  flexShrink: 0,
                }}
              >
                {detail.icon}
              </div>
              <div>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#8EA990", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "2px" }}>
                  {detail.title}
                </div>
                <div style={{ fontSize: "1.05rem", fontWeight: 600, color: "#FAF7F2", marginBottom: "2px" }}>
                  {detail.value}
                </div>
                <div style={{ fontSize: "0.82rem", color: "#A8BCA9" }}>{detail.sub}</div>
              </div>
            </div>
          ))}

          {/* Consultation Note */}
          <div
            style={{
              borderRadius: "22px",
              padding: "2rem",
              background: "rgba(35, 50, 36, 0.5)",
              border: "1px solid rgba(197, 160, 89, 0.3)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <Clock size={18} color="#C5A059" />
              <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.25rem", fontWeight: 600, color: "#FAF7F2" }}>
                Bespoke Studio Hours
              </span>
            </div>
            <p style={{ fontSize: "0.88rem", color: "#B4C2B6", lineHeight: 1.7, margin: 0 }}>
              Virtual & atelier consultations are conducted Monday through Saturday. We recommend reserving commissions 3 to 6 months in advance for peak wedding seasons.
            </p>
          </div>
        </div>

        {/* Right: Form */}
        <div
          style={{
            background: "#1C291D",
            borderRadius: "26px",
            border: "1px solid rgba(197, 160, 89, 0.35)",
            padding: "2.5rem",
            boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "1.85rem",
              fontWeight: 600,
              color: "#FAF7F2",
              marginBottom: "0.4rem",
            }}
          >
            Inquire for Your Date
          </h2>
          <p style={{ fontSize: "0.88rem", color: "#A8BCA9", marginBottom: "2rem", lineHeight: 1.6 }}>
            Share your celebration vision and our botanical atelier will connect with you within 24 hours.
          </p>

          {submitted ? (
            <div style={{ textAlign: "center", padding: "2.5rem 0" }}>
              <CheckCircle size={44} color="#C5A059" style={{ margin: "0 auto 1rem" }} />
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.7rem", color: "#FAF7F2", margin: "0 0 6px" }}>
                Message Received
              </h3>
              <p style={{ color: "#B4C2B6", fontSize: "0.9rem" }}>
                Thank you! Luna and our design team look forward to crafting something unforgettable with you.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
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
                    padding: "11px 14px",
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
                    padding: "11px 14px",
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
                  Occasion Type
                </label>
                <select
                  name="occasion"
                  value={formData.occasion}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: "12px",
                    background: "#182419",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#FAF7F2",
                    outline: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  <option value="Wedding">Luxury Wedding & Bridal</option>
                  <option value="Corporate">Corporate Gala & Brand Staging</option>
                  <option value="Private">Private Villa Soirée</option>
                  <option value="Installation">Architectural Installation</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#A8BCA9", marginBottom: "4px" }}>
                  Vision & Celebration Notes
                </label>
                <textarea
                  required
                  name="message"
                  rows={4}
                  placeholder="Tell us about your venue, wedding dress palette, or aesthetic preferences..."
                  value={formData.message}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
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
                className="aloriga-pill-btn gold"
                style={{ width: "100%", padding: "12px", marginTop: "0.5rem" }}
              >
                <Send size={15} />
                <span>SEND INQUIRY</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;