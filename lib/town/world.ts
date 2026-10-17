export const TILE = 16
export const COLS = 64
export const ROWS = 44
export const WIDTH = COLS * TILE
export const HEIGHT = ROWS * TILE
export type Point = { x: number; y: number }
export type Season = "Spring" | "Summer" | "Autumn" | "Winter"
export type Building = { id: string; name: string; x: number; y: number; w: number; h: number; wall: string; roof: string; kind: "home" | "library" | "market" | "school" | "workshop"; door: Point }
export type Villager = { id: string; name: string; pronouns: string; job: string; home: string; traits: string[]; interests: string[]; birth: string; color: string; wake: number; bed: number }
export type Plan = { place: string; label: string; target: Point; indoors: boolean; working: boolean }
export type TownSave = { version: number; cursor: string; villagers: Villager[]; affinity: Record<string, number>; projects: number[]; log: { at: string; text: string; kind: string }[]; seed: number; forced: Record<string, number> }
export const SAVE_KEY = "tyler-idle-town-v2"
export const PROJECTS = ["Village flower beds", "Street lamps", "Picnic tables", "Town fountain", "Greenhouse", "Bandstand", "Clock tower", "Cobbled roads", "Windmill", "Town statue"]

export function random(key: string) {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 16777619)
  h ^= h >>> 16; h = Math.imul(h, 0x7feb352d); h ^= h >>> 15
  return (h >>> 0) / 4294967296
}

const names = ["Mara Bell", "Elias Cho", "Nina Patel", "Ruth Alvarez", "Jules Okafor", "Ben Carter", "Zoe Kim", "Darnell Price", "Ivy Morgan", "Samir Khan", "Claire Wu", "Tom Reyes"]
const jobs = ["librarian", "civil engineer", "baker", "teacher", "watershed steward", "carpenter", "nurse", "gardener", "mechanic", "barista", "artist", "groundskeeper"]
const homes = ["Willow Cottage", "Maple House", "Chestnut Row", "Fern House", "Creekside", "Oak Cottage", "Hill House", "Orchard Lane", "Station Flat", "Chestnut Row", "Pine Cottage", "Town Edge"]
const colors = ["#ca5264", "#4e7faa", "#c58b46", "#8770ad", "#4e9279", "#ad6b48", "#db8a9e", "#63864a", "#d9ac4e", "#65a1ae", "#9e6ba0", "#748a56"]
export const PEOPLE: Villager[] = names.map((name, i) => ({ id: name.split(" ")[0].toLowerCase(), name, pronouns: i === 4 ? "they/them" : i % 2 ? "he/him" : "she/her", job: jobs[i], home: homes[i], traits: i % 3 === 0 ? ["kind", "early bird"] : i % 3 === 1 ? ["adventurous", "focused"] : ["funny", "sociable"], interests: i % 3 === 0 ? ["books", "art"] : i % 3 === 1 ? ["nature", "craft"] : ["cooking", "music"], birth: ["03-11", "08-22", "11-02", "05-15", "07-08", "01-27", "09-19", "04-04", "12-14", "06-28", "02-09", "10-31"][i], color: colors[i], wake: i % 3 === 0 ? 6 : 7, bed: i % 4 === 0 ? 22 : 23 }))

