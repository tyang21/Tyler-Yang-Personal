import { BUILDINGS, Building, COLS, DESTINATIONS, HEIGHT, PEOPLE, Plan, Point, ROWS, Season, TILE, TREES, TownSave, Villager, WIDTH, findPath, key, paths, plan, random, seasonAt, solarAltitude, walkable, water, weatherAt } from "./world"

type Actor = { villager: Villager; x: number; y: number; tile: Point; route: Point[]; goal: Plan; inside: boolean; walking: boolean; direction: string; gait: number; pause: number; trips: number }
export type ResidentView = { id: string; x: number; y: number; walking: boolean; indoors: boolean; activity: string; place: string }
const center = (n: number) => n * TILE + TILE / 2
const rect = (c: CanvasRenderingContext2D, color: string, x: number, y: number, w: number, h: number) => { c.fillStyle = color; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)) }
function oval(c: CanvasRenderingContext2D, color: string, x: number, y: number, w: number, h: number) {
  rect(c, color, x + 3, y, w - 6, h); rect(c, color, x, y + 2, w, h - 4)
}
function flower(c: CanvasRenderingContext2D, x: number, y: number, color: string) {
  rect(c, "#557943", x, y + 1, 1, 4); rect(c, color, x - 2, y - 1, 5, 2); rect(c, color, x, y - 3, 1, 6); rect(c, "#f6dfa0", x, y - 1, 1, 1)
}
function fence(c: CanvasRenderingContext2D, x: number, y: number, w: number) {
  rect(c, "#866747", x, y + 4, w, 2); rect(c, "#dbc395", x, y + 2, w, 2); rect(c, "#aa8a61", x, y + 9, w, 2)
  for (let p = 0; p <= w; p += 8) { rect(c, "#7f6346", x + p, y, 3, 14); rect(c, "#e9d3a4", x + p, y, 2, 12) }
}
function bench(c: CanvasRenderingContext2D, x: number, y: number) {
  rect(c, "#496048", x - 1, y + 2, 25, 7); rect(c, "#986e45", x, y, 23, 3); rect(c, "#d6a96e", x, y - 2, 23, 2); rect(c, "#b28351", x, y + 5, 23, 4); rect(c, "#5d543e", x + 3, y + 9, 3, 4); rect(c, "#5d543e", x + 17, y + 9, 3, 4)
}
export function drawSprite(c: CanvasRenderingContext2D, v: Villager, x: number, y: number, direction: string, gait: number, walking: boolean, cold = false) {
  x = Math.round(x); y = Math.round(y)
  const i = PEOPLE.findIndex(p => p.id === v.id), skin = ["#edbf94", "#ddb48d", "#a76e4e", "#cf976e", "#87563d"][Math.abs(i) % 5], hair = ["#5c3b30", "#343e40", "#593925", "#a15b36", "#413434", "#c6a478"][Math.abs(i) % 6]
  oval(c, "#3c553d38", x - 6, y - 2, 13, 6)
  const step = walking ? (Math.floor(gait) % 4 === 0 ? -1 : Math.floor(gait) % 4 === 2 ? 1 : 0) : 0
  rect(c, "#494446", x - 4, y - 5, 3, 5 + step); rect(c, "#494446", x + 1, y - 5, 3, 5 - step)
  rect(c, "#333b3c", x - 5, y + step - 1, 4, 2); rect(c, "#333b3c", x + 1, y - step - 1, 4, 2)
  rect(c, v.color, x - 5, y - 14, 10, 10); rect(c, "#ffffff25", x - 4, y - 13, 3, 6)
  rect(c, skin, x - 7, y - 12 + step, 2, 6); rect(c, skin, x + 5, y - 12 - step, 2, 6)
  if (cold) rect(c, "#e6d0a2", x - 5, y - 14, 10, 2)
  rect(c, skin, x - 4, y - 22, 8, 8); rect(c, skin, x - 5, y - 20, 10, 5)
  rect(c, hair, x - 4, y - 24, 8, 4); rect(c, hair, x - 5, y - 22, 2, 5)
  if (direction === "up") rect(c, hair, x - 4, y - 21, 8, 6)
  else { rect(c, "#343d39", x + (direction === "left" ? -3 : direction === "right" ? 2 : -2), y - 18, 1, 1); if (direction === "down") rect(c, "#343d39", x + 2, y - 18, 1, 1) }
  if (i === 1 || i === 5) { rect(c, "#d9ac51", x - 5, y - 24, 10, 3); rect(c, "#f6d27e", x - 3, y - 26, 6, 3) }
  if (i === 2) { rect(c, "#f2e1bb", x - 5, y - 24, 10, 4); rect(c, "#f2e1bb", x - 3, y - 27, 6, 4); rect(c, "#e6d0a5", x - 3, y - 11, 6, 6) }
}

