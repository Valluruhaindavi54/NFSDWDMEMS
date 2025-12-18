"use client"
import { useEffect, useState } from "react"

type Node = {
  name: string
  status: "ok" | "warn" | "down"
  traffic: number
  alarms: number
  power: number
  temp: number
}

export default function NodeCard() {
  const [nodes, setNodes] = useState<Node[]>([])

  useEffect(() => {
    async function fetchNodes() {
      try {
        // TODO: replace with real API once accessible
        const res = await fetch('http://192.168.21.245:9999/api/nodes')
         const data = await res.json()

        
        setNodes(data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchNodes()
  }, [])

  return (
    <table>
      <thead>
        <tr>
          <th>Node</th>
          <th>Status</th>
          <th>Traffic</th>
          <th>Alarms</th>
          <th>Power</th>
          <th>Temp</th>
        </tr>
      </thead>
      <tbody>
        {nodes.map((n) => (
          <tr key={n.name}>
            <td>{n.name}</td>
            <td>
              <span className={`status ${n.status}`}>{n.status.toUpperCase()}</span>
            </td>
            <td>{n.traffic}</td>
            <td>{n.alarms}</td>
            <td>{n.power}</td>
            <td>{n.temp}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
