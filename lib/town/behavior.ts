import { Decision, DESTINATIONS, PEOPLE, PROJECTS, Proposal, TownChapter, TownSave, Villager, findPath, localParts, plan, random, weatherAt } from "./world"
import { activateNextProject, activeProject, clamp, discussProject, holdVote, initialOpinion, openProposals, personality, projectDetails, proposeProject, record, relationshipKey } from "./civic"

export const CHAPTER_MS = 30 * 60000
export const STEP_MS = 5 * 60000
export const MAX_CATCHUP_MS = 3 * 24 * 60 * 60000
const routes = new Map<string, number>()
function travelTime(from: string, to: string) {
  const key = `${from}:${to}`
  if (!routes.has(key)) routes.set(key, from === to ? 0 : Math.max(1, findPath(DESTINATIONS[from], DESTINATIONS[to]).length - 1) * 800)
  return routes.get(key)!
}
export function activeDecision(save: TownSave, id: string, now: Date) {
  return save.chapter && Date.parse(save.chapter.at) <= now.getTime() && Date.parse(save.chapter.until) > now.getTime() ? save.chapter.decisions.find(d => d.villagerId === id) : undefined
}
export function validateChapter(value: unknown): value is TownChapter {
  if (!value || typeof value !== "object") return false
  const c = value as TownChapter
  if (typeof c.id !== "string" || !c.id.startsWith("simulation:") || !Number.isFinite(Date.parse(c.at)) || Date.parse(c.until) - Date.parse(c.at) !== CHAPTER_MS || !c.event || !Array.isArray(c.event.participantIds) || !Array.isArray(c.decisions) || c.decisions.length !== PEOPLE.length) return false
  if (!c.decisions.every(d => d && PEOPLE.some(v => v.id === d.villagerId) && Object.prototype.hasOwnProperty.call(DESTINATIONS, d.place) && typeof d.activity === "string" && typeof d.thought === "string" && ["work", "social", "rest", "explore", "civic"].includes(d.purpose))) return false
  return new Set(c.decisions.map(d => d.villagerId)).size === PEOPLE.length
}

type Candidate = { score: number; decision: Decision }
export function actionCandidates(save: TownSave, v: Villager, at: Date, meeting: Proposal | null, meetingPlace: string): Candidate[] {
  const state = save.agents[v.id], profile = personality(v, save.seed), routine = plan(v, at, save.forced), time = localParts(at)
  const base = (place: string, activity: string, thought: string, purpose: Decision["purpose"], projectId: string | null = null, partnerId: string | null = null): Decision => ({ villagerId: v.id, place, activity, thought, purpose, projectId, partnerId })
  if (routine.label === "Sleeping at home") return [{ score: 10, decision: base(v.home, routine.label, "A good night’s rest makes tomorrow easier.", "rest") }]
  if (save.forced[v.id] > at.getTime()) return [{ score: 10, decision: base("Main Street", routine.label, "The neighbors asked for a hand. I’ll make a little time.", "work", activeProject(save)?.id || null) }]
  const choices: Candidate[] = []
  const add = (score: number, decision: Decision) => choices.push({ score: score - travelTime(state.location, decision.place) / 60000 * .16, decision })
  const building = activeProject(save)
  add(routine.working ? 2.8 + profile.diligence : .4, base(routine.place, routine.label, routine.working ? "I have responsibilities to take care of, and the village depends on everyone doing their part." : `I’d like a little time for ${v.interests[0]}.`, routine.working ? "work" : routine.indoors ? "rest" : "explore", routine.working && routine.place === "Main Street" ? building?.id || null : null))
  add((100 - state.energy) / 19 - .6 + (time.hour >= 20 ? 1 : 0), base(v.home, "Taking a quiet break at home", "I’ll be better company after a little rest.", "rest"))
  const friend = save.villagers.filter(other => other.id !== v.id && time.hour >= other.wake && time.hour < other.bed).sort((a, b) => {
    const pull = (id: string) => (save.relationships[relationshipKey(v.id, id)]?.affection || 0) / 40 + random(`${save.seed}:${at.getTime()}:${v.id}:company:${id}`)
    return pull(b.id) - pull(a.id)
  })[0]
  const wet = weatherAt(at, save.seed), socialPlace = wet.label === "Rain" || wet.label === "Storm" || wet.temp < 35 ? "Library" : "Town Square"
  const friendship = friend && save.relationships[relationshipKey(v.id, friend.id)], friendPlace = friend && save.agents[friend.id]?.destination
  const visitFriend = friendship && friendship.affection > 6 && friendPlace && !save.villagers.some(person => person.home === friendPlace) && (socialPlace !== "Library" || ["Library", "Market", "Workshop", "School"].includes(friendPlace))
  add(state.social / 24 + profile.sociability * 1.4 + (visitFriend ? friendship.affection / 80 : 0), base(visitFriend ? friendPlace : socialPlace, "Stopping to talk with the neighbors", friend ? `I wonder how ${friend.name.split(" ")[0]} is doing. A familiar face would be nice.` : "A little company would do me good.", "social", null, friend?.id || null))
  add(1 + (v.interests.includes("nature") ? .7 : 0) - (wet.label === "Rain" || wet.label === "Storm" ? 2 : 0), base("Creek", "Taking a thoughtful walk by the creek", "Sometimes a walk helps me decide what matters.", "explore"))
  if (building) {
    const support = building.opinions[v.id] ?? initialOpinion(v, building.projectIndex, save.seed)
    add(.3 + profile.generosity * 1.6 + profile.civic + support * 1.8 + state.energy / 100 - (routine.working ? 1 : 0), base("Main Street", `Helping with ${PROJECTS[building.projectIndex].toLowerCase()}`, support > .1 ? "I supported this idea. I’d like to help turn it into something real." : "It wasn’t my first choice, but I can still help the community.", "work", building.id))
  }
  if (meeting) {
    const opinion = meeting.opinions[v.id] || 0
    add(2.3 + profile.civic * 2 + Math.abs(opinion) + (v.id === meeting.proposerId ? 1 : 0) + state.social / 100, base(meetingPlace, `Discussing ${PROJECTS[meeting.projectIndex].toLowerCase()}`, opinion > .1 ? "I want to explain why this project matters and hear the concerns." : opinion < -.1 ? "I have reservations. I’d rather discuss them than stay away." : "I haven’t decided yet. I’d like to hear both sides.", "civic", meeting.id))
  }
  return choices
}

// Softmax sampling lets strong motivations dominate while leaving room for
// surprise. The same seed, state, and time always produce the same decision.
export function chooseAction(candidates: Candidate[], draw: number): Decision {
  const highest = Math.max(...candidates.map(c => c.score)), weights = candidates.map(c => Math.exp((c.score - highest) / .75)), total = weights.reduce((a, b) => a + b, 0)
  let cursor = draw * total
  for (let i = 0; i < candidates.length; i++) { cursor -= weights[i]; if (cursor <= 0) return candidates[i].decision }
  return candidates[candidates.length - 1].decision
}

export function localChapter(save: TownSave, now: Date): TownChapter {
  const slot = Math.floor(now.getTime() / CHAPTER_MS), at = new Date(slot * CHAPTER_MS), time = localParts(at), weather = weatherAt(at, save.seed)
  const meetingPlace = weather.label === "Rain" || weather.label === "Storm" || weather.temp < 35 ? "Library" : "Town Square"
  const meeting = time.hour >= 10 && time.hour <= 20 && time.hour % 2 === 0 && time.minute === 0 ? openProposals(save).sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))[0] || null : null
  const decisions = save.villagers.map(v => chooseAction(actionCandidates(save, v, at, meeting, meetingPlace), random(`${save.seed}:${slot}:${v.id}:choice`)))
  const participants = decisions.filter(d => meeting ? d.purpose === "civic" : d.purpose === "social").map(d => d.villagerId)
  const quiet = time.hour < 7 || time.hour >= 22, building = activeProject(save)
  const title = meeting ? `A village meeting: ${PROJECTS[meeting.projectIndex]}` : quiet ? "Porch lights and quiet lanes" : building ? "An idea becoming a shared place" : openProposals(save).length ? "Something to talk about" : "A little room for new ideas"
  const summary = meeting ? "The neighbors are gathering to hear the benefits, raise concerns, and decide together. A vote needs at least four people." : quiet ? "The village is settling in. Tomorrow’s plans can wait until morning." : building ? `Neighbors are finding time to help with ${PROJECTS[building.projectIndex].toLowerCase()}, between work, rest, and catching up.` : "Chance encounters can start a friendship, change an opinion, or plant the seed of a community project."
  return { id: `simulation:${slot}`, at: at.toISOString(), until: new Date((slot + 1) * CHAPTER_MS).toISOString(), headline: title, summary, event: { title, description: summary, place: meeting ? meetingPlace : decisions.find(d => d.purpose === "social")?.place || "Town Square", participantIds: participants, proposalId: meeting?.id || null }, decisions }
}

