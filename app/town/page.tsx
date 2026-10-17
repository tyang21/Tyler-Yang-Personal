import IdleTown from "../../components/IdleTown"
import Link from "next/link"
import "./town.css"

export default function TownPage() {
  return <main className="town-page"><div className="town-page-inner"><div className="town-site-nav"><Link href="/">← Tyler Yang</Link><span>A quiet corner of the internet</span></div><IdleTown /></div></main>
}