function drawHouse(c: CanvasRenderingContext2D, b: Building, season: Season, glow: boolean) {
  const x = b.x * TILE, y = b.y * TILE, w = b.w * TILE, h = b.h * TILE, civic = b.kind !== "home"
  oval(c, "#3d55372b", x - 4, y + h - 5, w + 14, 15)
  rect(c, "#82664b", x, y + h - 6, w, 8); rect(c, b.wall, x + 3, y + 24, w - 6, h - 28)
  for (let p = y + 30; p < y + h - 8; p += 6) rect(c, "#8f775727", x + 3, p, w - 6, 1)
  rect(c, "#b99a72", x + w - 8, y + 27, 5, h - 32)
  // A stepped roof silhouette and offset shingles keep the whole scene on one pixel grid.
  const roofH = civic ? 35 : 27
  for (let line = 0; line < roofH; line += 2) {
    const inset = Math.floor((roofH - line) / 3)
    rect(c, b.roof, x - 7 + inset, y - 7 + line, w + 14 - inset * 2, 3)
    if (line % 6 === 0) rect(c, "#efb99225", x - 7 + inset, y - 7 + line, w + 14 - inset * 2, 1)
    if (line % 6 === 2) for (let sx = x + inset + (line % 12 ? 5 : 0); sx < x + w - inset; sx += 10) rect(c, "#493f3e36", sx, y - 7 + line, 1, 4)
  }
  rect(c, "#554b40", x - 7, y - 7 + roofH, w + 14, 3); rect(c, "#d8b78a", x - 5, y - 4 + roofH, w + 10, 2)
  if (season === "Winter") { rect(c, "#f4f2e0", x + 4, y - 7, w - 8, 3); rect(c, "#edf0dc", x - 6, y - 8 + roofH, w + 12, 3) }
  rect(c, "#aa9175", x + w - 24, y - 14, 9, 17); rect(c, "#d3c0a3", x + w - 25, y - 15, 11, 3)
  const windowColor = glow ? "#ffe0a0" : "#a8c5bf"
  for (let n = 0; n < (civic ? 4 : 2); n++) {
    const wx = civic ? x + 12 + n * (w - 30) / 3 : x + 12 + n * (w - 38)
    rect(c, "#7d654c", wx - 2, y + h - 34, 17, 21); rect(c, "#efe0b9", wx - 1, y + h - 33, 15, 19); rect(c, windowColor, wx + 1, y + h - 31, 11, 15); rect(c, "#f1e3bb", wx + 6, y + h - 32, 1, 16); rect(c, "#f1e3bb", wx, y + h - 24, 14, 1)
    rect(c, "#9a774f", wx - 2, y + h - 13, 18, 3)
    if (!civic) { rect(c, "#ad7151", wx - 1, y + h - 12, 15, 5); for (let f = 0; f < 3; f++) flower(c, wx + f * 5 + 2, y + h - 12, ["#e2a8a0", "#f5d484", "#b2c68a"][f]) }
  }
  const dx = center(b.door.x)
  rect(c, "#e3cca0", dx - 10, y + h - 24, 20, 24); rect(c, "#745543", dx - 7, y + h - 22, 14, 22); rect(c, "#a18058", dx - 5, y + h - 21, 10, 8); rect(c, "#e8c27f", dx + 3, y + h - 10, 2, 2)
  rect(c, "#c6b58e", dx - 13, y + h, 26, 4); rect(c, "#d8cbaa", dx - 15, y + h + 4, 30, 3)
  if (civic) {
    rect(c, "#624b3d", x + 15, y + 27, w - 30, 13); rect(c, "#f4e0ad", x + 17, y + 28, w - 34, 10)
    c.fillStyle = "#594c38"; c.font = "bold 7px monospace"; c.textAlign = "center"; c.fillText(b.kind === "market" ? "CHESTNUT & RYE" : b.kind === "workshop" ? "BELL & BEAM" : b.kind === "school" ? "SCHOOLHOUSE" : "BOROUGH LIBRARY", x + w / 2, y + 36)
    if (b.kind === "market") {
      for (let i = 0; i < 9; i++) rect(c, i % 2 ? "#f1dfb2" : "#b86853", x + 10 + i * 12, y + 44, 12, 10)
      for (let i = 0; i < 3; i++) { rect(c, "#a77b52", x + 5 + i * 22, y + h + 9, 19, 10); oval(c, ["#d4a656", "#8b9b4f", "#c97c4b"][i], x + 6 + i * 22, y + h + 7, 17, 6) }
    }
  }
}

