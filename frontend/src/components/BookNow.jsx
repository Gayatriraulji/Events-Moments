import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, User, Mail, Phone, Users, MessageSquare, CheckCircle2, ArrowLeft, Tag, CreditCard, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import { startRazorpayCheckout } from "../utils/razorpay";

const hours12 = Array.from({ length: 12 }, (_, i) => i + 1);
const minutes60 = Array.from({ length: 60 }, (_, i) => i);

const to24Hour = (hour12, minute, ampm) => {
  let hour = parseInt(hour12, 10);
  if (ampm === "AM") {
    if (hour === 12) hour = 0;
  } else {
    if (hour !== 12) hour += 12;
  }
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

const TimePicker = ({ label, hour, minute, ampm, onHourChange, onMinuteChange, onAmpmChange }) => (
  <div style={{ flex: 1 }}>
    <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px", color: "#B4C2B6" }}>
      <Clock size={13} color="#C5A059" />
      <span>{label}</span>
    </label>
    <div style={{ display: "flex", gap: "6px" }}>
      <select
        value={hour}
        onChange={onHourChange}
        required
        className="form-select"
        style={{ background: "#223224", borderColor: "rgba(255,255,255,0.1)", color: "#FAF7F2" }}
      >
        <option value="">HH</option>
        {hours12.map((h) => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>
      <select
        value={minute}
        onChange={onMinuteChange}
        required
        className="form-select"
        style={{ background: "#223224", borderColor: "rgba(255,255,255,0.1)", color: "#FAF7F2" }}
      >
        <option value="">MM</option>
        {minutes60.map((m) => (
          <option key={m} value={m}>{String(m).padStart(2, "0")}</option>
        ))}
      </select>
      <select
        value={ampm}
        onChange={onAmpmChange}
        required
        className="form-select"
        style={{ background: "#223224", borderColor: "rgba(255,255,255,0.1)", color: "#FAF7F2" }}
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  </div>
);

const BookNow = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    guests: 1,
    message: "",
  });

  const [startHour, setStartHour] = useState("");
  const [startMinute, setStartMinute] = useState("");
  const [startAmpm, setStartAmpm] = useState("AM");

  const [endHour, setEndHour] = useState("");
  const [endMinute, setEndMinute] = useState("");
  const [endAmpm, setEndAmpm] = useState("AM");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";
  const SERVER_URL = API_URL ? API_URL.replace("/api/v1", "") : "http://localhost:8000";

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`${API_URL}/categories/${id}`);
        const response = await res.json();
        if (!res.ok) {
          setErrorMsg(response.message || "Failed to load category");
          return;
        }
        setCategory(response.data);
      } catch (error) {
        setErrorMsg(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, API_URL]);

  const [paymentDetails, setPaymentDetails] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOnlinePayment = async (e) => {
    e.preventDefault();

    if (!startHour || startMinute === "" || !endHour || endMinute === "") {
      alert("Please select both start and end time");
      return;
    }

    const startTime = to24Hour(startHour, startMinute, startAmpm);
    const endTime = to24Hour(endHour, endMinute, endAmpm);

    setSubmitting(true);
    try {
      await startRazorpayCheckout({
        amount: category.price || 0,
        itemName: category.name,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        onSuccess: async (rzpResponse) => {
          try {
            const res = await fetch(`${API_URL}/payment/verify-and-confirm`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...rzpResponse,
                bookingType: "category",
                bookingData: {
                  ...formData,
                  startTime,
                  endTime,
                  category: id,
                  amount: category.price,
                },
              }),
            });

            const response = await res.json();
            if (!res.ok) {
              if (res.status === 409) {
                setBookingError(response.message || "This time slot is already reserved. Please choose a different time.");
              } else {
                setBookingError(response.message || "Payment verification failed");
              }
              setSubmitting(false);
              return;
            }
            setBookingError("");

            setPaymentDetails({
              paymentId: rzpResponse.razorpay_payment_id,
              orderId: rzpResponse.razorpay_order_id,
              amount: category.price,
            });
            setSubmitted(true);
          } catch (err) {
            alert("Error confirming booking: " + err.message);
          } finally {
            setSubmitting(false);
          }
        },
        onError: (err) => {
          alert("Payment failed: " + (err.description || err.message));
          setSubmitting(false);
        },
        onDismiss: () => {
          setSubmitting(false);
        },
      });
    } catch (error) {
      alert(error.message);
      setSubmitting(false);
    }
  };

  const handlePayLaterBooking = async (e) => {
    e.preventDefault();

    if (!startHour || startMinute === "" || !endHour || endMinute === "") {
      setBookingError("Please select both start and end time");
      return;
    }

    const startTime = to24Hour(startHour, startMinute, startAmpm);
    const endTime = to24Hour(endHour, endMinute, endAmpm);

    setBookingError("");
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, startTime, endTime, category: id }),
      });

      const response = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          setBookingError("🚫 This time slot is already reserved for this date. Please choose a different time.");
        } else {
          setBookingError(response.message || "Booking failed. Please try again.");
        }
        return;
      }

      setSubmitted(true);
    } catch (error) {
      setBookingError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ background: "#141E15", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div>
          <div className="spinner" style={{ borderTopColor: "#C5A059" }} />
          <p style={{ color: "#8EA990", textAlign: "center" }}>Loading atelier suite...</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div style={{ background: "#141E15", minHeight: "100vh", padding: "5rem 1rem", textAlign: "center", color: "#E2685A" }}>
        Error: {errorMsg}
      </div>
    );
  }

  if (!category) return null;

  if (submitted) {
    return (
      <div
        style={{
          background: "#141E15",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 1.5rem",
          color: "#FAF7F2",
        }}
      >
        <div
          className="animate-fade-in"
          style={{
            maxWidth: "540px",
            width: "100%",
            background: "#1B271C",
            borderRadius: "28px",
            border: "1px solid rgba(197, 160, 89, 0.3)",
            padding: "3rem 2.5rem",
            textAlign: "center",
            boxShadow: "0 25px 60px rgba(0,0,0,0.45)",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "rgba(142, 169, 144, 0.2)",
              color: "#8EA990",
              border: "1px solid rgba(142, 169, 144, 0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              boxShadow: "0 8px 24px rgba(142, 169, 144, 0.25)",
            }}
          >
            <CheckCircle2 size={40} color="#8EA990" />
          </div>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "2.1rem",
              fontWeight: 500,
              color: "#FAF7F2",
              marginBottom: "0.5rem",
            }}
          >
            {paymentDetails ? "Reservation & Payment Confirmed" : "Reservation Request Received"}
          </h2>

          <p style={{ color: "#B4C2B6", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.75rem" }}>
            Thank you, <strong style={{ color: "#FAF7F2" }}>{formData.name}</strong>. Your commission for{" "}
            <strong style={{ color: "#DFBF80" }}>{category.name}</strong> on{" "}
            <span style={{ fontWeight: 700, color: "#FAF7F2" }}>{formData.eventDate}</span> is confirmed with our atelier.
          </p>

          {paymentDetails && (
            <div
              style={{
                background: "#223224",
                border: "1px solid rgba(197, 160, 89, 0.25)",
                borderRadius: "16px",
                padding: "1.2rem 1.4rem",
                textAlign: "left",
                marginBottom: "2rem",
                fontSize: "0.875rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#8EA990" }}>Payment Method:</span>
                <span style={{ fontWeight: 600, color: "#FAF7F2" }}>Razorpay Online</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#8EA990" }}>Transaction Ref:</span>
                <span style={{ fontWeight: 600, color: "#DFBF80", fontFamily: "monospace" }}>{paymentDetails.paymentId}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#8EA990" }}>Settled Amount:</span>
                <span style={{ fontWeight: 700, color: "#FAF7F2" }}>₹{Number(paymentDetails.amount).toLocaleString("en-IN")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8EA990" }}>Digital Receipt:</span>
                <span style={{ color: "#8EA990", fontWeight: 600 }}>Sent to {formData.email}</span>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/my-bookings")} className="aloriga-pill-btn gold" style={{ padding: "10px 22px" }}>
              View My Bookings
            </button>
            <button onClick={() => navigate("/categories")} className="aloriga-pill-btn outline" style={{ padding: "10px 22px" }}>
              Explore Other Categories
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#141E15",
        minHeight: "100vh",
        padding: "3.5rem 1.5rem 6rem",
        color: "#FAF7F2",
      }}
    >
      <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
        <button
          onClick={() => navigate("/categories")}
          className="aloriga-pill-btn outline"
          style={{ marginBottom: "2rem", padding: "6px 18px", fontSize: "0.78rem" }}
        >
          <ArrowLeft size={14} />
          <span>Back to Categories</span>
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "2.5rem",
            alignItems: "start",
          }}
        >
          {/* Category Info Left Card */}
          <div
            style={{
              background: "#1B271C",
              borderRadius: "26px",
              border: "1px solid rgba(197, 160, 89, 0.25)",
              overflow: "hidden",
              boxShadow: "0 20px 45px rgba(0,0,0,0.35)",
            }}
          >
            {category.image && (
              <div style={{ height: "260px", overflow: "hidden", position: "relative" }}>
                <img
                  src={category.image.startsWith("http") ? category.image : `${SERVER_URL}${category.image}`}
                  alt={category.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80";
                  }}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(20,30,21,0.85) 0%, transparent 60%)" }} />
              </div>
            )}

            <div style={{ padding: "2rem" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: "0.72rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#DFBF80",
                  fontWeight: 700,
                  marginBottom: "8px",
                }}
              >
                <span>Bespoke Scenography Booking</span>
              </div>

              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "2rem",
                  fontWeight: 500,
                  color: "#FAF7F2",
                  marginBottom: "10px",
                }}
              >
                {category.name}
              </h2>

              {category.description && (
                <p style={{ fontSize: "0.92rem", color: "#B4C2B6", lineHeight: 1.65, marginBottom: "1.75rem" }}>
                  {category.description}
                </p>
              )}

              {category.price !== undefined && (
                <div
                  style={{
                    padding: "1.2rem",
                    borderRadius: "16px",
                    background: "#223224",
                    border: "1px solid rgba(197, 160, 89, 0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#8EA990", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Tag size={15} color="#C5A059" />
                    Starting Commission
                  </span>
                  <span style={{ fontSize: "1.45rem", fontWeight: 700, color: "#DFBF80", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    ₹{category.price.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Booking Form Right Card */}
          <div
            style={{
              background: "#1B271C",
              borderRadius: "26px",
              border: "1px solid rgba(197, 160, 89, 0.25)",
              padding: "2.5rem 2.2rem",
              boxShadow: "0 20px 45px rgba(0,0,0,0.35)",
            }}
          >
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "1.85rem",
                fontWeight: 500,
                color: "#FAF7F2",
                marginBottom: "6px",
              }}
            >
              Reserve Your Consultation
            </h2>
            <p style={{ fontSize: "0.875rem", color: "#8EA990", marginBottom: "1.75rem" }}>
              Please provide your event date and contact details to finalize scheduling.
            </p>

            <form onSubmit={handleOnlinePayment}>
              <div className="form-group">
                <label className="form-label" style={{ color: "#B4C2B6" }}>Full Name</label>
                <div style={{ position: "relative" }}>
                  <User size={17} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#728274" }} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jessica Vance"
                    required
                    className="form-input"
                    style={{ paddingLeft: "42px", background: "#223224", borderColor: "rgba(255,255,255,0.1)", color: "#FAF7F2" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: "#B4C2B6" }}>Email</label>
                  <div style={{ position: "relative" }}>
                    <Mail size={17} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#728274" }} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="client@luxury.com"
                      required
                      className="form-input"
                      style={{ paddingLeft: "42px", background: "#223224", borderColor: "rgba(255,255,255,0.1)", color: "#FAF7F2" }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: "#B4C2B6" }}>Phone</label>
                  <div style={{ position: "relative" }}>
                    <Phone size={17} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#728274" }} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      required
                      className="form-input"
                      style={{ paddingLeft: "42px", background: "#223224", borderColor: "rgba(255,255,255,0.1)", color: "#FAF7F2" }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: "#B4C2B6" }}>Event Date</label>
                  <div style={{ position: "relative" }}>
                    <Calendar size={17} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#728274" }} />
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleChange}
                      required
                      className="form-input"
                      style={{ paddingLeft: "42px", background: "#223224", borderColor: "rgba(255,255,255,0.1)", color: "#FAF7F2" }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: "#B4C2B6" }}>Guests</label>
                  <div style={{ position: "relative" }}>
                    <Users size={17} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#728274" }} />
                    <input
                      type="number"
                      name="guests"
                      min="1"
                      value={formData.guests}
                      onChange={handleChange}
                      required
                      className="form-input"
                      style={{ paddingLeft: "42px", background: "#223224", borderColor: "rgba(255,255,255,0.1)", color: "#FAF7F2" }}
                    />
                  </div>
                </div>
              </div>

              {/* Time Pickers */}
              <div style={{ display: "flex", gap: "12px", marginBottom: "1rem" }}>
                <TimePicker
                  label="Start Time"
                  hour={startHour}
                  minute={startMinute}
                  ampm={startAmpm}
                  onHourChange={(e) => setStartHour(e.target.value)}
                  onMinuteChange={(e) => setStartMinute(e.target.value)}
                  onAmpmChange={(e) => setStartAmpm(e.target.value)}
                />
                <TimePicker
                  label="End Time"
                  hour={endHour}
                  minute={endMinute}
                  ampm={endAmpm}
                  onHourChange={(e) => setEndHour(e.target.value)}
                  onMinuteChange={(e) => setEndMinute(e.target.value)}
                  onAmpmChange={(e) => setEndAmpm(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: "#B4C2B6" }}>Botanical Notes / Special Requests</label>
                <div style={{ position: "relative" }}>
                  <MessageSquare size={17} style={{ position: "absolute", left: "14px", top: "14px", color: "#728274" }} />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Specific floral preferences, venue lighting, or theme aesthetic..."
                    className="form-textarea"
                    style={{ paddingLeft: "42px", background: "#223224", borderColor: "rgba(255,255,255,0.1)", color: "#FAF7F2" }}
                  />
                </div>
              </div>

              {/* Payment Notice */}
              <div
                style={{
                  background: "#223224",
                  border: "1px solid rgba(197, 160, 89, 0.25)",
                  borderRadius: "14px",
                  padding: "14px",
                  marginTop: "1.25rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#FAF7F2", display: "flex", alignItems: "center", gap: "6px" }}>
                    <ShieldCheck size={16} color="#8EA990" />
                    Official Razorpay Gateway
                  </span>
                  <span style={{ fontSize: "0.72rem", background: "rgba(197, 160, 89, 0.2)", color: "#DFBF80", padding: "2px 8px", borderRadius: "9999px", fontWeight: 700 }}>
                    Instant Confirmation
                  </span>
                </div>
                <p style={{ fontSize: "0.78rem", color: "#8EA990", margin: 0, lineHeight: 1.4 }}>
                  Secured transaction with instant digital invoice delivered upon confirmation.
                </p>
              </div>

              {bookingError && (
                <div
                  style={{
                    background: "rgba(220, 38, 38, 0.15)",
                    border: "1px solid rgba(220, 38, 38, 0.4)",
                    color: "#FCA5A5",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    fontSize: "0.85rem",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <AlertCircle size={16} color="#EF4444" style={{ flexShrink: 0 }} />
                  <span>{bookingError}</span>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button
                  type="button"
                  onClick={handleOnlinePayment}
                  disabled={submitting}
                  className="aloriga-pill-btn gold"
                  style={{
                    width: "100%",
                    padding: "13px",
                    fontSize: "0.92rem",
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  <CreditCard size={17} />
                  <span>{submitting ? "Opening Razorpay..." : `Confirm & Pay ₹${(category.price || 0).toLocaleString("en-IN")}`}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePayLaterBooking}
                  disabled={submitting}
                  className="aloriga-pill-btn outline"
                  style={{
                    width: "100%",
                    padding: "11px",
                    fontSize: "0.82rem",
                    color: "#8EA990",
                  }}
                >
                  Reserve with Pay on Approval (Pay Later)
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookNow;