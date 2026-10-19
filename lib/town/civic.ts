import { CivicArgument, PROJECTS, Proposal, Relationship, TownSave, Villager, localParts, random } from "./world"

export const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n))
export const relationshipKey = (a: string, b: string) => [a, b].sort().join(":")
export function personality(v: Villager, seed: number) {
  const trait = (name: string) => random(`${seed}:${v.id}:${name}`)
  return {
    sociability: clamp(trait("social") + (v.traits.includes("sociable") ? .25 : 0), 0, 1),
    generosity: clamp(trait("generous") + (v.traits.includes("kind") ? .2 : 0), 0, 1),
    stubbornness: .15 + trait("stubborn") * .7,
    diligence: .35 + trait("diligent") * .6,
    civic: .3 + trait("civic") * .65,
  }
}

// Indices preserve older construction saves. These are actual argument topics,
// rather than interchangeable dialogue unrelated to a project's benefits/costs.
const details = [
  { tags: ["nature", "art"], benefit: "give pollinators a home and brighten the green", concern: "who will keep the beds watered", cost: .2 },
  { tags: ["craft", "nature"], benefit: "make the evening walk home safer", concern: "the wiring and ongoing electricity bill", cost: .45 },
  { tags: ["cooking", "nature"], benefit: "give neighbors somewhere to share a meal", concern: "weatherproof timber and upkeep", cost: .3 },
  { tags: ["art", "nature"], benefit: "create a gathering place in the square", concern: "water use and maintenance", cost: .8 },
  { tags: ["nature", "cooking"], benefit: "grow food beyond the summer months", concern: "heating it through winter", cost: .7 },
  { tags: ["music", "art"], benefit: "make room for free concerts and performances", concern: "the cost of a stage and noise in the evening", cost: .65 },
  { tags: ["craft", "art"], benefit: "give the village a useful shared landmark", concern: "paying for a clock mechanism and repairs", cost: .85 },
  { tags: ["craft", "nature"], benefit: "make the lanes easier to use after rain", concern: "disruption while the lanes are resurfaced", cost: .6 },
  { tags: ["nature", "craft"], benefit: "demonstrate a small source of renewable power", concern: "the machinery, siting, and construction cost", cost: .9 },
  { tags: ["art", "books"], benefit: "celebrate the stories of the people who live here", concern: "spending on decoration before practical needs", cost: .55 },
  { tags: ["nature", "craft"], benefit: "protect the creek banks and improve wildlife habitat", concern: "the materials and time needed to restore the banks", cost: .4 },
  { tags: ["books", "art"], benefit: "make a welcoming place for reading and community classes", concern: "finding furniture and volunteers to keep it open", cost: .35 },
]
export function projectDetails(index: number) { return { ...details[index], name: PROJECTS[index] } }
export function interestFit(v: Villager, index: number) {
  return projectDetails(index).tags.filter(tag => v.interests.includes(tag)).length / 2
}
export const opinionLabel = (value: number) => value > .1 ? "In favor" : value < -.1 ? "Concerned" : "Considering"
export function relationshipLabel(r: Relationship) {
  return r.trust < -8 || r.affection < -8 ? "Some tension" : r.affection > 16 && r.trust > 8 ? "Friends" : r.familiarity > 8 ? "Getting closer" : "Getting acquainted"
}
export function activeProject(save: TownSave) { return save.civic.proposals.find(p => p.id === save.civic.activeProjectId && p.status === "building") }
export function openProposals(save: TownSave) { return save.civic.proposals.filter(p => p.status === "discussion") }
export function record(save: TownSave, at: string, text: string, kind: string, residentIds: string[] = []) {
  save.log = [{ at, text, kind }, ...save.log].slice(0, 250)
  for (const id of residentIds) save.memories[id] = [{ at, text }, ...(save.memories[id] || [])].slice(0, 8)
}
export function initialOpinion(v: Villager, index: number, seed: number) {
  const p = personality(v, seed), idea = projectDetails(index)
  return clamp(.12 + interestFit(v, index) * .85 + p.civic * .18 - idea.cost * (1 - p.generosity) * .8 + (random(`${seed}:${v.id}:opinion:${index}`) - .5) * .65, -1, 1)
}

export function proposeProject(save: TownSave, now: Date) {
  const time = now.getTime(), hour = localParts(now).hour
  if (hour < 8 || hour >= 21 || openProposals(save).length >= 2) return
  const newest = Math.max(0, ...save.civic.proposals.map(p => Date.parse(p.createdAt)))
  if (time - newest < 90 * 60000) return
  const candidates = save.villagers.filter(v => hour >= v.wake && hour < v.bed)
  const proposer = candidates.sort((a, b) => (personality(b, save.seed).civic + random(`${save.seed}:${time}:${b.id}`)) - (personality(a, save.seed).civic + random(`${save.seed}:${time}:${a.id}`)))[0]
  if (!proposer) return
  const available = PROJECTS.map((_, index) => index).filter(index => save.projects[index] < 650 && !save.civic.proposals.some(p => p.projectIndex === index && (p.status !== "deferred" || p.retryAt > time)))
  available.sort((a, b) => (initialOpinion(proposer, b, save.seed) + random(`${save.seed}:${time}:idea:${b}`) * .35) - (initialOpinion(proposer, a, save.seed) + random(`${save.seed}:${time}:idea:${a}`) * .35))
  const index = available[0]
  if (index === undefined) return
  const previous = save.civic.proposals.find(p => p.projectIndex === index)
  const proposal: Proposal = {
    id: `project:${index}`, projectIndex: index, proposerId: proposer.id, createdAt: now.toISOString(), status: "discussion",
    opinions: previous?.opinions ? { ...previous.opinions } : Object.fromEntries(save.villagers.map(v => [v.id, initialOpinion(v, index, save.seed)])),
    arguments: previous?.arguments || [], discussionCount: 0, revised: !!previous, votes: {}, votedAt: null, retryAt: 0,
  }
  proposal.opinions[proposer.id] = Math.max(.65, proposal.opinions[proposer.id])
  save.civic.proposals = [...save.civic.proposals.filter(p => p.id !== proposal.id), proposal]
  const idea = projectDetails(index)
  record(save, now.toISOString(), `${proposer.name} ${previous ? "brought back a smaller version of" : "proposed"} ${idea.name.toLowerCase()}: “We could ${idea.benefit}.” The neighbors will discuss it before deciding.`, "proposal", [proposer.id])
}

