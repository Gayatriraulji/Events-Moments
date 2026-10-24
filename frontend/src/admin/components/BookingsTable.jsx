import React from "react";

const BookingsTable = ({ bookings }) => {
  return (
    <div style={{ background: "#fff", borderRadius: "16px", padding: "1.1rem 1.25rem", flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <p style={{ fontWeight: 500, fontSize: "14px", margin: 0, color: "#333" }}>
          Recent bookings
        </p>
        <div style={{ display: "flex", gap: "4px" }}>
          <span style={{ background: "#1A1A1A", color: "#fff", fontSize: "11px", padding: "4px 10px", borderRadius: "8px" }}>1D</span>
          <span style={{ color: "#888", fontSize: "11px", padding: "4px 10px" }}>1W</span>
          <span style={{ color: "#888", fontSize: "11px", padding: "4px 10px" }}>1M</span>
        </div>
      </div>

      <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ color: "#999", textAlign: "left" }}>
            <th style={{ fontWeight: 400, paddingBottom: "10px" }}>Customer</th>
            <th style={{ fontWeight: 400 }}>Package</th>
            <th style={{ fontWeight: 400 }}>Amount paid</th>
            <th style={{ fontWeight: 400 }}>Booking progress</th>
            <th style={{ fontWeight: 400, textAlign: "right" }}>Guests</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, i) => (
            <tr key={i}>
              <td style={{ padding: "8px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "9px",
                    background: b.avatarColor,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                  }}
                >
                  {b.initials}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "13px", color: "#222" }}>{b.name}</p>
                  <p style={{ margin: 0, fontSize: "11px", color: "#999" }}>{b.eventType}</p>
                </div>
              </td>
              <td>{b.package}</td>
              <td>
                {b.amount} <span style={{ color: "#3AA45B", fontSize: "11px" }}>▲{b.amountChange}</span>
              </td>
              <td>
                <div style={{ background: "#E5E5EA", width: "110px", height: "6px", borderRadius: "4px" }}>
                  <div
                    style={{
                      background: b.progressColor,
                      width: `${b.progress}%`,
                      height: "100%",
                      borderRadius: "4px",
                    }}
                  ></div>
                </div>
              </td>
              <td style={{ textAlign: "right" }}>{b.guests}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsTable;