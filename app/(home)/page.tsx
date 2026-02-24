import Hero from "../../components/Hero"
import About from "../../components/About"
import Projects from "../../components/Projects"

export default function Home() {
  return (
    <main className="pb-24">
      <Hero />
      <About />
      <Projects />
    </main>
  )
}
