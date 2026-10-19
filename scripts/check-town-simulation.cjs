/* Run with node scripts/check-town-simulation.cjs. No network or API key. */
const fs = require('node:fs')
const assert = require('node:assert/strict')
const ts = require('typescript')
require.extensions['.ts'] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, filename)
}
global.fetch = () => { throw new Error('The simulation must never make network calls') }
const world = require('../lib/town/world.ts')
const engine = require('../lib/town/behavior.ts')
const civic = require('../lib/town/civic.ts')
const start = new Date('2026-10-19T12:00:00Z') // 8 AM in the village.
const at = minutes => new Date(start.getTime() + minutes * 60000)
const base = (seed = 42017) => ({ ...world.freshSave(start), cursor: start.toISOString(), log: [], seed })
const copy = value => JSON.parse(JSON.stringify(value))
function proposal(save, opinions = {}) {
  civic.proposeProject(save, start)
  const p = save.civic.proposals[0]
  p.createdAt = at(-120).toISOString(); p.discussionCount = 3
  p.opinions = Object.fromEntries(save.villagers.map(v => [v.id, opinions[v.id] ?? .7]))
  return p
}

const old = world.migrateSave({ version: 2, cursor: start.toISOString(), projects: [125, 650], affinity: { 'ben:elias': 16 }, log: [{ at: start.toISOString(), text: 'An older note', kind: 'town' }] })
assert.equal(old.version, 4); assert.equal(old.projects[0], 125); assert.equal(old.projects[1], 650)
assert.equal(old.civic.proposals.find(p => p.projectIndex === 0).status, 'building')
assert.equal(old.civic.proposals.find(p => p.projectIndex === 1).status, 'completed')
assert.equal(old.relationships['ben:elias'].familiarity, 16)
assert.equal(old.log[0].text, 'An older note')
const oldSnapshot = JSON.stringify(old); world.migrateSave(old); assert.equal(JSON.stringify(old), oldSnapshot, 'Migration mutated an existing save')
assert.equal(world.migrateSave({ version: 3, chapter: { source: 'openai' } }).chapter, null, 'Old model decisions survived migration')

// Replay must not depend on how often the browser was open, including partial ticks.
const initial = base(), snapshot = JSON.stringify(initial)
const bulk = engine.advanceTown(initial, at(12 * 60 + 2))
let incremental = initial
for (let minutes = 2; minutes <= 12 * 60 + 2; minutes += 5) incremental = engine.advanceTown(incremental, at(minutes))
assert.deepEqual(incremental, bulk, 'Offline replay differs from incremental updates')
assert.equal(JSON.stringify(initial), snapshot, 'Engine mutated an earlier save')
assert.deepEqual(engine.advanceTown(bulk, at(12 * 60 + 2)), bulk, 'Repeated tick duplicated progress/events')
assert.strictEqual(engine.advanceTown(bulk, start), bulk, 'Clock rollback rewound the town')
assert.ok(engine.validateChapter(bulk.chapter)); assert.equal(bulk.agents.mara.energy >= 0, true)
assert.ok(bulk.log.some(e => e.kind === 'proposal'), 'No project proposals emerged')
assert.ok(bulk.log.some(e => e.kind === 'discussion'), 'No civic discussions emerged')
assert.ok(bulk.log.some(e => e.kind === 'vote'), 'No civic vote occurred')
assert.ok(bulk.civic.proposals.some(p => p.status === 'building' || p.status === 'approved'), 'No project was approved')
assert.ok(bulk.projects.some(n => n > 0), 'Volunteers did not advance construction')
assert.ok(Object.values(bulk.relationships).some(r => r.affection > 0))
assert.ok(Object.values(bulk.relationships).some(r => r.affection < 0 || r.trust < 0), 'Interactions only ever improved relationships')
assert.ok(Object.values(bulk.memories).some(memories => memories.length > 0))
assert.ok(bulk.log.length <= 250)
assert.ok(Object.values(bulk.memories).every(memories => memories.length <= 8))
for (const a of Object.values(bulk.agents)) { assert.ok(a.energy >= 0 && a.energy <= 100); assert.ok(a.social >= 0 && a.social <= 100); assert.ok(Object.hasOwn(world.DESTINATIONS, a.location)) }

const alternate = engine.advanceTown(base(842), at(12 * 60 + 2))
assert.notDeepEqual(alternate.civic, bulk.civic, 'Different seeds gave identical civic outcomes')
assert.notDeepEqual(alternate.relationships, bulk.relationships, 'Different seeds gave identical relationships')

// Opinions and quorum actually control votes; construction cannot bypass approval.
const noQuorum = base(), noQuorumProposal = proposal(noQuorum)
civic.holdVote(noQuorum, noQuorumProposal, ['mara', 'ben', 'elias'], at(30))
assert.equal(noQuorumProposal.status, 'discussion'); assert.equal(noQuorum.civic.activeProjectId, null)
const reject = base(), rejected = proposal(reject, { mara: -.8, elias: -.7, ben: -.5, nina: .7 })
civic.holdVote(reject, rejected, ['mara', 'elias', 'ben', 'nina'], at(30))
assert.equal(rejected.status, 'deferred'); assert.equal(reject.civic.activeProjectId, null)
const pass = base(), passed = proposal(pass)
civic.holdVote(pass, passed, ['mara', 'elias', 'ben', 'nina'], at(30))
assert.equal(passed.status, 'building'); assert.equal(pass.civic.activeProjectId, passed.id)
const dissent = base(), dissenting = proposal(dissent, { nina: -.8 })
civic.holdVote(dissent, dissenting, ['mara', 'elias', 'ben', 'nina'], at(30))
assert.equal(dissenting.votes.nina, false, 'A majority erased dissent')
const neutral = base(), undecided = proposal(neutral, { nina: .001 })
civic.holdVote(neutral, undecided, ['mara', 'elias', 'ben', 'nina'], at(30))
assert.equal(undecided.votes.nina, null, 'A neutral resident could not abstain')

