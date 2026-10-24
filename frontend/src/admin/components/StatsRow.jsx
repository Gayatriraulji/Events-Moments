import React from "react";

const StatItem = ({ dotColor, label, value, change, changeType }) => (
  <div>
    <p style={{ fontSize: "12px", color: "#888", margin: "0 0 4px" }}>
      <span
        style={{
          display: "inline-block",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: dotColor,
          marginRight: "5px",
        }}
      ></span>
      {label}
    </p>
    <p style={{ fontSize: "22px", fontWeight: 500, margin: 0 }}>
      {value}{" "}
      <span
        style={{
          fontSize: "11px",
          color: changeType === "down" ? "#E2685A" : "#3AA45B",
        }}
      >
        {changeType === "down" ? "▼" : "▲"}
        {change}
      </span>
    </p>
  </div>
);

const StatsRow = ({ stats }) => {
  return (
    <div
      style={{
        flex: 1.4,
        background: "#fff",
        borderRadius: "16px",
        padding: "1.1rem 1.25rem",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {stats.map((s) => (
        <StatItem key={s.label} {...s} />
      ))}
    </div>
  );
};

export default StatsRow;