export function discussProject(save: TownSave, proposal: Proposal, speaker: Villager, listener: Villager, now: Date) {
  const at = now.toISOString(), key = `${save.seed}:${at}:${speaker.id}:${listener.id}`, idea = projectDetails(proposal.projectIndex)
  const relation = save.relationships[relationshipKey(speaker.id, listener.id)]
  const speakerOpinion = proposal.opinions[speaker.id] ?? initialOpinion(speaker, proposal.projectIndex, save.seed)
  const old = proposal.opinions[listener.id] ?? initialOpinion(listener, proposal.projectIndex, save.seed)
  const profile = personality(listener, save.seed)
  const compromise = !proposal.revised && proposal.arguments.some(a => a.kind === "cost") && random(`${key}:compromise`) < .35
  const kind: CivicArgument["kind"] = compromise ? "compromise" : speakerOpinion < .05 || random(`${key}:caution`) < .15 ? "cost" : "benefit"
  const text = kind === "benefit" ? `“${idea.name} would ${idea.benefit}.”` : kind === "cost" ? `“Before we commit to ${idea.name.toLowerCase()}, I’m concerned about ${idea.concern}.”` : `“Could we start ${idea.name.toLowerCase()} in a smaller first phase and share the work?”`
  const target = kind === "benefit" ? .85 : kind === "cost" ? -.65 : .6
  const resonance = kind === "cost" ? 1 - profile.generosity * .5 : .6 + interestFit(listener, proposal.projectIndex)
  const influence = .24 * (1 - profile.stubbornness) * clamp(.8 + (relation?.trust || 0) / 100, .2, 1.5) * resonance
  const next = clamp(old + (target - old) * influence, -1, 1)
  proposal.opinions[listener.id] = next
  if (compromise) proposal.revised = true
  proposal.discussionCount++
  proposal.arguments = [{ at, speakerId: speaker.id, listenerId: listener.id, kind, text, shift: next - old }, ...proposal.arguments].slice(0, 12)
  const reaction = next > old + .02 ? "is warming to the idea" : next < old - .02 ? "has more reservations" : "is still weighing it up"
  record(save, at, `${speaker.name}: ${text} ${listener.name} ${reaction}.`, "discussion", [speaker.id, listener.id])
}

export function activateNextProject(save: TownSave, at: string) {
  if (activeProject(save)) return
  const next = save.civic.proposals.find(p => p.status === "approved" && save.projects[p.projectIndex] < 650)
  save.civic.activeProjectId = next?.id || null
  if (next) { next.status = "building"; record(save, at, `Work can begin on ${PROJECTS[next.projectIndex].toLowerCase()}. Neighbors can volunteer as time and energy allow.`, "project") }
}

export function holdVote(save: TownSave, proposal: Proposal, attendeeIds: string[], now: Date) {
  if (proposal.status !== "discussion") return
  const attendees = Array.from(new Set(attendeeIds)).filter(id => save.villagers.some(v => v.id === id))
  if (attendees.length < 4 || proposal.discussionCount < 2 || now.getTime() - Date.parse(proposal.createdAt) < 30 * 60000) {
    record(save, now.toISOString(), `The meeting on ${PROJECTS[proposal.projectIndex].toLowerCase()} closed with ${attendees.length} neighbors present. ${attendees.length < 4 ? "Four are needed for a quorum" : "The neighbors want more discussion"}; the decision will wait.`, "meeting")
    return
  }
  proposal.votes = Object.fromEntries(attendees.map(id => {
    const opinion = proposal.opinions[id] || 0
    return [id, Math.abs(opinion) < .05 ? null : opinion > 0]
  }))
  proposal.votedAt = now.toISOString()
  const votes = Object.values(proposal.votes), yes = votes.filter(v => v === true).length, no = votes.filter(v => v === false).length, abstain = votes.filter(v => v === null).length
  const passed = yes > no && yes >= 3
  proposal.status = passed ? "approved" : "deferred"; proposal.retryAt = passed ? 0 : now.getTime() + 12 * 60 * 60000
  record(save, now.toISOString(), `${PROJECTS[proposal.projectIndex]}: ${yes} in favor, ${no} against, ${abstain} abstaining. ${passed ? `The proposal passed${proposal.revised ? " with a smaller first phase" : ""}.` : "The proposal was deferred for another day."}`, "vote", attendees)
  activateNextProject(save, now.toISOString())
}
