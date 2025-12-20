"use client";

import UserActivityChart from "./UserActivityChart";

export default function UserActivitySection({ activeUsers, inactiveUsers, totalUsers }) {
  return (
    <div
      style={{
        background: "rgba(15,23,42,0.25)",
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "14px",
        height: "300px",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          fontWeight: 700,
          color: "#94a3b8",
          marginBottom: "6px",
          letterSpacing: "0.6px"
        }}
      >
        
      </div>

      <UserActivityChart
        active={activeUsers}
        inactive={inactiveUsers}
        total={totalUsers}
      />
    </div>
  );
}