const debaters = base(), debate = proposal(debaters, { mara: .8, elias: -.2 })
const before = debate.opinions.elias
civic.discussProject(debaters, debate, world.PEOPLE[0], world.PEOPLE[1], at(10))
assert.notEqual(debate.opinions.elias, before, 'Discussion never affected opinion')
assert.ok(debate.arguments.length > 0); assert.ok(debaters.memories.elias.length > 0)
const trusted = base(), distrusted = base()
const trustedIdea = proposal(trusted, { mara: -.8, elias: .2 }), distrustedIdea = proposal(distrusted, { mara: -.8, elias: .2 })
trusted.relationships['elias:mara'] = { familiarity: 50, trust: 70, affection: 20, lastInteraction: 0 }
distrusted.relationships['elias:mara'] = { familiarity: 50, trust: -70, affection: -20, lastInteraction: 0 }
civic.discussProject(trusted, trustedIdea, world.PEOPLE[0], world.PEOPLE[1], at(10))
civic.discussProject(distrusted, distrustedIdea, world.PEOPLE[0], world.PEOPLE[1], at(10))
assert.ok(Math.abs(trustedIdea.opinions.elias - .2) > Math.abs(distrustedIdea.opinions.elias - .2), 'Trust did not affect persuasion')

const workerSave = base(), workerProposal = proposal(workerSave)
workerSave.forced = { mara: at(60).getTime(), elias: at(60).getTime(), ben: at(60).getTime() }
assert.ok(engine.advanceTown(workerSave, at(20)).projects.every(n => n === 0), 'Unapproved work gained construction points')
workerProposal.status = 'building'; workerSave.civic.activeProjectId = workerProposal.id
workerSave.projects[workerProposal.projectIndex] = 649
const completed = engine.advanceTown(workerSave, at(5))
assert.equal(completed.projects[workerProposal.projectIndex], 650)
assert.equal(completed.civic.proposals.find(p => p.id === workerProposal.id).status, 'completed')
assert.ok(completed.log.some(e => e.kind === 'project' && e.text.includes('finished')))
const queuedSave = copy(workerSave)
civic.proposeProject(queuedSave, at(120))
const queued = queuedSave.civic.proposals.find(p => p.id !== workerProposal.id)
queued.status = 'approved'
const nextProject = engine.advanceTown(queuedSave, at(5))
assert.equal(nextProject.civic.activeProjectId, queued.id, 'Completing a project did not activate the approved queue')
assert.equal(nextProject.projects[queued.projectIndex], 0, 'Workers contributed to a different project without choosing it')

// State affects utility, while weighted selection permits occasional alternatives.
const need = base(), v = world.PEOPLE[0]
const score = (save, purpose) => engine.actionCandidates(save, v, at(9 * 60), null, 'Town Square').filter(c => c.decision.purpose === purpose).map(c => c.score)
need.agents.mara.energy = 5
const tiredRest = Math.max(...score(need, 'rest')); need.agents.mara.energy = 95
assert.ok(tiredRest > Math.max(...score(need, 'rest')), 'Energy did not affect resting utility')
need.agents.mara.social = 95
const lonelySocial = Math.max(...score(need, 'social')); need.agents.mara.social = 5
assert.ok(lonelySocial > Math.max(...score(need, 'social')), 'Social need did not affect encounter utility')
need.relationships['elias:mara'] = { familiarity: 80, trust: 80, affection: 90, lastInteraction: 0 }
need.agents.elias.destination = 'Market'
assert.equal(engine.actionCandidates(need, v, at(9 * 60), null, 'Town Square').find(c => c.decision.purpose === 'social').decision.place, 'Market', 'Friendship never influenced where a resident went')
const night = new Date('2026-10-20T06:00:00Z'), nightChapter = engine.localChapter(base(), night)
assert.ok(nightChapter.decisions.every(d => d.place === world.PEOPLE.find(v => v.id === d.villagerId).home), 'Villagers ignored sleep')
const committed = engine.localChapter(base(), at(180))
assert.equal(engine.activeDecision({ ...base(), chapter: committed }, 'mara', at(181)).activity, engine.activeDecision({ ...base(), chapter: committed }, 'mara', at(184)).activity)

// Snapshots survive serialization and bounded catch-up without external services.
assert.deepEqual(engine.advanceTown(world.migrateSave(copy(bulk)), at(12 * 60 + 7)), engine.advanceTown(bulk, at(12 * 60 + 7)))
const longGap = engine.advanceTown({ ...base(), cursor: '2000-01-01T00:00:00Z' }, start)
assert.ok(longGap.log.length <= 250); assert.ok(engine.validateChapter(longGap.chapter))
const firstNight = engine.advanceTown(world.freshSave(night), night)
assert.ok(firstNight.log.some(e => e.kind === 'discussion') && firstNight.log.some(e => e.kind === 'vote'), 'A first visit at night opened an empty almanac')
console.log(JSON.stringify({ seed: bulk.seed, simulatedHours: 12, proposals: bulk.civic.proposals.length, discussions: bulk.civic.proposals.reduce((n, p) => n + p.discussionCount, 0), votes: bulk.log.filter(e => e.kind === 'vote').length, constructionPoints: bulk.projects.reduce((a, b) => a + b, 0), relationships: Object.keys(bulk.relationships).length, replay: 'identical', networkCalls: 0 }, null, 2))