function building(id: string, name: string, x: number, y: number, w: number, h: number, wall: string, roof: string, kind: Building["kind"]): Building {
  return { id, name, x, y, w, h, wall, roof, kind, door: { x: x + Math.floor(w / 2), y: y + h } }
}
export const BUILDINGS: Building[] = [
  ...["Willow Cottage", "Maple House", "Chestnut Row", "Fern House", "Creekside", "Oak Cottage"].map((name, i) => building(`home-${i}`, name, 4 + i * 8, 3, 5, 4, ["#ebd7a4", "#b6c6bc", "#ead0a0"][i % 3], ["#a45b4d", "#637b78", "#9b7958"][i % 3], "home")),
  ...["Hill House", "Orchard Lane", "Station Flat", "Pine Cottage", "Town Edge"].map((name, i) => building(`home-${i + 6}`, name, 4 + i * 10, 35, 5, 4, ["#d6c7ae", "#d5d9b0", "#c9d1c3"][i % 3], ["#8b6480", "#b37851", "#657c72"][i % 3], "home")),
  building("library", "Borough Library", 6, 13, 8, 6, "#e4cda3", "#ab594c", "library"),
  building("market", "Chestnut Bakery", 24, 13, 8, 6, "#eed9a6", "#6a8a7a", "market"),
  building("workshop", "Bell & Beam Workshop", 41, 13, 7, 6, "#c3b29a", "#797b8a", "workshop"),
  building("school", "Village School", 56, 12, 6, 6, "#d8d8ba", "#8e6456", "school"),
]
export const paths = new Set<string>()
export const blocked = new Set<string>()
export const key = (x: number, y: number) => `${x},${y}`
function road(x1: number, y1: number, x2: number, y2: number, width = 1) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
    for (let a = 0; a < width; a++) paths.add(key(x, y + a))
  }
}
road(1, 9, 51, 9, 2); road(1, 22, 62, 22, 2); road(1, 32, 51, 32, 2); road(1, 41, 51, 41, 1)
for (const x of [2, 18, 38, 50, 62]) road(x, x === 62 ? 19 : 9, x, x === 62 ? 36 : 41)
// A broad village green; these same tiles are the walkable ground in the renderer.
road(23, 25, 33, 29); road(28, 22, 28, 32); road(18, 27, 23, 27); road(33, 27, 38, 27)
road(59, 18, 59, 22); road(59, 19, 62, 19); road(57, 36, 62, 36)
for (const b of BUILDINGS) {
  for (let x = b.x; x < b.x + b.w; x++) for (let y = b.y; y < b.y + b.h; y++) blocked.add(key(x, y))
  const join = b.kind === "home" ? (b.y < 20 ? 9 : 41) : b.id === "school" ? 22 : 22
  road(b.door.x, b.door.y, b.door.x, join)
}
// Furniture is solid, even when it sits on the paved village square.
for (const [x, y] of [[24, 25], [25, 25], [31, 29], [32, 29], [32, 25], [33, 25]]) blocked.add(key(x, y))
export function water(x: number, y: number) { return x >= 53 + (y > 32 ? -1 : 0) && x <= 55 + (y < 14 ? 1 : 0) }
export function walkable(x: number, y: number) { return x >= 0 && y >= 0 && x < COLS && y < ROWS && paths.has(key(x, y)) && !blocked.has(key(x, y)) && (!water(x, y) || y === 22 || y === 23) }
export const TREES: Point[] = []
for (let i = 0; i < 230; i++) {
  const x = Math.floor(random(`tree-x-${i}`) * COLS), y = Math.floor(random(`tree-y-${i}`) * ROWS)
  if (y < 2 || x < 2 || x > 62 || (x > 55 && y > 25 && y < 35)) {
    if (!paths.has(key(x, y)) && !blocked.has(key(x, y)) && !water(x, y)) TREES.push({ x, y })
  }
}
export const DESTINATIONS: Record<string, Point> = { Library: BUILDINGS.find(b => b.id === "library")!.door, Market: BUILDINGS.find(b => b.id === "market")!.door, Workshop: BUILDINGS.find(b => b.id === "workshop")!.door, School: BUILDINGS.find(b => b.id === "school")!.door, Creek: { x: 62, y: 29 }, Orchard: { x: 58, y: 36 }, "Town Square": { x: 28, y: 27 }, "Main Street": { x: 38, y: 27 } }
for (const b of BUILDINGS.filter(b => b.kind === "home")) DESTINATIONS[b.name] = b.door

