import React, { useState, useEffect } from "react";
import { startRazorpayCheckout } from "../utils/razorpay";
import { CreditCard, CheckCircle2, Clock, Calendar, Mail, KeyRound, Sparkles, LogOut, ArrowRight, ShieldCheck, Tag } from "lucide-react";

const formatTime = (time24) => {
  if (!time24) return "";
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
};

const statusBadges = {
  pending: {
    bg: "rgba(197, 160, 89, 0.18)",
    border: "rgba(197, 160, 89, 0.4)",
    color: "#DFBF80",
    label: "Pending Review",
  },
  confirmed: {
    bg: "rgba(142, 169, 144, 0.2)",
    border: "rgba(142, 169, 144, 0.45)",
    color: "#8EA990",
    label: "Confirmed",
  },
  cancelled: {
    bg: "rgba(226, 104, 90, 0.18)",
    border: "rgba(226, 104, 90, 0.4)",
    color: "#E2685A",
    label: "Cancelled",
  },
};

const MyBookings = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const SERVER_URL = API_URL ? API_URL.replace("/api/v1", "") : "http://localhost:8000";

  // step: "email" -> "otp" -> "list"
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payingId, setPayingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const fetchBookings = async (token) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/customer/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await res.json();

      if (res.status === 401) {
        sessionStorage.removeItem("customerToken");
        sessionStorage.removeItem("customerEmail");
        setStep("email");
        setErrorMsg("Session expired. Please verify your email again.");
        return;
      }
      if (!res.ok) {
        setErrorMsg(response.message || "Failed to fetch bookings");
        return;
      }

      setBookings(response.data);
      setStep("list");
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedToken = sessionStorage.getItem("customerToken");
    const savedEmail = sessionStorage.getItem("customerEmail");
    if (savedToken) {
      setEmail(savedEmail || "");
      fetchBookings(savedToken);
    }
    // eslint-disable-next-line
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setInfoMsg("");
    try {
      const res = await fetch(`${API_URL}/customer/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const response = await res.json();
      if (!res.ok) {
        setErrorMsg(response.message || "Could not send OTP");
        return;
      }
      setInfoMsg(`A verification passcode was sent to ${email}`);
      setStep("otp");
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/customer/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const response = await res.json();
      if (!res.ok) {
        setErrorMsg(response.message || "Passcode verification failed");
        return;
      }

      sessionStorage.setItem("customerToken", response.data.token);
      sessionStorage.setItem("customerEmail", response.data.email);
      setOtp("");
      setInfoMsg("");
      await fetchBookings(response.data.token);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("customerToken");
    sessionStorage.removeItem("customerEmail");
    setBookings([]);
    setEmail("");
    setOtp("");
    setErrorMsg("");
    setInfoMsg("");
    setStep("email");
  };

  const handlePayNow = async (b) => {
    setPayingId(b._id);
    try {
      await startRazorpayCheckout({
        amount: b.price || 0,
        itemName: b.itemName,
        customerEmail: email,
        onSuccess: async (rzpResponse) => {
          try {
            const res = await fetch(`${API_URL}/payment/verify-and-confirm`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...rzpResponse,
                existingBookingId: b._id,
                bookingType: b.type === "Package" ? "package" : "category",
                bookingData: {
                  amount: b.price,
                },
              }),
            });

            const resp = await res.json();
            if (!res.ok) {
              alert(resp.message || "Payment verification failed");
              return;
            }

            alert("Payment successful! Your botanical experience is confirmed and an invoice has been emailed.");
            const token = sessionStorage.getItem("customerToken");
            if (token) fetchBookings(token);
          } catch (err) {
            alert("Error confirming payment: " + err.message);
          } finally {
            setPayingId(null);
          }
        },
        onError: (err) => {
          alert("Payment failed: " + (err.description || err.message));
          setPayingId(null);
        },
        onDismiss: () => {
          setPayingId(null);
        },
      });
    } catch (err) {
      alert(err.message);
      setPayingId(null);
    }
  };

  return (
    <div
      style={{
        background: "#141E15",
        minHeight: "100vh",
        padding: "4.5rem 1.5rem 7rem",
        color: "#F6F4EE",
        position: "relative",
      }}
    >
      {/* Subtle Botanical Ambient Grain */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.08,
          backgroundImage: "radial-gradient(#8EA990 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 2, maxWidth: "1000px", margin: "0 auto" }}>
        {/* Page Header */}
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
            <span>Private Concierge & Reservations</span>
          </div>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)",
              fontWeight: 500,
              color: "#FAF7F2",
              margin: "0 0 1rem",
              letterSpacing: "-0.01em",
            }}
          >
            My Reservations & Bookings
          </h1>
          <div style={{ width: "50px", height: "1px", background: "#C5A059", margin: "0 auto 1.2rem" }} />
          <p style={{ color: "#B4C2B6", maxWidth: "560px", margin: "0 auto", fontSize: "0.95rem", lineHeight: 1.6 }}>
            Verify your consultation email to track bespoke floral commissions, scheduled dates, and payment settlement.
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              maxWidth: "480px",
              margin: "0 auto 1.5rem",
              background: "rgba(226, 104, 90, 0.14)",
              border: "1px solid rgba(226, 104, 90, 0.35)",
              color: "#E2685A",
              padding: "0.85rem 1.2rem",
              borderRadius: "14px",
              textAlign: "center",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            {errorMsg}
          </div>
        )}

        {infoMsg && (
          <div
            style={{
              maxWidth: "480px",
              margin: "0 auto 1.5rem",
              background: "rgba(142, 169, 144, 0.16)",
              border: "1px solid rgba(142, 169, 144, 0.4)",
              color: "#8EA990",
              padding: "0.85rem 1.2rem",
              borderRadius: "14px",
              textAlign: "center",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            {infoMsg}
          </div>
        )}

        {/* STEP 1: Email Form */}
        {step === "email" && (
          <form
            onSubmit={handleSendOtp}
            className="animate-fade-in"
            style={{
              maxWidth: "440px",
              margin: "0 auto",
              background: "#1B271C",
              borderRadius: "24px",
              border: "1px solid rgba(197, 160, 89, 0.25)",
              padding: "2.5rem 2rem",
              boxShadow: "0 20px 45px rgba(0, 0, 0, 0.35)",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "16px",
                  background: "rgba(197, 160, 89, 0.15)",
                  border: "1px solid rgba(197, 160, 89, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#DFBF80",
                  margin: "0 auto 1rem",
                }}
              >
                <Mail size={24} />
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.6rem", color: "#FAF7F2", margin: "0 0 4px" }}>
                Access Your Bookings
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#8EA990", margin: 0 }}>
                Enter the email used when requesting your floral service
              </p>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ color: "#B4C2B6" }}>Client Email</label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#728274" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@luxury.com"
                  required
                  className="form-input"
                  style={{
                    paddingLeft: "42px",
                    background: "#223224",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    color: "#FAF7F2",
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="aloriga-pill-btn gold"
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "0.5rem",
                opacity: loading ? 0.7 : 1,
              }}
            >
              <span>{loading ? "Sending Passcode..." : "Send Verification Passcode"}</span>
              <ArrowRight size={15} />
            </button>
          </form>
        )}

        {/* STEP 2: OTP Verification Form */}
        {step === "otp" && (
          <form
            onSubmit={handleVerifyOtp}
            className="animate-fade-in"
            style={{
              maxWidth: "440px",
              margin: "0 auto",
              background: "#1B271C",
              borderRadius: "24px",
              border: "1px solid rgba(197, 160, 89, 0.25)",
              padding: "2.5rem 2rem",
              boxShadow: "0 20px 45px rgba(0, 0, 0, 0.35)",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "16px",
                  background: "rgba(197, 160, 89, 0.15)",
                  border: "1px solid rgba(197, 160, 89, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#DFBF80",
                  margin: "0 auto 1rem",
                }}
              >
                <KeyRound size={24} />
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.6rem", color: "#FAF7F2", margin: "0 0 4px" }}>
                Verify Passcode
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#8EA990", margin: 0 }}>
                We sent a 6-digit passcode to <strong style={{ color: "#FAF7F2" }}>{email}</strong>
              </p>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ color: "#B4C2B6", textAlign: "center", display: "block" }}>
                Enter 6-Digit Passcode
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="••••••"
                required
                className="form-input"
                style={{
                  letterSpacing: "8px",
                  textAlign: "center",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  background: "#223224",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  color: "#DFBF80",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="aloriga-pill-btn gold"
              style={{
                width: "100%",
                padding: "12px",
                opacity: loading || otp.length !== 6 ? 0.6 : 1,
              }}
            >
              <span>{loading ? "Verifying..." : "Verify & View Reservations"}</span>
              <CheckCircle2 size={16} />
            </button>

            <button
              type="button"
              onClick={() => { setStep("email"); setOtp(""); setErrorMsg(""); setInfoMsg(""); }}
              style={{
                background: "none",
                border: "none",
                color: "#8EA990",
                cursor: "pointer",
                fontSize: "0.82rem",
                textAlign: "center",
                textDecoration: "underline",
              }}
            >
              Use a different email
            </button>
          </form>
        )}

        {/* STEP 3: Bookings List */}
        {step === "list" && (
          <div className="animate-fade-in" style={{ maxWidth: "860px", margin: "0 auto" }}>
            {/* Header info bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
                padding: "0.85rem 1.4rem",
                background: "#1B271C",
                borderRadius: "16px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "0.85rem", color: "#8EA990" }}>Active Client Session:</span>
                <strong style={{ fontSize: "0.88rem", color: "#DFBF80" }}>{email}</strong>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  padding: "6px 16px",
                  borderRadius: "9999px",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: "#FAF7F2",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(226, 104, 90, 0.2)";
                  e.currentTarget.style.color = "#E2685A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.color = "#FAF7F2";
                }}
              >
                <LogOut size={13} />
                <span>Disconnect</span>
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "4rem 0" }}>
                <div className="spinner" style={{ borderTopColor: "#C5A059" }} />
                <p style={{ color: "#8EA990", fontWeight: 500 }}>Retrieving your botanical bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "4rem 2rem",
                  background: "#1B271C",
                  borderRadius: "24px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <p style={{ color: "#8EA990", fontSize: "1rem", marginBottom: "1.25rem" }}>
                  No active or past bookings were found associated with {email}.
                </p>
                <a
                  href="/categories"
                  className="aloriga-pill-btn gold"
                  style={{ textDecoration: "none", fontSize: "0.82rem" }}
                >
                  Explore Atelier Categories
                </a>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {bookings.map((b) => {
                  const badge = statusBadges[b.status] || statusBadges.pending;
                  return (
                    <div
                      key={b._id}
                      style={{
                        background: "#1B271C",
                        borderRadius: "22px",
                        border: "1px solid rgba(197, 160, 89, 0.25)",
                        padding: "1.5rem",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                        display: "flex",
                        gap: "1.25rem",
                        alignItems: "center",
                        flexWrap: "wrap",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "rgba(197, 160, 89, 0.55)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(197, 160, 89, 0.25)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      {b.image && (
                        <img
                          src={b.image.startsWith("http") ? b.image : `${SERVER_URL}${b.image}`}
                          alt={b.itemName}
                          style={{
                            width: "95px",
                            height: "95px",
                            objectFit: "cover",
                            borderRadius: "16px",
                            flexShrink: 0,
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                          }}
                        />
                      )}

                      <div style={{ flex: 1, minWidth: "260px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                          <h3
                            style={{
                              fontFamily: "'Cormorant Garamond', Georgia, serif",
                              fontSize: "1.45rem",
                              color: "#FAF7F2",
                              margin: 0,
                              fontWeight: 600,
                            }}
                          >
                            {b.itemName}
                            <span style={{ fontSize: "0.8rem", color: "#8EA990", marginLeft: "8px", fontFamily: "var(--font-sans)", fontWeight: 500 }}>
                              ({b.type || "Service"})
                            </span>
                          </h3>

                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            {/* Booking Status Badge */}
                            <span
                              style={{
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                color: badge.color,
                                background: badge.bg,
                                border: `1px solid ${badge.border}`,
                                padding: "4px 10px",
                                borderRadius: "9999px",
                              }}
                            >
                              {badge.label}
                            </span>

                            {/* Payment Status Badge */}
                            {b.paymentStatus === "paid" ? (
                              <span
                                style={{
                                  fontSize: "0.72rem",
                                  fontWeight: 700,
                                  color: "#8EA990",
                                  background: "rgba(142, 169, 144, 0.18)",
                                  border: "1px solid rgba(142, 169, 144, 0.4)",
                                  padding: "4px 10px",
                                  borderRadius: "9999px",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                }}
                              >
                                <CheckCircle2 size={12} color="#8EA990" />
                                Settled (Razorpay)
                              </span>
                            ) : (
                              <span
                                style={{
                                  fontSize: "0.72rem",
                                  fontWeight: 700,
                                  color: "#DFBF80",
                                  background: "rgba(197, 160, 89, 0.18)",
                                  border: "1px solid rgba(197, 160, 89, 0.35)",
                                  padding: "4px 10px",
                                  borderRadius: "9999px",
                                }}
                              >
                                Payment Unsettled
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Event Details */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                            flexWrap: "wrap",
                            fontSize: "0.83rem",
                            color: "#B4C2B6",
                            marginTop: "8px",
                          }}
                        >
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                            <Calendar size={13} color="#C5A059" />
                            {new Date(b.eventDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                          <span>•</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                            <Clock size={13} color="#C5A059" />
                            {formatTime(b.startTime)} – {formatTime(b.endTime)}
                          </span>
                          <span>•</span>
                          <span>{b.guests} Guests</span>
                        </div>

                        {/* Bottom Row: Price & Pay CTA */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "14px",
                            flexWrap: "wrap",
                            gap: "10px",
                            paddingTop: "12px",
                            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                            <span style={{ fontSize: "0.8rem", color: "#8EA990" }}>Commission Fee:</span>
                            <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "#FAF7F2", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                              ₹{(b.price || 0).toLocaleString("en-IN")}
                            </span>
                            {b.razorpayPaymentId && (
                              <span style={{ fontSize: "0.72rem", color: "#728274", fontFamily: "monospace" }}>
                                Ref: {b.razorpayPaymentId}
                              </span>
                            )}
                          </div>

                          {b.paymentStatus !== "paid" && (
                            <button
                              onClick={() => handlePayNow(b)}
                              disabled={payingId === b._id}
                              className="aloriga-pill-btn gold"
                              style={{
                                padding: "7px 18px",
                                fontSize: "0.78rem",
                                opacity: payingId === b._id ? 0.7 : 1,
                              }}
                            >
                              <CreditCard size={13} />
                              <span>{payingId === b._id ? "Opening Gateway..." : "Pay via Razorpay"}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;