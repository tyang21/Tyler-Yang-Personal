"use client"

import { useEffect, useRef } from "react"

export type Resident = {
  id: string
  name: string
  role: string
  color: string
  schedule: string
  activity: string
  location: string
}

const residents: Resident[] = [
  { id: "mara", name: "Mara Bell", role: "library director", color: "#d85b69", schedule: "Weekdays · 9 AM–5 PM at the library", activity: "sorting returns and setting up the reading room", location: "Library" },
  { id: "elias", name: "Elias Cho", role: "civil engineer", color: "#487fb3", schedule: "Weekdays · 7 AM–4 PM at Main Street", activity: "checking the crossing layout with the crew", location: "Main Street" },
  { id: "nina", name: "Nina Patel", role: "baker & organizer", color: "#c27a50", schedule: "Tuesday–Saturday · 6 AM–3 PM at the market", activity: "pulling bread from the oven and stocking the community fridge", location: "Chestnut Market" },
  { id: "ruth", name: "Ruth Alvarez", role: "art teacher", color: "#7d5ba6", schedule: "Weekdays · 8 AM–4 PM at school", activity: "walking students to sketch the creek garden", location: "East Whiteland School" },
  { id: "jules", name: "Jules Okafor", role: "watershed steward", color: "#4e9b7e", schedule: "Tuesday & Thursday · 10 AM–2 PM at the creek", activity: "logging water levels and checking native plants", location: "Valley Creek" },
]

const places: Record<string, [number, number]> = {
  "Library": [220, 185], "Main Street": [456, 315], "Chestnut Market": [233, 405], "East Whiteland School": [680, 184], "Valley Creek": [686, 425], "Home": [120, 450],
}

function localHour(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour: "numeric", weekday: "long", hour12: false }).formatToParts(now)
  const get = (name: string) => parts.find((part) => part.type === name)?.value ?? ""
  return { hour: Number(get("hour")), weekday: get("weekday") }
}

function currentLocation(resident: Resident, now: Date) {
  const { hour, weekday } = localHour(now)
  const workday = !["Saturday", "Sunday"].includes(weekday)
  if (resident.id === "mara" && workday && hour >= 9 && hour < 17) return "Library"
  if (resident.id === "elias" && workday && hour >= 7 && hour < 16) return "Main Street"
  if (resident.id === "nina" && !["Sunday", "Monday"].includes(weekday) && hour >= 6 && hour < 15) return "Chestnut Market"
  if (resident.id === "ruth" && workday && hour >= 8 && hour < 16) return "East Whiteland School"
  if (resident.id === "jules" && ["Tuesday", "Thursday"].includes(weekday) && hour >= 10 && hour < 14) return "Valley Creek"
  return "Home"
}

function drawBuilding(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, wall: string, roof: string, label: string) {
  ctx.fillStyle = "rgba(45,75,55,.18)"; ctx.beginPath(); ctx.ellipse(x + width / 2, y + height + 13, width * .6, 12, 0, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = wall; ctx.fillRect(x, y + 25, width, height - 25)
  ctx.fillStyle = roof; ctx.beginPath(); ctx.moveTo(x - 8, y + 28); ctx.lineTo(x + width / 2, y); ctx.lineTo(x + width + 8, y + 28); ctx.closePath(); ctx.fill()
  ctx.fillStyle = "#ffecc1"; ctx.fillRect(x + width * .17, y + 45, 15, 17); ctx.fillRect(x + width * .65, y + 45, 15, 17)
  ctx.fillStyle = "#865a48"; ctx.fillRect(x + width / 2 - 9, y + height - 31, 18, 31)
  ctx.fillStyle = "#426044"; ctx.font = "600 12px ui-monospace, monospace"; ctx.textAlign = "center"; ctx.fillText(label.toUpperCase(), x + width / 2, y + height + 28)
}

function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, autumn: boolean) {
  ctx.fillStyle = "#6e4c36"; ctx.fillRect(x - 4 * scale, y, 8 * scale, 24 * scale)
  const color = autumn ? ["#d78952", "#c9674f", "#e2ad5b"] : ["#7cad62", "#659455", "#97ba70"]
  color.forEach((fill, i) => { ctx.fillStyle = fill; ctx.beginPath(); ctx.arc(x + (i - 1) * 10 * scale, y - 8 * scale - (i % 2) * 7 * scale, 15 * scale, 0, Math.PI * 2); ctx.fill() })
}

