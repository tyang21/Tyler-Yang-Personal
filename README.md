# Tyler Yang’s website

Next.js 13 / React 18 personal site. Exton Village lives at `/town`.

## Development

Use Node 24, then run `npm install` and `npm run dev`.

## Village simulation

The village runs entirely in TypeScript in the browser. No API key, model calls,
neural-network training, or additional game engine is required.

Each resident has a seeded personality: sociability, generosity, stubbornness,
diligence, and civic motivation. Energy and desire for company change over time.
Every thirty minutes, residents score their routine, rest, social visits, walks,
volunteering, and council meetings. Weighted sampling chooses an action from its
utility, with travel cost and personal state influencing the result. Commitments
last until the next decision round; sleep and visitor work requests take priority.

Residents travel to real destinations before encounters can occur. Encounters
depend on sociability, shared interests, trust, and a seeded random draw. They can
be pleasant or awkward, changing familiarity, trust, and affection in both
directions. Each resident participates in at most one encounter per five-minute
step, with a thirty-minute cooldown for a pair. Memories record actual events.

### Civic projects

During the day, villagers propose projects that fit their interests and values.
Up to two proposals can be under discussion at once. Each neighbor has an
individual opinion. Conversations raise concrete benefits, costs, or a smaller
first phase. Listeners change their support according to the argument, their
interests, stubbornness, and trust in the speaker. Dialogue uses templates tied
to actual project state; opinions and votes are computed by the simulation.

Meetings occur at 10 AM, noon, 2 PM, 4 PM, 6 PM, and 8 PM, village time, when
there is an open proposal. Residents choose whether to attend. At closing, a
vote requires at least four present residents, two prior discussions, and a
proposal at least thirty minutes old. Approval needs at least three yes votes
and more yes than no votes. A resident with a nearly neutral opinion abstains.
Deferred proposals can return after twelve hours with a smaller first phase.

Only approved projects receive construction progress. One project is built at a
time; others wait in a queue. Volunteers choose whether to contribute based on
support, generosity, civic motivation, energy, and job commitments. Contributions
require presence at the work site. Engineers and carpenters contribute faster.
Completed projects add flowers, lamps, tables, a fountain, a greenhouse, a
bandstand, a clock, paving, a windmill, a statue, creek plants, or a reading-room
book stand to the map.

The **Council** panel shows proposals, opinions, arguments, votes, and progress.
**People** shows motivations, needs, relationships, and memories. The **Almanac**
records encounters, civic discussions, votes, friendships, and construction.

### Replay and storage

Time advances in fixed five-minute steps using seeded random numbers. Identical
initial state, seed, and timestamps yield identical results whether advancing
in one offline replay or many smaller visits. New towns start with one day of
simulated history. Offline catch-up is limited to the latest three days. Logs
retain 250 entries and each resident retains eight memories. Existing saves
migrate without losing history or construction; unfinished existing projects
remain authorized. Old model-generated plans are discarded.

The town stays in this browser’s local storage. It is not a shared server town
and is not synchronized across devices. Date previews do not modify the save.
A persistent town shared by all visitors would require shared storage and a
scheduled worker; the decision engine itself would remain the same.

## Checks

```sh
npm run check:town
npm run lint
npm run build
```

Checks cover paths, animation, save migration, deterministic replay, different
seeds, needs and decisions, sleep, relationships, civic discussions, quorum,
approval and dissent, construction gating and completion, bounded offline
catch-up, and viewport lighting. No network access is needed for simulation tests.