// Four-neighbor A*, with a closed set so heuristic priorities never discard valid nodes.
export function findPath(start: Point, target: Point): Point[] {
  if (!walkable(start.x, start.y) || !walkable(target.x, target.y)) return []
  const open: Point[] = [start], closed = new Set<string>(), cost = new Map([[key(start.x, start.y), 0]]), previous = new Map<string, Point>()
  const h = (p: Point) => Math.abs(p.x - target.x) + Math.abs(p.y - target.y)
  while (open.length) {
    open.sort((a, b) => (cost.get(key(a.x, a.y))! + h(a)) - (cost.get(key(b.x, b.y))! + h(b)))
    const at = open.shift()!, k = key(at.x, at.y)
    if (closed.has(k)) continue
    if (at.x === target.x && at.y === target.y) { const route = [at]; let p = previous.get(k); while (p) { route.unshift(p); p = previous.get(key(p.x, p.y)) } return route }
    closed.add(k)
    for (const [dx, dy] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
      const p = { x: at.x + dx, y: at.y + dy }, pk = key(p.x, p.y)
      if (!walkable(p.x, p.y) || closed.has(pk)) continue
      const next = cost.get(k)! + 1
      if (next < (cost.get(pk) ?? Infinity)) { cost.set(pk, next); previous.set(pk, at); open.push(p) }
    }
  }
  return []
}