function encounter(save: TownSave, a: Villager, b: Villager, place: string, now: Date, meeting: Proposal | undefined) {
  const key = relationshipKey(a.id, b.id), previous = save.relationships[key] || { familiarity: 0, trust: 0, affection: 0, lastInteraction: 0 }
  if (now.getTime() - previous.lastInteraction < CHAPTER_MS) return false
  const seed = `${save.seed}:${now.getTime()}:${key}`, pa = personality(a, save.seed), pb = personality(b, save.seed)
  if (random(`${seed}:meet`) > .22 + (pa.sociability + pb.sociability) * .3 + previous.trust / 500 + (meeting ? .2 : 0)) return false
  const shared = a.interests.filter(interest => b.interests.includes(interest))
  const compatibility = (random(`${save.seed}:${key}:compatibility`) - .5) * .6
  const pleasant = random(`${seed}:mood`) < clamp(.5 + compatibility + shared.length * .08 + previous.trust / 300 + (pa.generosity + pb.generosity) * .06, .1, .95)
  const relation = { familiarity: clamp(previous.familiarity + 2), trust: clamp(previous.trust + (pleasant ? 1.5 : -2), -100, 100), affection: clamp(previous.affection + (pleasant ? 2 : -2.5), -100, 100), lastInteraction: now.getTime() }
  save.relationships[key] = relation; save.affinity[key] = relation.affection
  save.agents[a.id].social = clamp(save.agents[a.id].social - 13); save.agents[b.id].social = clamp(save.agents[b.id].social - 13)
  const proposal = meeting || openProposals(save)[Math.floor(random(`${seed}:topic`) * openProposals(save).length)]
  if (proposal && (meeting || random(`${seed}:civic`) < .5)) discussProject(save, proposal, a, b, now)
  else {
    const text = pleasant ? `${a.name} and ${b.name} caught up about ${shared[0] || a.interests[0]} at ${place}. They left feeling a little closer.` : `${a.name} and ${b.name} had an awkward conversation at ${place}. They gave each other a little space.`
    record(save, now.toISOString(), text, "social", [a.id, b.id])
  }
  if (previous.affection <= 16 && relation.affection > 16 && relation.trust > 8) record(save, now.toISOString(), `${a.name} and ${b.name} are becoming friends after making time for each other.`, "friendship", [a.id, b.id])
  return true
}