function drawTree(c: CanvasRenderingContext2D, x: number, y: number, season: Season, index: number, orchard = false) {
  const colors = season === "Autumn" ? [["#8d7039", "#b89443", "#d9b358"], ["#955c3e", "#bd7950", "#dc9d62"], ["#796442", "#a58c50", "#c5b273"]][index % 3] : season === "Winter" ? ["#7f8977", "#b7bfa6", "#e5e5cf"] : ["#496c43", "#678a4e", "#8ba85f"]
  oval(c, "#344b3027", x - 15, y - 2, 32, 10); rect(c, "#70543b", x - 3, y - 21, 7, 24); rect(c, "#a08455", x - 2, y - 19, 2, 20)
  if (season === "Winter" && !orchard) { rect(c, "#75644b", x - 13, y - 32, 27, 3); rect(c, "#75644b", x - 11, y - 38, 3, 12); rect(c, "#75644b", x + 9, y - 41, 3, 13); return }
  oval(c, colors[0], x - 23, y - 42, 45, 27); oval(c, colors[1], x - 21, y - 48, 40, 29); oval(c, colors[1], x - 14, y - 53, 28, 28); oval(c, colors[2], x - 18, y - 46, 20, 16); oval(c, colors[2], x - 8, y - 51, 15, 10)
  if (orchard && season === "Autumn") for (const [a, b] of [[-12, -32], [8, -39], [1, -24]]) { rect(c, "#a9503b", x + a, y + b, 4, 5); rect(c, "#dc8f57", x + a, y + b, 2, 2) }
  if (season === "Spring" && index % 3 === 0) for (let i = 0; i < 9; i++) rect(c, "#e8c2b0", x - 17 + random(`petal-${i}`) * 33, y - 46 + random(`petal2-${i}`) * 24, 3, 2)
}