export default function TownCanvas({ now, onResident }: { now: Date; onResident: (resident: Resident) => void }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const residentHits = useRef<{ resident: Resident; x: number; y: number }[]>([])

  useEffect(() => {
    const element = canvas.current; if (!element) return
    const ctx = element.getContext("2d"); if (!ctx) return
    let frame = 0; let animation = 0
    const render = () => {
      frame += 1
      const autumn = [9, 10, 11].includes(Number(new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", month: "numeric" }).format(now)))
      ctx.clearRect(0, 0, 900, 570)
      ctx.fillStyle = "#b9d995"; ctx.fillRect(0, 0, 900, 570)
      ctx.fillStyle = "#a7ca80"; for (let x = 10; x < 900; x += 38) for (let y = 15; y < 570; y += 34) { ctx.fillRect(x + (y % 5), y, 2, 7) }
      ctx.strokeStyle = "#8ac6d0"; ctx.lineWidth = 47; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(620, 590); ctx.bezierCurveTo(680, 480, 740, 460, 726, 355); ctx.bezierCurveTo(713, 257, 823, 211, 892, 160); ctx.stroke()
      ctx.strokeStyle = "#dcbb8d"; ctx.lineWidth = 54; ctx.beginPath(); ctx.moveTo(-30, 335); ctx.bezierCurveTo(176, 271, 281, 350, 447, 310); ctx.bezierCurveTo(616, 270, 705, 310, 932, 230); ctx.stroke()
      ctx.strokeStyle = "#f5e2bd"; ctx.lineWidth = 35; ctx.setLineDash([3, 5]); ctx.beginPath(); ctx.moveTo(-30, 335); ctx.bezierCurveTo(176, 271, 281, 350, 447, 310); ctx.bezierCurveTo(616, 270, 705, 310, 932, 230); ctx.stroke(); ctx.setLineDash([])
      ctx.strokeStyle = "#f5e2bd"; ctx.lineWidth = 31; ctx.beginPath(); ctx.moveTo(455, -20); ctx.bezierCurveTo(438, 145, 474, 232, 454, 342); ctx.stroke()
      drawBuilding(ctx, 150, 105, 140, 110, "#e7b46e", "#c96355", "Library")
      drawBuilding(ctx, 610, 105, 145, 112, "#9ebbd0", "#657aa4", "School")
      drawBuilding(ctx, 155, 360, 145, 105, "#ecc579", "#b87357", "Market")
      ctx.fillStyle = "#d2aa71"; ctx.fillRect(390, 270, 140, 86); ctx.fillStyle = "#8d654c"; ctx.fillRect(402, 286, 116, 9)
      ctx.strokeStyle = "#805c44"; ctx.lineWidth = 6; ctx.strokeRect(402, 278, 116, 80)
      ctx.fillStyle = "#4d6e49"; ctx.font = "600 12px ui-monospace, monospace"; ctx.textAlign = "center"; ctx.fillText("WALKABLE MAIN", 460, 383)
      ;[[75, 120, 1.1], [330, 100, .9], [820, 98, 1.1], [810, 420, 1], [80, 465, 1.1], [575, 455, .85], [330, 478, .8]].forEach(([x, y, s]) => drawTree(ctx, x, y, s, autumn))
      residentHits.current = []
      residents.forEach((resident, index) => {
        const place = places[currentLocation(resident, now)]; const wobble = Math.sin(frame / 16 + index) * 3; const x = place[0] + (index - 2) * 14; const y = place[1] + wobble
        ctx.fillStyle = "rgba(40,67,47,.18)"; ctx.beginPath(); ctx.ellipse(x, y + 15, 10, 4, 0, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = "#f1bf9c"; ctx.beginPath(); ctx.arc(x, y - 9, 7, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = resident.color; ctx.beginPath(); ctx.roundRect(x - 8, y - 3, 16, 17, 5); ctx.fill()
        ctx.strokeStyle = "#453a42"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 5, y + 14); ctx.lineTo(x - 6, y + 20); ctx.moveTo(x + 5, y + 14); ctx.lineTo(x + 6, y + 20); ctx.stroke()
        residentHits.current.push({ resident, x, y })
      })
      ctx.fillStyle = "#fff8df"; ctx.fillRect(23, 23, 210, 55); ctx.fillStyle = "#3d5e45"; ctx.textAlign = "left"; ctx.font = "700 13px ui-monospace, monospace"; ctx.fillText("EXTON TOWN VIEW", 38, 46); ctx.font = "12px ui-monospace, monospace"; ctx.fillText("click a resident to follow them", 38, 66)
      animation = requestAnimationFrame(render)
    }
    render(); return () => cancelAnimationFrame(animation)
  }, [now])

  return <canvas ref={canvas} width="900" height="570" className="block w-full rounded-[1.5rem] bg-[#b9d995]" onClick={(event) => { const rect = event.currentTarget.getBoundingClientRect(); const x = (event.clientX - rect.left) * 900 / rect.width; const y = (event.clientY - rect.top) * 570 / rect.height; const hit = residentHits.current.find(({ x: px, y: py }) => Math.hypot(x - px, y - py) < 25); if (hit) onResident(hit.resident) }} />
}

export { residents, currentLocation }