function step(save: TownSave, time: Date) {
  const beginning = new Date(time.getTime() - STEP_MS)
  if (!save.chapter || Date.parse(save.chapter.until) <= beginning.getTime() || Date.parse(save.chapter.at) > beginning.getTime()) save.chapter = localChapter(save, beginning)
  const chapter = save.chapter, meeting = save.civic.proposals.find(p => p.id === chapter.event.proposalId && p.status === "discussion")
  const activities = save.villagers.map(v => {
    const state = save.agents[v.id], decision = chapter.decisions.find(d => d.villagerId === v.id)!, activity = plan(v, beginning, save.forced, chapter)
    if (state.arrivesAt <= beginning.getTime()) state.location = state.destination
    if (state.destination !== activity.place) { state.destination = activity.place; state.arrivesAt = beginning.getTime() + travelTime(state.location, activity.place) }
    if (state.arrivesAt <= time.getTime()) state.location = state.destination
    const resting = activity.place === v.home && activity.indoors
    state.energy = clamp(state.energy + (resting ? 2.5 : activity.working ? -1 : -.4))
    state.social = clamp(state.social + (resting ? .15 : .65))
    return { villager: v, state, activity, decision }
  })
  // Only co-located, awake residents can interact; a pair has a cooldown and
  // each resident can take part in at most one encounter in this time step.
  const available = activities.filter(a => a.state.arrivesAt <= time.getTime() && a.state.location === a.activity.place && a.activity.label !== "Sleeping at home" && a.activity.place !== a.villager.home).sort((a, b) => random(`${save.seed}:${time.getTime()}:order:${a.villager.id}`) - random(`${save.seed}:${time.getTime()}:order:${b.villager.id}`))
  const used = new Set<string>()
  for (let i = 0; i < available.length; i++) for (let j = i + 1; j < available.length; j++) {
    const a = available[i], b = available[j]
    if (!used.has(a.villager.id) && !used.has(b.villager.id) && a.state.location === b.state.location && encounter(save, a.villager, b.villager, a.state.location, time, a.state.location === chapter.event.place ? meeting : undefined)) { used.add(a.villager.id); used.add(b.villager.id) }
  }
  if (meeting && time.getTime() === Date.parse(chapter.until)) {
    const attendees = activities.filter(a => a.decision.purpose === "civic" && a.activity.place === chapter.event.place && a.state.location === chapter.event.place && a.state.arrivesAt <= time.getTime()).map(a => a.villager.id)
    holdVote(save, meeting, attendees, time)
  }
  const building = activeProject(save)
  if (building) {
    const workers = activities.filter(a => a.activity.working && a.activity.place === "Main Street" && a.state.location === "Main Street" && a.state.arrivesAt <= time.getTime() && (a.decision.projectId === building.id || save.forced[a.villager.id] > beginning.getTime()))
    const work = workers.reduce((sum, a) => sum + (["civil engineer", "carpenter"].includes(a.villager.job) ? 2 : 1), 0)
    save.projects[building.projectIndex] = Math.min(650, save.projects[building.projectIndex] + work)
    if (save.projects[building.projectIndex] === 650) {
      building.status = "completed"; save.civic.activeProjectId = null
      record(save, time.toISOString(), `The neighbors finished ${PROJECTS[building.projectIndex].toLowerCase()}! An idea they discussed and chose together is now part of the village.`, "project", workers.map(a => a.villager.id))
      activateNextProject(save, time.toISOString())
    } else if (work > 0 && Math.floor(time.getTime() / STEP_MS) % 6 === 0) record(save, time.toISOString(), `${workers.map(a => a.villager.name.split(" ")[0]).join(", ")} put in a little work on ${PROJECTS[building.projectIndex].toLowerCase()}.`, "work")
  }
  if (Math.floor(time.getTime() / STEP_MS) % 12 === 0) proposeProject(save, time)
}

// Every mutation occurs on a private copy. Fixed buckets, seeded draws and
// half-hour commitments make offline replay match many smaller online updates.
export function advanceTown(original: TownSave, now: Date): TownSave {
  const end = now.getTime(), previous = Date.parse(original.cursor)
  if (!Number.isFinite(end) || (Number.isFinite(previous) && end < previous)) return original
  const save: TownSave = JSON.parse(JSON.stringify(original))
  if (!validateChapter(save.chapter)) save.chapter = null
  const start = Math.max(Number.isFinite(previous) ? previous : end, end - MAX_CATCHUP_MS)
  for (let bucket = Math.floor(start / STEP_MS) + 1; bucket <= Math.floor(end / STEP_MS); bucket++) step(save, new Date(bucket * STEP_MS))
  save.cursor = now.toISOString()
  if (!save.chapter || Date.parse(save.chapter.until) <= end) save.chapter = localChapter(save, now)
  return save
}