export class VillageRenderer {
  readonly actors: Actor[]
  private ground: HTMLCanvasElement
  private season: Season
  private now: Date
  private save: TownSave
  private elapsed = 0
  private slot = ""
  private projectSignature = ""
  private objects: { y: number; draw: (c: CanvasRenderingContext2D) => void }[] = []
  constructor(now: Date, save: TownSave) {
    this.now = now; this.save = save; this.season = seasonAt(now)
    this.ground = document.createElement("canvas"); this.ground.width = WIDTH; this.ground.height = HEIGHT
    this.makeGround()
    this.actors = save.villagers.map((v, i) => {
      const goal = plan(v, now, save.forced, save.chapter), agent = save.agents[v.id], start = DESTINATIONS[agent?.location] || (goal.indoors ? goal.target : { x: [18, 28, 38, 50][i % 4], y: i % 2 ? 22 : 32 })
      const inside = goal.indoors && start.x === goal.target.x && start.y === goal.target.y
      return { villager: v, x: center(start.x), y: center(start.y), tile: start, route: [], goal, inside, walking: false, direction: "down", gait: 0, pause: i * 1.5, trips: 0 }
    })
    for (const actor of this.actors) if (!actor.inside) this.routeTo(actor, actor.goal.target)
  }
  private makeGround() {
    const c = this.ground.getContext("2d")!, winter = this.season === "Winter", autumn = this.season === "Autumn"
    const grass = winter ? "#dce2d3" : autumn ? "#a8b56c" : this.season === "Spring" ? "#99b577" : "#91ac67"
    rect(c, grass, 0, 0, WIDTH, HEIGHT)
    for (let y = 0; y < HEIGHT; y += 8) for (let x = 0; x < WIDTH; x += 8) {
      const n = random(`ground:${x}:${y}`)
      if (n > .5) rect(c, winter ? "#b8c6b350" : n > .9 ? "#d8d39560" : "#627d3a28", x, y, n > .8 ? 3 : 2, 1)
      if (n > .95 && !winter) { rect(c, "#6e8a4e", x + 2, y + 2, 1, 3); rect(c, "#6e8a4e", x + 3, y + 4, 2, 1) }
    }
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) if (water(x, y)) {
      rect(c, "#a6a46c", x * TILE - 4, y * TILE, TILE + 8, TILE); rect(c, winter ? "#9fbdbe" : "#648f95", x * TILE, y * TILE, TILE, TILE)
      rect(c, winter ? "#b7cdcb" : "#7ba8a8", x * TILE + 2, y * TILE + 1, TILE - 4, TILE - 2)
    }
    for (const tile of Array.from(paths)) {
      const [x, y] = tile.split(",").map(Number), px = x * TILE, py = y * TILE
      if (water(x, y)) continue
      rect(c, this.save.projects[7] >= 650 ? "#aaa993" : "#c4aa7d", px, py, TILE, TILE)
      if (paths.has(key(x, y - 1))) rect(c, "#dac496", px + 1, py, 14, TILE)
      else { rect(c, "#a68e63", px, py, TILE, 2); rect(c, "#decb9e", px + 1, py + 2, 14, 14) }
      if (!paths.has(key(x - 1, y))) rect(c, "#a68e63", px, py, 2, TILE)
      if (!paths.has(key(x + 1, y))) rect(c, "#a68e63", px + 14, py, 2, TILE)
      if (!paths.has(key(x, y + 1))) rect(c, "#a68e63", px, py + 14, TILE, 2)
      const n = random(`stone:${x}:${y}`)
      rect(c, "#bba37b", px + 3 + n * 6, py + 5, 3, 1); rect(c, "#efe0b3", px + 9, py + 10, 2, 1)
      if (this.save.projects[7] >= 650) { rect(c, "#9b9f8a", px + 1, py + 2, 12, 5); rect(c, "#b9baa2", px + 5, py + 9, 10, 5); rect(c, "#d7d6bd", px + 2, py + 2, 10, 1) }
    }
    // The bridge is part of the very same path grid used by A*.
    for (let x = 52 * TILE; x < 57 * TILE; x += 5) { rect(c, "#705b42", x, 22 * TILE - 2, 5, 37); rect(c, "#ba9365", x, 22 * TILE, 4, 32); rect(c, "#d2ae7e", x, 22 * TILE, 1, 32) }
    fence(c, 52 * TILE, 22 * TILE - 9, 80); fence(c, 52 * TILE, 24 * TILE - 2, 80)
    // Kitchen garden: furrows, vegetables, scarecrow, and a small picket fence.
    for (let y = 26; y <= 29; y++) for (let x = 6; x <= 13; x++) {
      rect(c, "#8a6b48", x * TILE, y * TILE, 14, 13); rect(c, "#6f553d", x * TILE + 1, y * TILE + 3, 12, 2)
      if (!winter) { oval(c, autumn ? "#b67b3d" : "#5d7c49", x * TILE + 3, y * TILE + 4, 8, 7); rect(c, "#85934c", x * TILE + 5, y * TILE + 1, 2, 5) }
    }
    fence(c, 6 * TILE - 6, 26 * TILE - 7, 128)
    rect(c, "#7a583d", 12 * TILE, 25 * TILE + 4, 3, 19); rect(c, "#a48d5f", 12 * TILE - 5, 25 * TILE + 7, 14, 6); rect(c, "#d9be86", 12 * TILE - 2, 25 * TILE, 7, 7)
    for (const b of BUILDINGS.filter(b => b.kind === "home")) {
      fence(c, b.x * TILE - 7, b.y * TILE + b.h * TILE + 12, 24); fence(c, (b.x + b.w) * TILE - 17, (b.y + b.h) * TILE + 12, 24)
      rect(c, "#98764c", (b.x + b.w) * TILE + 2, (b.y + b.h) * TILE + 6, 2, 10); rect(c, "#688984", (b.x + b.w) * TILE, (b.y + b.h) * TILE + 1, 8, 6)
      if (!winter) for (let i = 0; i < 6; i++) flower(c, b.x * TILE - 5 + i * 4, (b.y + b.h) * TILE + 28 + i % 2 * 3, i % 2 ? "#d5b471" : "#b77e6b")
    }
    for (const [x, y] of [[21, 25], [34, 29], [15, 20], [48, 20]]) {
      rect(c, "#736142", x * TILE, y * TILE, 20, 13); rect(c, "#6b7842", x * TILE + 2, y * TILE + 2, 16, 9)
      for (let f = 0; f < 5; f++) flower(c, x * TILE + 4 + f * 3, y * TILE + 3 + f % 2 * 3, autumn ? "#d6a35d" : "#dcadab")
    }
    for (const [x, y] of [[24, 25], [31, 29], [57, 25]]) bench(c, x * TILE, y * TILE)
    // A communal noticeboard and picnic table sit just off the square.
    rect(c, "#826244", 21 * TILE, 29 * TILE, 3, 21); rect(c, "#826244", 21 * TILE + 25, 29 * TILE, 3, 21); rect(c, "#a28155", 21 * TILE - 2, 29 * TILE - 2, 32, 17); rect(c, "#e2d0a0", 21 * TILE + 1, 29 * TILE + 1, 26, 11)
    rect(c, "#f1e2bb", 21 * TILE + 3, 29 * TILE + 2, 7, 6); rect(c, "#c1c9a1", 21 * TILE + 14, 29 * TILE + 3, 8, 6)
    rect(c, "#7b5c42", 32 * TILE, 25 * TILE + 5, 19, 9); rect(c, "#be986a", 32 * TILE - 3, 25 * TILE, 25, 7)
    // Mark the current flower-bed site honestly: earth, edging, tools, and materials.
    const sx = 41 * TILE, sy = 26 * TILE
    rect(c, "#d0b37f", sx - 3, sy - 3, 93, 47)
    for (let i = 0; i < 3; i++) { rect(c, "#856441", sx + i * 29, sy, 24, 36); rect(c, "#a28252", sx + i * 29 + 2, sy + 3, 20, 30) }
    for (let i = 0; i < 4; i++) rect(c, "#c49c69", sx, sy + 49 + i * 3, 24, 2)
    rect(c, "#587a79", sx + 61, sy + 49, 20, 4); rect(c, "#718d8b", sx + 65, sy + 43, 14, 6)
    rect(c, "#675d49", sx + 81, sy + 48, 9, 2); rect(c, "#574e3c", sx + 66, sy + 53, 5, 4)
  }
  private routeTo(actor: Actor, target: Point) {
    const path = findPath(actor.tile, target)
    actor.route = path.slice(1)
    if (actor.route.length) actor.inside = false
  }
  update(dt: number, now: Date, save: TownSave) {
    this.now = now; this.save = save; this.elapsed += dt
    const signature = save.projects.map(p => p >= 650 ? "1" : "0").join("")
    if (seasonAt(now) !== this.season || signature !== this.projectSignature) { this.season = seasonAt(now); this.projectSignature = signature; this.makeGround() }
    const slot = `${Math.floor(now.getTime() / 60000)}:${save.chapter?.id}:${JSON.stringify(save.forced)}`
    if (slot !== this.slot) {
      this.slot = slot
      for (const actor of this.actors) {
        const next = plan(actor.villager, now, save.forced, save.chapter)
        const changed = next.target.x !== actor.goal.target.x || next.target.y !== actor.goal.target.y || next.indoors !== actor.goal.indoors
        actor.goal = next
        if (changed) { actor.pause = 0; actor.inside = false; if (!actor.route.length) this.routeTo(actor, next.target) }
      }
    }
    for (const actor of this.actors) {
      actor.walking = false
      if (actor.route.length) {
        const waypoint = actor.route[0], tx = center(waypoint.x), ty = center(waypoint.y), dx = tx - actor.x, dy = ty - actor.y, dist = Math.hypot(dx, dy), step = Math.min(dist, dt * (19 + random(actor.villager.id) * 6))
        actor.x += dist ? dx / dist * step : 0; actor.y += dist ? dy / dist * step : 0
        actor.direction = Math.abs(dx) > Math.abs(dy) ? dx > 0 ? "right" : "left" : dy > 0 ? "down" : "up"
        actor.walking = true; actor.gait += dt * 7
        if (dist <= step + .01) {
          actor.tile = waypoint; actor.route.shift()
          // Replan only at tile centers: even a schedule change cannot cut a corner.
          const last = actor.route[actor.route.length - 1]
          if (last && (last.x !== actor.goal.target.x || last.y !== actor.goal.target.y) && actor.pause === 0) this.routeTo(actor, actor.goal.target)
        }
      } else {
        if (actor.goal.indoors && actor.tile.x === actor.goal.target.x && actor.tile.y === actor.goal.target.y) { actor.inside = true; continue }
        actor.pause -= dt
        if (actor.pause <= 0) {
          if (Math.abs(actor.tile.x - actor.goal.target.x) + Math.abs(actor.tile.y - actor.goal.target.y) > 5 || actor.goal.indoors) this.routeTo(actor, actor.goal.target)
          else {
            const nearby: Point[] = []
            for (let dx = -3; dx <= 3; dx++) for (let dy = -2; dy <= 2; dy++) if (walkable(actor.goal.target.x + dx, actor.goal.target.y + dy)) nearby.push({ x: actor.goal.target.x + dx, y: actor.goal.target.y + dy })
            const target = nearby[Math.floor(random(`${actor.villager.id}:${actor.trips++}`) * nearby.length)]
            if (target) this.routeTo(actor, target)
          }
          actor.pause = 12 + random(`${actor.villager.id}:pause:${actor.trips}`) * 24
        }
      }
    }
  }
  residents(): ResidentView[] { return this.actors.map(a => ({ id: a.villager.id, x: a.x, y: a.y, walking: a.route.length > 0, indoors: a.inside, activity: a.route.length ? `Walking to ${a.goal.place}` : a.goal.label, place: a.goal.place })) }
  hit(x: number, y: number) {
    return [...this.actors].reverse().find(a => !a.inside && Math.abs(a.x - x) < 11 && y > a.y - 29 && y < a.y + 5)?.villager.id
  }
  buildingAt(x: number, y: number) { return BUILDINGS.find(b => x >= b.x * TILE && x < (b.x + b.w) * TILE && y >= b.y * TILE - 12 && y < (b.y + b.h) * TILE) }
  render(c: CanvasRenderingContext2D, selected?: string, showRoutes = false) {
    c.imageSmoothingEnabled = false; c.drawImage(this.ground, 0, 0)
    const night = Math.max(0, Math.min(.66, (3 - solarAltitude(this.now)) / 20)), wet = weatherAt(this.now, this.save.seed)
    // Narrow, moving highlights follow the river; they never change walkability.
    for (let i = 0; i < 34; i++) {
      const y = (i * 21 + this.elapsed * 3) % HEIGHT, x = (y > 520 ? 53 : 54) * TILE + Math.sin(i * 9) * 9
      rect(c, "#c3d4b864", x, y, 8 + i % 3 * 4, 1)
    }
    this.objects = []
    for (const b of BUILDINGS) this.objects.push({ y: (b.y + b.h) * TILE, draw: ctx => drawHouse(ctx, b, this.season, night > .1) })
    TREES.forEach((t, i) => this.objects.push({ y: center(t.y), draw: ctx => drawTree(ctx, center(t.x), center(t.y), this.season, i) }))
    for (let row = 0; row < 3; row++) for (let col = 0; col < 2; col++) this.objects.push({ y: 28 * TILE + row * 32, draw: ctx => drawTree(ctx, 58 * TILE + col * 43, 28 * TILE + row * 32, this.season, row + col, true) })
    for (const actor of this.actors) if (!actor.inside) this.objects.push({ y: actor.y, draw: ctx => {
      if (actor.villager.id === selected) { oval(ctx, "#fff2ba", actor.x - 10, actor.y - 3, 21, 7); oval(ctx, "#b0b379", actor.x - 7, actor.y - 2, 15, 4) }
      drawSprite(ctx, actor.villager, actor.x, actor.y, actor.direction, actor.gait, actor.walking, wet.temp < 46)
      if (wet.label === "Rain" || wet.label === "Storm") { oval(ctx, actor.villager.color, actor.x - 13, actor.y - 34, 27, 9); rect(ctx, "#dbc8a1", actor.x, actor.y - 27, 1, 17) }
      if (actor.villager.id === selected) {
        const name = actor.villager.name.split(" ")[0]; ctx.font = "bold 9px monospace"; const width = ctx.measureText(name).width + 12
        rect(ctx, "#3b4939e8", actor.x - width / 2, actor.y - 44, width, 13); ctx.textAlign = "center"; ctx.fillStyle = "#fff0ca"; ctx.fillText(name, actor.x, actor.y - 35)
      }
      if (actor.goal.working && !actor.walking && !actor.goal.indoors && Math.floor(this.elapsed / 4 + random(actor.villager.id) * 5) % 3 === 0) { rect(ctx, "#f2e3b9", actor.x + 8, actor.y - 25, 12, 10); ctx.fillStyle = "#6d7650"; ctx.font = "8px monospace"; ctx.fillText("♪", actor.x + 14, actor.y - 17) }
    } })
    if (showRoutes) for (const actor of this.actors) if (actor.villager.id === selected && actor.route.length) {
      c.strokeStyle = "#f6d287"; c.lineWidth = 2; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(actor.x, actor.y); actor.route.forEach(p => c.lineTo(center(p.x), center(p.y))); c.stroke(); c.setLineDash([])
    }
    this.objects.sort((a, b) => a.y - b.y).forEach(o => o.draw(c))
    // The first completed community project grows in the actual work-site beds.
    if (this.save.projects[0] >= 650) for (let bed = 0; bed < 3; bed++) for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) {
      flower(c, 41 * TILE + bed * 29 + 5 + col * 6, 26 * TILE + 7 + row * 9, ["#e4a2b1", "#f5d484", "#c9afd9"][bed])
    }
    this.drawCommunityProjects(c)
    for (const b of BUILDINGS) if (b.kind !== "school") {
      const sx = (b.x + b.w - 1.2) * TILE, sy = b.y * TILE - 16
      for (let i = 0; i < 3; i++) { const phase = (this.elapsed * 6 + i * 9) % 28; rect(c, `rgba(234,228,201,${.28 * (1 - phase / 28)})`, sx + Math.sin(phase / 10) * 4, sy - phase, 4 + phase / 8, 3 + phase / 8) }
    }
    if (this.season === "Autumn" || this.season === "Spring") for (let i = 0; i < 15; i++) {
      const y = (i * 59 + this.elapsed * (6 + i % 3)) % HEIGHT, x = (i * 83 + Math.sin(y / 33 + i) * 8 + this.elapsed * 3) % WIDTH
      rect(c, this.season === "Autumn" ? "#b9855090" : "#f2c5b980", x, y, 2, 2)
    }
    if (wet.label === "Rain" || wet.label === "Storm") {
      c.strokeStyle = wet.snow ? "#e7eddb80" : "#d3dcd280"; c.lineWidth = wet.snow ? 2 : 1
      for (let i = 0; i < 180; i++) { const x = (i * 61 + this.elapsed * (wet.snow ? 3 : -19) + WIDTH * 100) % WIDTH, y = (i * 47 + this.elapsed * (wet.snow ? 14 : 160)) % HEIGHT; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 2, y + (wet.snow ? 2 : 8)); c.stroke() }
    }
    // Darkness covers the viewport, including ground exposed by zooming or panning.
    // Restore the camera transform afterward so lamps stay anchored in the town.
    c.save()
    c.setTransform(1, 0, 0, 1, 0, 0)
    c.fillStyle = `rgba(26,35,53,${night})`
    c.fillRect(0, 0, c.canvas.width, c.canvas.height)
    c.restore()
    if (night > .1) {
      const lights: Point[] = [{ x: 18, y: 22 }, { x: 38, y: 22 }, { x: 28, y: 30 }, { x: 50, y: 22 }, ...(this.save.projects[1] >= 650 ? [{ x: 18, y: 32 }, { x: 50, y: 32 }, { x: 2, y: 9 }] : [])]
      for (const p of lights) {
        const x = center(p.x) - 12, y = center(p.y)
        const glow = c.createRadialGradient(x, y - 17, 1, x, y - 17, 48); glow.addColorStop(0, "rgba(255,214,126,.27)"); glow.addColorStop(1, "rgba(255,214,126,0)"); c.fillStyle = glow; c.fillRect(x - 48, y - 65, 96, 96)
        rect(c, "#555343", x, y - 22, 2, 23); rect(c, "#eed4a0", x - 3, y - 27, 8, 8); rect(c, "#846b4a", x - 4, y - 29, 10, 2)
      }
    }
  }
  private drawCommunityProjects(c: CanvasRenderingContext2D) {
    const done = (index: number) => this.save.projects[index] >= 650
    if (done(2)) { // Picnic tables, off the walkable lanes.
      for (const [x, y] of [[15 * TILE, 27 * TILE], [35 * TILE, 30 * TILE]]) {
        rect(c, "#6f6145", x + 3, y + 8, 3, 12); rect(c, "#6f6145", x + 24, y + 8, 3, 12)
        rect(c, "#c49a63", x, y, 31, 9); rect(c, "#a47e4f", x - 2, y + 12, 35, 4)
      }
    }
    if (done(3)) {
      const x = 35 * TILE, y = 28 * TILE
      oval(c, "#8c998a", x, y, 34, 18); oval(c, "#d1cdb0", x + 2, y - 2, 30, 15); oval(c, "#7ea9a9", x + 5, y, 24, 10)
      rect(c, "#c9c5a8", x + 14, y - 16, 5, 21); rect(c, "#9bc8c5", x + 15, y - 22, 3, 9)
    }
    if (done(4)) {
      rect(c, "#617e67", 7 * TILE, 26 * TILE, 66, 41); rect(c, "#aed3b89e", 7 * TILE + 3, 26 * TILE + 3, 60, 35)
      for (let i = 0; i < 4; i++) rect(c, "#e2dfba", 7 * TILE + i * 20, 26 * TILE + 2, 2, 38)
      rect(c, "#ddd5ad", 7 * TILE, 26 * TILE + 19, 66, 2)
    }
    if (done(5)) {
      const x = 42 * TILE, y = 30 * TILE
      rect(c, "#b78b59", x, y, 78, 14); rect(c, "#e1cca0", x + 4, y - 23, 3, 23); rect(c, "#e1cca0", x + 70, y - 23, 3, 23)
      rect(c, "#8c6f62", x - 4, y - 29, 86, 7); rect(c, "#ab8271", x + 9, y - 36, 60, 8)
    }
    if (done(6)) {
      const x = 35 * TILE, y = 16 * TILE
      rect(c, "#bca783", x, y - 57, 27, 57); rect(c, "#806855", x - 3, y - 63, 33, 7)
      oval(c, "#f0e2bd", x + 5, y - 46, 17, 17); rect(c, "#5f6558", x + 13, y - 43, 1, 7); rect(c, "#5f6558", x + 13, y - 37, 6, 1)
    }
    if (done(8)) {
      const x = 60 * TILE, y = 41 * TILE
      rect(c, "#baa780", x - 7, y - 34, 16, 35); rect(c, "#857466", x - 10, y - 39, 22, 6)
      c.save(); c.translate(x, y - 33); c.rotate(this.elapsed * .25)
      for (let i = 0; i < 4; i++) { c.rotate(Math.PI / 2); rect(c, "#ded6b5", 2, -3, 26, 5); rect(c, "#927e5e", 0, -1, 29, 1) } c.restore()
    }
    if (done(9)) {
      const x = 35 * TILE, y = 25 * TILE
      rect(c, "#a6a48d", x, y + 4, 19, 9); rect(c, "#c9c5a9", x - 2, y + 2, 23, 4)
      rect(c, "#809483", x + 5, y - 16, 9, 19); oval(c, "#9eb19a", x + 5, y - 24, 9, 9)
    }
    if (done(10)) for (const x of [52, 56]) for (let y = 25; y < 32; y++) {
      rect(c, "#6c8b54", x * TILE + 4, y * TILE, 2, 12); rect(c, "#9aac70", x * TILE + 7, y * TILE - 2, 2, 13)
    }
    if (done(11)) {
      const x = 15 * TILE, y = 17 * TILE
      rect(c, "#967652", x, y, 20, 25); rect(c, "#eadab1", x + 2, y + 2, 16, 19)
      for (let i = 0; i < 5; i++) rect(c, ["#c27c6a", "#789c8a", "#d7b46a"][i % 3], x + 3 + i * 3, y + 4, 2, 13)
    }
  }
}