const localFormatter = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", weekday: "long", hourCycle: "h23" })
export function localParts(date: Date) {
  const values = localFormatter.formatToParts(date), get = (name: string) => values.find(p => p.type === name)!.value
  return { year: +get("year"), month: +get("month"), day: +get("day"), hour: +get("hour"), minute: +get("minute"), weekday: get("weekday"), date: `${get("year")}-${get("month")}-${get("day")}` }
}
export function seasonAt(date: Date): Season {
  const p = localParts(date), day = p.month * 100 + p.day
  return day >= 1221 || day < 320 ? "Winter" : day < 621 ? "Spring" : day < 923 ? "Summer" : "Autumn"
}
export function holidayAt(date: Date) {
  const { year, month, day } = localParts(date)
  const a = year % 19, b = Math.floor(year / 100), c = year % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451)
  const easterMonth = Math.floor((h + l - 7 * m + 114) / 31), easterDay = (h + l - 7 * m + 114) % 31 + 1
  if (month === easterMonth && day === easterDay) return "Spring Feast"
  const fourthThursday = 1 + (4 - new Date(Date.UTC(year, 10, 1)).getUTCDay() + 7) % 7 + 21
  if (month === 11 && day === fourthThursday) return "Thanksgiving"
  return ({ "1-1": "New Year’s Day", "2-14": "Valentine’s Day", "10-31": "Halloween", "12-24": "Christmas Eve", "12-25": "Christmas Day", "12-31": "New Year’s Eve" } as Record<string, string>)[`${month}-${day}`] || ""
}
export function moonAt(date: Date) {
  const age = ((date.getTime() - Date.UTC(2000, 0, 6, 18, 14)) / 86400000 % 29.530588853 + 29.530588853) % 29.530588853
  return { name: ["New moon", "Waxing crescent", "First quarter", "Waxing gibbous", "Full moon", "Waning gibbous", "Last quarter", "Waning crescent"][Math.round(age / 29.530588853 * 8) % 8], illumination: Math.round((1 - Math.cos(age / 29.530588853 * 2 * Math.PI)) * 50) }
}
export function solarAltitude(date: Date) {
  const day = (Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - Date.UTC(date.getUTCFullYear(), 0, 0)) / 86400000
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60, g = 2 * Math.PI / 365 * (day - 1 + (hour - 12) / 24)
  const dec = .006918 - .399912 * Math.cos(g) + .070257 * Math.sin(g) - .006758 * Math.cos(2 * g) + .000907 * Math.sin(2 * g) - .002697 * Math.cos(3 * g) + .00148 * Math.sin(3 * g)
  const eq = 229.18 * (.000075 + .001868 * Math.cos(g) - .032077 * Math.sin(g) - .014615 * Math.cos(2 * g) - .040849 * Math.sin(2 * g))
  const rad = Math.PI / 180, angle = (hour * 60 + eq - 4 * 75.62) / 4 - 180
  return Math.asin(Math.sin(40.03 * rad) * Math.sin(dec) + Math.cos(40.03 * rad) * Math.cos(dec) * Math.cos(angle * rad)) / rad
}
export function weatherAt(date: Date, seed: number) {
  const p = localParts(date), day = Math.floor(Date.UTC(p.year, p.month - 1, p.day) / 86400000)
  const noise = random(`${seed}:${Math.floor(day / 3)}`) * .7 + random(`${seed}:${day}`) * .3
  const yearDay = (Date.UTC(p.year, p.month - 1, p.day) - Date.UTC(p.year, 0, 0)) / 86400000
  const temp = Math.round(53 + 25 * Math.cos((yearDay - 202) * Math.PI * 2 / 365) + (noise - .5) * 12 + 5 * Math.cos((p.hour - 15) * Math.PI / 12))
  return { label: noise < .14 ? "Storm" : noise < .32 ? "Rain" : noise < .5 ? "Overcast" : noise < .72 ? "Partly cloudy" : "Clear", temp, snow: temp < 33 && noise < .32 }
}
export function plan(v: Villager, date: Date, forced: Record<string, number>): Plan {
  const p = localParts(date), hour = p.hour + p.minute / 60, weekday = !["Saturday", "Sunday"].includes(p.weekday)
  const result = (place: string, label: string, indoors = false, working = false) => ({ place, label, target: DESTINATIONS[place] || DESTINATIONS[v.home], indoors, working })
  if (forced[v.id] > date.getTime()) return result("Main Street", "Reluctantly helping the crew", false, true)
  if (hour < v.wake || hour >= v.bed) return result(v.home, "Sleeping at home", true)
  if (holidayAt(date) && hour >= 16 && hour < 21) return result("Town Square", `Enjoying ${holidayAt(date)}`)
  if (hour < v.wake + .7) return result(v.home, "Breakfast and a slow start", true)
  const lunch = 12 + Math.floor(random(v.id) * 3) * .25
  if (hour >= lunch && hour < lunch + .5) return result("Town Square", "Taking a lunch break")
  const start = v.job === "baker" ? 6 : v.job === "civil engineer" || v.job === "carpenter" ? 7 : 9
  const workday = v.job === "baker" || v.job === "barista" ? p.weekday !== "Monday" && p.weekday !== "Sunday" : weekday
  if (workday && hour >= start && hour < start + 8) {
    const jobs: Record<string, [string, string, boolean]> = { librarian: ["Library", "Shelving books in the reading room", true], "civil engineer": ["Main Street", "Checking the build site", false], baker: ["Market", "Baking the afternoon loaves", true], teacher: ["School", "Teaching an art lesson", true], "watershed steward": ["Creek", "Checking water levels", false], carpenter: ["Main Street", "Measuring timber with the crew", false], nurse: ["School", "At the community clinic", true], gardener: ["Orchard", "Tending the orchard", false], mechanic: ["Workshop", "Repairing a neighbor’s bicycle", true], barista: ["Market", "Making coffee for the regulars", true], artist: ["Town Square", "Sketching life in the square", false], groundskeeper: ["Town Square", "Caring for the village green", false] }
    const work = jobs[v.job] || jobs.mechanic
    return result(work[0], work[1], work[2], true)
  }
  if (hour >= 18 && hour < 19 && random(v.id) < .6) return result(v.home, "Cooking dinner at home", true)
  const choices: [string, string, boolean][] = [["Town Square", "Catching up with the neighbors", false], ["Market", "Picking up bread and groceries", true], ["Creek", "Walking beside the creek", false], ["Orchard", "Taking the long way through the orchard", false], [v.home, "Reading at home", true]]
  if (hour >= 20) choices.push([v.home, "Winding down for the evening", true])
  const choice = choices[Math.floor(random(`${v.id}:${p.date}:${Math.floor(hour * 3)}`) * choices.length)]
  return result(...choice)
}

export function freshSave(): TownSave {
  return { version: 2, cursor: new Date().toISOString(), villagers: PEOPLE, affinity: {}, projects: Array(PROJECTS.length).fill(0), log: [{ at: new Date().toISOString(), text: "A new chapter in the village begins.", kind: "town" }], seed: 42017, forced: {} }
}
export function migrateSave(value: Partial<TownSave> | null): TownSave {
  const fresh = freshSave()
  return { ...fresh, ...value, villagers: PEOPLE.map(p => ({ ...p, ...value?.villagers?.find(v => v.id === p.id) })), projects: fresh.projects.map((p, i) => value?.projects?.[i] ?? p), forced: value?.forced || {}, log: value?.log || fresh.log }
}
