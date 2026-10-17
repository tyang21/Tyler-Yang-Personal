"use client"

import { useEffect, useRef, useState } from "react"
import { PEOPLE, PROJECTS, SAVE_KEY, TownSave, holidayAt, localParts, migrateSave, moonAt, plan, seasonAt, solarAltitude, weatherAt } from "../lib/town/world"
import type { ResidentView } from "../lib/town/renderer"
import VillageViewport from "./VillageViewport"

const format = (date: Date, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", ...options }).format(date)
function daySunTimes(date: Date) {
  const p = localParts(date), start = Date.UTC(p.year, p.month - 1, p.day, 4)
  let rise: Date | null = null, set: Date | null = null, previous = solarAltitude(new Date(start))
  for (let minute = 5; minute <= 1440; minute += 5) {
    const time = start + minute * 60000, altitude = solarAltitude(new Date(time))
    if (previous < -.833 && altitude >= -.833) rise = new Date(time - 300000 + (-.833 - previous) / (altitude - previous) * 300000)
    if (previous >= -.833 && altitude < -.833) set = new Date(time - 300000 + (-.833 - previous) / (altitude - previous) * 300000)
    previous = altitude
  }
  return { rise: rise ? format(rise, { hour: "numeric", minute: "2-digit" }) : "—", set: set ? format(set, { hour: "numeric", minute: "2-digit" }) : "—" }
}

export default function IdleTown() {
  const [save, setSave] = useState<TownSave | null>(null), [now, setNow] = useState<Date | null>(null)
  const [tab, setTab] = useState("Today"), [picked, setPicked] = useState(PEOPLE[0].id)
  const [residents, setResidents] = useState<ResidentView[]>([]), [welcome, setWelcome] = useState("")
  const [preview, setPreview] = useState(false), [saveError, setSaveError] = useState(false)
  const latest = useRef<TownSave | null>(null), previewRef = useRef(false)
  latest.current = save
  useEffect(() => {
    let loaded: TownSave
    try { loaded = migrateSave(JSON.parse(localStorage.getItem(SAVE_KEY) || "null")) } catch { loaded = migrateSave(null) }
    const params = new URLSearchParams(window.location.search), input = params.get("date")
    const supplied = input ? new Date(input) : null, isPreview = !!supplied && Number.isFinite(supplied.getTime())
    previewRef.current = isPreview; setPreview(isPreview)
    const past = Date.now() - new Date(loaded.cursor).getTime()
    if (!isPreview && past > 1800000) setWelcome(`Welcome back. It’s been ${Math.floor(past / 86400000)}d ${Math.floor(past / 3600000) % 24}h since your last visit.`)
    setSave(loaded); setNow(isPreview ? supplied : new Date())
    const tick = () => { if (!previewRef.current) setNow(new Date()) }
    const persist = () => {
      if (!latest.current || previewRef.current) return
      try { localStorage.setItem(SAVE_KEY, JSON.stringify({ ...latest.current, cursor: new Date().toISOString() })) } catch { setSaveError(true) }
    }
    const timer = window.setInterval(tick, 1000), saver = window.setInterval(persist, 15000)
    const visibility = () => { if (document.visibilityState === "hidden") persist(); else tick() }
    document.addEventListener("visibilitychange", visibility); window.addEventListener("pagehide", persist)
    return () => { clearInterval(timer); clearInterval(saver); document.removeEventListener("visibilitychange", visibility); window.removeEventListener("pagehide", persist); persist() }
  }, [])
  if (!save || !now) return <div className="village-loading"><span>✦</span> Opening the village gates…</div>
  const weather = weatherAt(now, save.seed), season = seasonAt(now), person = save.villagers.find(v => v.id === picked) || save.villagers[0], activity = plan(person, now, save.forced), status = residents.find(r => r.id === picked)
  const outside = residents.filter(r => !r.indoors).length, holiday = holidayAt(now), sun = daySunTimes(now), moon = moonAt(now)
  const activeProject = save.projects.findIndex(points => points < 650), currentProject = activeProject === -1 ? save.projects.length - 1 : activeProject
  const progress = Math.min(100, Math.round((save.projects[currentProject] || 0) / 650 * 100))
  const select = (id: string) => { setPicked(id); setTab("People") }
  const force = () => {
    const forced = { ...save.forced }, isForced = forced[person.id] > now.getTime()
    if (isForced) delete forced[person.id]; else forced[person.id] = now.getTime() + 7200000
    setSave({ ...save, forced, log: [{ at: now.toISOString(), text: `${person.name} ${isForced ? "is off the clock again." : "was asked to help at the work site."}`, kind: "town" }, ...save.log].slice(0, 250) })
  }
  const daytime = localParts(now)
  const daylightPreview = new Date(Date.UTC(daytime.year, daytime.month - 1, daytime.day, 16)).toISOString()
  return <div className="village-app">
    <header className="village-header"><div className="village-brand-mark" aria-hidden="true">✳</div><div><p>AN EVERYDAY LITTLE WORLD</p><h1>Exton Village<span>est. one ordinary day</span></h1></div><div className="village-live"><i /> {preview ? "DATE PREVIEW" : "LIVING ON LOCAL TIME"}<span>Chester County, Pennsylvania</span></div></header>
    <div className="village-hud"><div><span className="village-hud-symbol">◷</span><div><strong>{format(now, { hour: "numeric", minute: "2-digit" })}</strong><span>{format(now, { weekday: "short", month: "long", day: "numeric", year: "numeric" })}</span></div></div><div><span className="village-hud-symbol">{season === "Autumn" ? "❧" : season === "Winter" ? "❄" : "✿"}</span><div><strong>{season} in the village</strong><span>{holiday || "A little different, every day"}</span></div></div><div><span className="village-hud-symbol">{weather.label === "Rain" ? "☂" : weather.label === "Clear" ? "☀" : "☁"}</span><div><strong>{weather.temp}°F <small>{weather.label}</small></strong><span>Sunset at {sun.set}</span></div></div></div>
    {preview && <div className="village-notice">You’re viewing a date preview. Your saved town is untouched. <a href="/town">Return to live town →</a></div>}
    {welcome && <button className="village-notice village-welcome" onClick={() => setWelcome("")}>{welcome}<span>Dismiss ×</span></button>}
    {saveError && <div className="village-notice">Your browser couldn’t save this visit. Check whether local storage is enabled.</div>}
    <div className="village-layout"><VillageViewport now={now} save={save} selected={picked} onSelect={select} onResidents={setResidents} />
      <aside className="village-journal"><nav className="village-tabs" aria-label="Town journal">{["Today", "People", "Journal"].map(t => <button key={t} onClick={() => setTab(t)} aria-pressed={tab === t}>{t}</button>)}</nav>
        {tab === "Today" && <div className="village-panel-content"><p className="village-eyebrow">THE DAILY ROUND</p><h2>{holiday || "Small things,\ncoming together."}</h2><p className="village-description">Fresh bread on the counter. Footsteps on the lane. There’s a whole day happening here.</p>
          <div className="village-day-stats"><div><b>{outside}</b><span>out & about</span></div><div><b>{save.villagers.length - outside}</b><span>tucked inside</span></div><div><b>{save.villagers.length}</b><span>neighbors</span></div></div>
          <div className="village-project"><p className="village-eyebrow">ON THE WORKBENCH</p><h3>{PROJECTS[currentProject]}</h3><p>The next shared place is taking shape beside the village green.</p><div className="village-progress"><i style={{ width: `${progress}%` }} /></div><div className="village-project-foot"><span>{progress === 0 ? "Groundwork begins" : "Work in progress"}</span><b>{progress}%</b></div></div>
          <div className="village-almanac"><span>☀ Sunrise <b>{sun.rise}</b></span><span>☾ Sunset <b>{sun.set}</b></span><span>{moon.name}<b>{moon.illumination}% illuminated</b></span></div><p className="village-panel-tip">Click a neighbor to see what they’re up to. Follow them through the village, or turn on their route.</p>{solarAltitude(now) < 0 && !preview && <a className="village-preview-link" href={`/town?date=${encodeURIComponent(daylightPreview)}`}>Take a daylight peek ↗</a>}
        </div>}
        {tab === "People" && <div className="village-panel-content"><div className="village-person-heading"><canvas className="village-avatar" width="40" height="48" ref={element => { if (!element) return; const c = element.getContext("2d"); if (!c) return; c.clearRect(0, 0, 40, 48); c.fillStyle = person.color; c.fillRect(10, 24, 20, 19); c.fillStyle = "#dfb68a"; c.fillRect(12, 9, 16, 16); c.fillStyle = "#554336"; c.fillRect(11, 7, 18, 5); c.fillStyle = "#403d37"; c.fillRect(15, 18, 2, 2); c.fillRect(24, 18, 2, 2) }} /><div><p className="village-eyebrow">YOUR NEIGHBOR</p><h2>{person.name}</h2><p>{person.job} · {person.pronouns}</p></div></div><div className="village-activity"><span className="village-eyebrow">{status?.walking ? "ON THEIR WAY" : status?.indoors ? "INSIDE" : "RIGHT NOW"}</span><strong>{status?.activity || activity.label}</strong><span>{activity.place}</span></div><div className="village-traits">{person.traits.map(t => <span key={t}>{t}</span>)}</div><p className="village-person-fact">⌂ {person.home}<br />♡ {person.interests.join(" & ")}</p><button className="village-work-button" onClick={force}>{save.forced[person.id] > now.getTime() ? "Let them off work" : "Ask for help at the work site"}</button>
          <div className="village-roster"><p className="village-eyebrow">AROUND THE VILLAGE</p>{save.villagers.map(v => { const s = residents.find(r => r.id === v.id); return <button key={v.id} aria-pressed={v.id === picked} onClick={() => setPicked(v.id)}><i style={{ background: v.color }} /><span><strong>{v.name}</strong><small>{s?.walking ? "Walking to " : s?.indoors ? "Inside · " : ""}{plan(v, now, save.forced).place}</small></span><em>{v.id === picked ? "↗" : "›"}</em></button> })}</div>
        </div>}
        {tab === "Journal" && <div className="village-panel-content"><p className="village-eyebrow">THE VILLAGE REMEMBERS</p><h2>{"Notes from\nthe neighborhood."}</h2><div className="village-log">{save.log.map((entry, i) => <article key={`${entry.at}-${i}`}><time>{format(new Date(entry.at), { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</time><p>{entry.text}</p></article>)}</div></div>}
      </aside>
    </div><footer className="village-bottom-note"><span>⌂ A window into village life</span><span>{preview ? "Preview · changes are not saved" : "Town clock: America/New_York · saved on this browser"}</span></footer>
  </div>
}
