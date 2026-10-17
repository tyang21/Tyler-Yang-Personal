"use client"

import { useEffect, useRef, useState } from "react"
import { HEIGHT, TownSave, WIDTH } from "../lib/town/world"
import { ResidentView, VillageRenderer } from "../lib/town/renderer"

type Props = { now: Date; save: TownSave; selected?: string; onSelect: (id: string) => void; onResidents: (residents: ResidentView[]) => void }
export default function VillageViewport(props: Props) {
  const canvas = useRef<HTMLCanvasElement>(null), current = useRef(props), renderer = useRef<VillageRenderer | null>(null)
  current.current = props
  const camera = useRef({ x: WIDTH / 2, y: HEIGHT / 2, zoom: 1, follow: false, routes: false })
  const pointer = useRef<{ x: number; y: number; moved: boolean } | null>(null)
  const [follow, setFollow] = useState(false), [routes, setRoutes] = useState(false)
  const [tooltip, setTooltip] = useState<{ title: string; detail: string; x: number; y: number } | null>(null)
  const [view, setView] = useState({ outdoor: 0, walking: 0 })
  function transform() {
    const c = canvas.current!, r = c.getBoundingClientRect(), scale = Math.min(r.width / WIDTH, r.height / HEIGHT) * camera.current.zoom
    return { scale, ox: r.width / 2 - camera.current.x * scale, oy: r.height / 2 - camera.current.y * scale }
  }
  function worldPoint(e: { clientX: number; clientY: number }) {
    const r = canvas.current!.getBoundingClientRect(), t = transform()
    return { x: (e.clientX - r.left - t.ox) / t.scale, y: (e.clientY - r.top - t.oy) / t.scale }
  }
  function zoom(by: number) { camera.current.zoom = Math.max(.85, Math.min(3.5, camera.current.zoom * by)); setTooltip(null) }
  useEffect(() => {
    const c = canvas.current!, ctx = c.getContext("2d")!
    const village = new VillageRenderer(current.current.now, current.current.save); renderer.current = village
    let raf = 0, last = performance.now(), report = last - 1000
    const resize = () => { const r = c.getBoundingClientRect(), dpr = window.devicePixelRatio || 1; c.width = Math.round(r.width * dpr); c.height = Math.round(r.height * dpr) }
    const observer = new ResizeObserver(resize); observer.observe(c); resize()
    const frame = (time: number) => {
      const dt = Math.min(.06, (time - last) / 1000); last = time
      const p = current.current; village.update(dt, p.now, p.save)
      if (camera.current.follow && p.selected) {
        const person = village.actors.find(a => a.villager.id === p.selected)
        if (person) { camera.current.x += (person.x - camera.current.x) * .06; camera.current.y += (person.y - 100 - camera.current.y) * .06 }
      }
      const r = c.getBoundingClientRect(), dpr = window.devicePixelRatio || 1, t = transform()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = "#a6b377"; ctx.fillRect(0, 0, r.width, r.height)
      ctx.setTransform(dpr * t.scale, 0, 0, dpr * t.scale, dpr * t.ox, dpr * t.oy)
      village.render(ctx, p.selected, camera.current.routes)
      if (time - report >= 700) { const residents = village.residents(); p.onResidents(residents); setView({ outdoor: residents.filter(a => !a.indoors).length, walking: residents.filter(a => a.walking).length }); report = time }
      raf = requestAnimationFrame(frame)
    }
    frame(performance.now())
    const wheel = (e: WheelEvent) => { e.preventDefault(); zoom(e.deltaY > 0 ? .93 : 1.07) }
    c.addEventListener("wheel", wheel, { passive: false })
    return () => { cancelAnimationFrame(raf); observer.disconnect(); c.removeEventListener("wheel", wheel); renderer.current = null }
  }, [])
  return <div className="village-viewport">
    <div className="village-map-title"><span><i /> VILLAGE VIEW</span><span>Drag to explore · scroll to zoom</span></div>
    <div className="village-canvas-wrap">
      <canvas ref={canvas} aria-label="Pixel-art village map. Select residents using the People panel, or click a villager on the map." onPointerDown={e => { pointer.current = { x: e.clientX, y: e.clientY, moved: false }; e.currentTarget.setPointerCapture(e.pointerId) }} onPointerMove={e => {
        const drag = pointer.current
        if (drag) {
          const dx = e.clientX - drag.x, dy = e.clientY - drag.y
          if (Math.abs(dx) + Math.abs(dy) > 2) { drag.moved = true; camera.current.follow = false; setFollow(false); const t = transform(); camera.current.x -= dx / t.scale; camera.current.y -= dy / t.scale; camera.current.x = Math.max(0, Math.min(WIDTH, camera.current.x)); camera.current.y = Math.max(0, Math.min(HEIGHT, camera.current.y)); drag.x = e.clientX; drag.y = e.clientY; setTooltip(null) }
          return
        }
        const world = worldPoint(e), village = renderer.current
        if (!village) return
        const id = village.hit(world.x, world.y), b = village.buildingAt(world.x, world.y), r = e.currentTarget.getBoundingClientRect()
        if (id) {
          const person = current.current.save.villagers.find(p => p.id === id)!, status = village.residents().find(p => p.id === id)!
          setTooltip({ title: person.name, detail: status.activity, x: Math.min(e.clientX - r.left + 12, r.width - 230), y: e.clientY - r.top - 65 })
        } else if (b) {
          const occupants = village.actors.filter(a => a.inside && a.goal.target.x === b.door.x && a.goal.target.y === b.door.y).map(a => a.villager.name.split(" ")[0])
          setTooltip({ title: b.name, detail: occupants.length ? `Inside: ${occupants.join(", ")}` : "A quiet moment here", x: Math.min(e.clientX - r.left + 12, r.width - 230), y: e.clientY - r.top - 65 })
        } else setTooltip(null)
      }} onPointerUp={e => {
        const drag = pointer.current; pointer.current = null
        if (drag && !drag.moved) { const p = worldPoint(e), id = renderer.current?.hit(p.x, p.y); if (id) props.onSelect(id) }
        e.currentTarget.releasePointerCapture(e.pointerId)
      }} onPointerCancel={() => { pointer.current = null }} onPointerLeave={() => setTooltip(null)} />
      {tooltip && <div className="village-tooltip" style={{ left: Math.max(8, tooltip.x), top: Math.max(8, tooltip.y) }}><strong>{tooltip.title}</strong><span>{tooltip.detail}</span></div>}
      <div className="village-map-controls" aria-label="Map controls"><button onClick={() => zoom(1.25)} aria-label="Zoom in">+</button><button onClick={() => zoom(.8)} aria-label="Zoom out">−</button><button onClick={() => { camera.current = { ...camera.current, x: WIDTH / 2, y: HEIGHT / 2, zoom: 1, follow: false }; setFollow(false) }}>Fit</button></div>
      <div className="village-map-caption"><span>● {view.outdoor} outside</span><span>{view.walking} on the move</span></div>
    </div>
    <div className="village-map-footer"><span>Every lane leads somewhere.</span><div><button aria-pressed={routes} onClick={() => { camera.current.routes = !routes; setRoutes(!routes) }}>Show route</button><button disabled={!props.selected} aria-pressed={follow} onClick={() => { camera.current.follow = !follow; setFollow(!follow); if (!follow) camera.current.zoom = 1.8 }}>Follow villager</button></div></div>
  </div>
}
