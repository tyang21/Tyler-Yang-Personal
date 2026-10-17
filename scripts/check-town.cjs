/* Run with node scripts/check-town.cjs. No browser or additional packages needed. */
const fs = require('node:fs')
const assert = require('node:assert/strict')
const ts = require('typescript')
require.extensions['.ts'] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, filename)
}
const world = require('../lib/town/world.ts')
const { VillageRenderer } = require('../lib/town/renderer.ts')
const points = Object.values(world.DESTINATIONS)
let routes = 0
for (const from of points) for (const to of points) {
  const route = world.findPath(from, to)
  assert.ok(route.length > 0, `Unreachable destination: ${JSON.stringify({ from, to })}`)
  for (let i = 0; i < route.length; i++) {
    assert.ok(world.walkable(route[i].x, route[i].y))
    if (i) assert.equal(Math.abs(route[i].x - route[i - 1].x) + Math.abs(route[i].y - route[i - 1].y), 1, 'Route cuts a corner')
  }
  routes++
}
const bridge = world.findPath(world.DESTINATIONS.Library, world.DESTINATIONS.School)
assert.ok(bridge.some(p => world.water(p.x, p.y)))
assert.ok(bridge.filter(p => world.water(p.x, p.y)).every(p => p.y === 22 || p.y === 23), 'River crossed outside the bridge')
// Exercise the complete renderer with a canvas context, not just the A* routine.
const gradient = { addColorStop() {} }
const context = new Proxy({}, { get: (_, key) => key === 'measureText' ? text => ({ width: text.length * 6 }) : key === 'createRadialGradient' ? () => gradient : () => {}, set: () => true })
global.document = { createElement: () => ({ getContext: () => context }) }
const save = world.migrateSave({ version: 2, villagers: [{ ...world.PEOPLE[0], color: '#b05060' }] })
assert.equal(save.villagers.length, 12, 'Older save lost residents')
assert.equal(save.villagers[0].color, '#b05060', 'Migration overwrote resident data')
assert.equal(save.projects.length, 10)
const start = new Date('2026-10-19T10:00:00Z')
const renderer = new VillageRenderer(start, save)
assert.equal(renderer.actors.length, 12, 'Duplicate resident sprites')
let moved = 0, entered = 0
for (let frame = 0; frame < 20000; frame++) {
  const now = new Date(start.getTime() + frame * 2000)
  const before = renderer.actors.map(a => ({ x: a.x, y: a.y, inside: a.inside }))
  renderer.update(2, now, save)
  renderer.actors.forEach((a, i) => {
    const x = Math.round(a.x / world.TILE - .5), y = Math.round(a.y / world.TILE - .5)
    assert.ok(world.walkable(x, y), `${a.villager.id} left the path at ${x},${y}`)
    if (a.x !== before[i].x || a.y !== before[i].y) moved++
    if (!before[i].inside && a.inside) entered++
  })
  if (frame % 1000 === 0) renderer.render(context, 'mara', true)
}
assert.ok(moved > 1000, 'Residents did not walk')
assert.ok(entered > 10, 'Residents did not enter buildings')
for (const date of ['2026-01-15T17:00:00Z', '2026-04-15T14:00:00Z', '2026-07-15T23:00:00Z', '2026-12-15T23:00:00Z']) {
  const scene = new VillageRenderer(new Date(date), save)
  scene.update(1, new Date(date), save); scene.render(context, 'nina', true)
}
console.log(JSON.stringify({ connectedRoutes: routes, villagers: renderer.actors.length, frames: 20000, movementSteps: moved, buildingEntries: entered, seasonalRenders: 4, saveMigration: 'passed' }, null, 2))
