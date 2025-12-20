import React from 'react';
import dynamic from "next/dynamic";

import UserActivitySection from "./components/UserActivitySection";
import UserActivityChart from './components/UserActivityChart';

async function getData(endpoint) {
  try {
    const res = await fetch(`http://192.168.21.245:9999/api/${endpoint}`, { 
      cache: "no-store",
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
    return res.json();
  } catch (err) {
    console.error(`Error fetching ${endpoint}:`, err);
    return [];
  }
}

export default async function HomePage() {
  const [nodes, alarms, users] = await Promise.all([
    getData("nodes"),
    getData("alarms"),
    getData("users")
  ]);

  // Pick one user (for dashboard and profile)
  const user = users.find(u => u.status?.toLowerCase() === "active") || users[0];

  // User login/logout timestamps
  const loginActions = (user?.actions || []).filter(a => a.action === "login");
  const logoutActions = (user?.actions || []).filter(a => a.action === "logout");

  const lastLogin = loginActions.length
    ? loginActions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0].timestamp
    : "--";

  const lastLogout = logoutActions.length
    ? logoutActions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0].timestamp
    : "--";

  // Stats calculations
  const nodeCounts = nodes.reduce(
    (acc, node) => {
      const status = node.status?.toUpperCase();
      if (status === "UP") acc.up++;
      else if (status === "DOWN") acc.down++;
      else acc.maintenance++;
      return acc;
    },
    { up: 0, down: 0, maintenance: 0 }
  );

  const alarmCounts = alarms.reduce(
    (acc, alarm) => {
      const sev = alarm.severity?.toLowerCase();
      if (sev === "critical") acc.critical++;
      else if (sev === "major") acc.major++;
      else if (sev === "minor") acc.minor++;
      acc.total++;
      return acc;
    },
    { critical: 0, major: 0, minor: 0, total: 0 }
  );

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status?.toLowerCase() === "active").length;
  const inactiveUsers = totalUsers - activeUsers;

  // Styles
  const cardStyle = {
    background: "rgba(30, 41, 59, 0.5)",
    borderRadius: "12px",
    padding: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    height: "520px",
    display: "flex",
    flexDirection: "column",
    flex: 1
  };

  const tableHeaderStyle = {
    position: "sticky",
    top: 0,
    background: "#1e293b",
    zIndex: 2,
    fontSize: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "#94a3b8",
    padding: "12px 10px",
    textAlign: "left",
    borderBottom: "2px solid rgba(255,255,255,0.05)"
  };

  const cellStyle = {
    padding: "10px",
    fontSize: "11px",
    borderBottom: "1px solid rgba(255,255,255,0.03)",
    color: "#e2e8f0"
  };

  return (
    <div style={{
      padding: "24px",
      fontFamily: "'Inter', sans-serif",
      color: "#f8fafc",
      minHeight: "100vh",
      background: "#0f172a",
    }}>
      
      {/* TOP STATS BAR */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <StatCard label="NODE UP" count={nodeCounts.up} color="#22c55e" />
        <StatCard label="NODE DOWN" count={nodeCounts.down} color="#ef4444" />
        <StatCard label="MAINTENANCE" count={nodeCounts.maintenance} color="#f97316" />
        <StatCard label="TOTAL ALARMS" count={alarmCounts.total} color="#0ea5e9" />
      </div>

      {/* MAIN CONTENT: LEFT (Alarms) + RIGHT (Node + User) */}
      <div style={{ display: "flex", gap: "20px", alignItems: "stretch" }}>

        {/* LEFT SIDE: ALARMS CARD */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "0.95rem", fontWeight: "600", margin: 0 }}>Active Alarms</h2>
            <div style={{ fontSize: "10px", color: "#64748b" }}>Live Updates</div>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "16px" }}>
            <AlarmChip label="Critical" count={alarmCounts.critical} color="#ef4444" />
            <AlarmChip label="Major" count={alarmCounts.major} color="#f97316" />
            <AlarmChip label="Minor" count={alarmCounts.minor} color="#eab308" />
          </div>

          <div style={{ overflowY: "auto", flex: 1, background: "rgba(0,0,0,0.1)", borderRadius: "8px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>Alarm Message</th>
                  <th style={{ ...tableHeaderStyle, textAlign: "center" }}>Severity</th>
                  <th style={{ ...tableHeaderStyle, textAlign: "right" }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {alarms.length ? alarms.map((alarm, i) => (
                  <tr key={i}>
                    <td style={cellStyle}>{alarm.message || alarm.alarm_type || "System Alert"}</td>
                    <td style={{ ...cellStyle, textAlign: "center" }}>
                      <span style={{ 
                        fontSize: "9px", 
                        padding: "2px 8px", 
                        borderRadius: "4px", 
                        background: alarm.severity?.toLowerCase() === 'critical' ? "rgba(239, 68, 68, 0.15)" : "rgba(249, 115, 22, 0.15)",
                        color: alarm.severity?.toLowerCase() === 'critical' ? "#ef4444" : "#f97316",
                        fontWeight: "600",
                        border: `1px solid ${alarm.severity?.toLowerCase() === 'critical' ? "#ef444444" : "#f9731644"}`
                      }}>
                        {alarm.severity}
                      </span>
                    </td>
                    <td style={{ ...cellStyle, textAlign: "right", color: "#64748b", fontSize: "10px" }}>{alarm.timestamp}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="3" style={{ ...cellStyle, textAlign: "center", opacity: 0.5 }}>No active alarms</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        

        {/* RIGHT SIDE: NODE + USER */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: "20px" }}>

          {/* NODE STATUS CARD */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "16px" }}>Node Status</h2>
            <div style={{
              overflowY: "auto",
              flex: 1,
              background: "rgba(0,0,0,0.1)",
              borderRadius: "8px",
              maxHeight: "465px"
            }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={tableHeaderStyle}>Node</th>
                    <th style={tableHeaderStyle}>IP</th>
                    <th style={{ ...tableHeaderStyle, textAlign: "center" }}>Status</th>
                    <th style={{ ...tableHeaderStyle, textAlign: "center" }}>Type</th>
                    <th style={{ ...tableHeaderStyle, textAlign: "center" }}>Region</th>
                    <th style={{ ...tableHeaderStyle, textAlign: "right" }}>Uptime</th>
                  </tr>
                </thead>
                <tbody>
                  {nodes.map((node, i) => (
                    <tr key={i}>
                      <td style={{ ...cellStyle, fontWeight: "500" }}>{node.name}</td>
                      <td style={{ ...cellStyle, color: "#94a3b8", fontFamily: "monospace", fontSize: "10px" }}>{node.ip}</td>
                      <td style={{ ...cellStyle, textAlign: "center" }}>
                        <span style={{ 
                          color: node.status?.toUpperCase() === "UP" ? "#22c55e" : node.status?.toUpperCase() === "DOWN" ? "#ef4444" : "#f97316",
                          fontWeight: "bold"
                        }}>
                          {node.status?.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ ...cellStyle, textAlign: "center", color: "#94a3b8" }}>{node.type}</td>
                      <td style={{ ...cellStyle, textAlign: "center", color: "#94a3b8" }}>{node.region}</td>
                      <td style={{ ...cellStyle, textAlign: "right", color: "#64748b", fontSize: "10px" }}>{node.uptime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* USER ACTIVITY CARD */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "16px" }}>User Activity</h2>

            {/* USER STATS */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "12px",
              marginBottom: "14px"
            }}>
              <UserMetric label="TOTAL USERS" value={totalUsers} color="#38bdf8" />
              <UserMetric label="ACTIVE USERS" value={activeUsers} color="#22c55e" />
              <UserMetric label="LAST LOGIN" value={lastLogin} color="#eab308" />
              <UserMetric label="LAST LOGOUT" value={lastLogout} color="#f97316" />
            </div>

            {/* USER ACTIVITY GRAPH */}
            <div style={{
              background: "rgba(15,23,42,0.25)",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "14px",
              height: "260px"
            }}>
              <div style={{
                fontSize: "10px",
                fontWeight: "700",
                letterSpacing: "0.6px",
                color: "#94a3b8",
                marginBottom: "6px"
              }}>
                USER STATUS OVERVIEW
              </div>

              <UserActivitySection
                activeUsers={activeUsers}
                inactiveUsers={inactiveUsers}
                totalUsers={totalUsers}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Sub-components
function StatCard({ label, count, color }) {
  return (
    <div style={{
      flex: 1,
      background: "rgba(30, 41, 59, 0.5)",
      padding: "16px",
      borderRadius: "12px",
      borderBottom: `4px solid ${color}`,
      textAlign: "center"
    }}>
      <div style={{ fontSize: "1.6rem", fontWeight: "800", color }}>{count}</div>
      <div style={{ fontSize: "10px", color: "#64748b", fontWeight: "700", letterSpacing: "1px" }}>{label}</div>
    </div>
  );
}

function AlarmChip({ label, count, color }) {
  return (
    <div style={{
      background: "rgba(15, 23, 42, 0.3)",
      padding: "8px 4px",
      borderRadius: "8px",
      border: `1px solid ${color}33`,
      textAlign: "center"
    }}>
      <div style={{ fontSize: "13px", fontWeight: "bold", color }}>{count}</div>
      <div style={{ fontSize: "9px", color: "#64748b", textTransform: "uppercase", marginTop: "2px" }}>{label}</div>
    </div>
  );
}

function UserMetric({ label, value, color }) {
  return (
    <div style={{
      background: "rgba(15,23,42,0.35)",
      borderRadius: "8px",
      padding: "10px",
      textAlign: "center",
      borderLeft: `4px solid ${color}`
    }}>
      <div style={{ fontSize: "13px", fontWeight: "700", color }}>{value}</div>
      <div style={{ fontSize: "9px", color: "#64748b", letterSpacing: "0.6px" }}>{label}</div>
    </div>
  );
}
