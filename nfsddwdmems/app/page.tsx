async function getNodes() {
  try {
    const res = await fetch("http://192.168.21.245:9999/api/nodes", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch nodes");
    return res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default async function HomePage() {
  const nodes = await getNodes();

  const counts = nodes.reduce(
    (acc, node) => {
      const status = node.status?.toUpperCase();
      if (status === "UP") acc.up++;
      else if (status === "DOWN") acc.down++;
      else acc.maintenance++;
      return acc;
    },
    { up: 0, down: 0, maintenance: 0 }
  );

  const columnStyle = { padding: "12px", textAlign: "left", minWidth: "120px" };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "'Inter', sans-serif",
        color: "#fff",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      }}
    >
      
        <div style={{ display: "flex", gap: "16px", justifyContent: "space-between", marginTop: "20px" }}>
          <div
            style={{
              flex: 1,
              background: "rgba(25,135,84,0.2)",
              padding: "14px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#198754" }}>{counts.up}</div>
            <div> UP</div>
          </div>
          <div
            style={{
              flex: 1,
              background: "rgba(220,53,69,0.2)",
              padding: "14px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#dc3545" }}>{counts.down}</div>
            <div> DOWN</div>
          </div>
          <div
            style={{
              flex: 1,
              background: "rgba(253,126,20,0.2)",
              padding: "14px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#fd7e14" }}>{counts.maintenance}</div>
            <div> MAINTENANCE</div>
          </div>
        </div>
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: "16px",
          padding: "20px",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          marginTop: "32px"
        }}
      >
        <h2 style={{ marginBottom: "16px" }}>Node Status </h2>

      
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ display: "table", width: "100%", tableLayout: "fixed", background: "rgba(13,110,253,0.15)" }}>
              <tr>
                <th style={columnStyle}>Node Name</th>
                <th style={columnStyle}>IP</th>
                <th style={columnStyle}>Status</th>
                <th style={columnStyle}>Type</th>
                <th style={columnStyle}>Region</th>
                <th style={columnStyle}>Uptime</th>
              </tr>
            </thead>
            <tbody style={{ display: "block", maxHeight: "400px", overflowY: "auto" }}>
              {nodes.map((node) => (
                <tr key={node.id} style={{ display: "table", width: "100%", tableLayout: "fixed", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <td style={columnStyle}>{node.name}</td>
                  <td style={columnStyle}>{node.ip}</td>
                  <td
                    style={{
                      ...columnStyle,
                      fontWeight: "bold",
                      color:
                        node.status?.toUpperCase() === "UP"
                          ? "#198754"
                          : node.status?.toUpperCase() === "DOWN"
                          ? "#dc3545"
                          : "#fd7e14",
                    }}
                  >
                    {node.status?.toUpperCase()}
                  </td>
                  <td style={columnStyle}>{node.type}</td>
                  <td style={columnStyle}>{node.region}</td>
                  <td style={columnStyle}>{node.uptime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        

      </div>
    </div>
  );
}
