import { PROJECTS, TownSave } from "../lib/town/world"
import { opinionLabel, projectDetails } from "../lib/town/civic"

const statusLabels = { discussion: "Under discussion", approved: "Approved · waiting for a crew", building: "Taking shape", completed: "Part of the village", deferred: "Deferred · time to reconsider" }
export default function TownCouncil({ save, onSelect }: { save: TownSave; onSelect: (id: string) => void }) {
  const priorities = { discussion: 0, building: 1, approved: 2, deferred: 3, completed: 4 }
  const proposals = [...save.civic.proposals].sort((a, b) => priorities[a.status] - priorities[b.status] || Date.parse(b.createdAt) - Date.parse(a.createdAt))
  return <div className="village-panel-content"><p className="village-eyebrow">THE VILLAGE COUNCIL</p><h2>{"An idea needs\na few neighbors."}</h2><p className="village-description">Meetings begin at 10 AM, noon, 2 PM, 4 PM, 6 PM, and 8 PM when there’s a proposal to discuss. Four neighbors make a quorum. Three yes votes and a majority are needed to approve a project.</p>
    {proposals.length === 0 && <div className="village-town-event"><h3>The noticeboard has room</h3><p>Neighbors bring new proposals during the day. The first conversations are still ahead.</p></div>}
    <div className="village-council-list">{proposals.map(proposal => {
      const idea = projectDetails(proposal.projectIndex), votes = Object.values(proposal.votes), proposer = save.villagers.find(v => v.id === proposal.proposerId)
      return <article className="village-proposal" key={proposal.id}>
        <span className={`village-proposal-status village-proposal-${proposal.status}`}>{statusLabels[proposal.status]}</span>
        <h3>{PROJECTS[proposal.projectIndex]}</h3><p className="village-proposal-by">Proposed by <button onClick={() => onSelect(proposal.proposerId)}>{proposer?.name}</button></p>
        <p>Could {idea.benefit}.</p><p className="village-proposal-concern">The question: {idea.concern}.</p>
        {proposal.revised && <p className="village-proposal-revision">A smaller first phase is on the table.</p>}
        {proposal.status === "building" && <label className="village-build-meter">Built <meter min="0" max="650" value={save.projects[proposal.projectIndex]} /> {Math.round(save.projects[proposal.projectIndex] / 650 * 100)}%</label>}
        {proposal.votedAt && <p className="village-vote-result">Last vote: {votes.filter(v => v === true).length} for · {votes.filter(v => v === false).length} against · {votes.filter(v => v === null).length} abstaining</p>}
        <details open={proposal.status === "discussion"}><summary>Where the neighbors stand</summary><div className="village-opinions">{save.villagers.map(v => <button key={v.id} onClick={() => onSelect(v.id)}><span>{v.name.split(" ")[0]}</span><em data-stance={(proposal.opinions[v.id] || 0) > .1 ? "for" : (proposal.opinions[v.id] || 0) < -.1 ? "against" : "undecided"}>{opinionLabel(proposal.opinions[v.id] || 0)}</em></button>)}</div></details>
        {proposal.arguments.length > 0 && <div className="village-debate"><p className="village-eyebrow">HEARD AROUND THE VILLAGE</p>{proposal.arguments.slice(0, 3).map((argument, i) => <blockquote key={`${argument.at}-${i}`}><strong>{save.villagers.find(v => v.id === argument.speakerId)?.name.split(" ")[0]}</strong> {argument.text}<small>{save.villagers.find(v => v.id === argument.listenerId)?.name.split(" ")[0]} {argument.shift > .02 ? "is warming to the idea" : argument.shift < -.02 ? "has more reservations" : "is still thinking it over"}.</small></blockquote>)}</div>}
      </article>
    })}</div>
  </div>
}
