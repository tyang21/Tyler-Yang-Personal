import Image from 'next/image'
import Hero from "../components/Hero"
import About from "../components/About"
import Projects from "../components/Projects"
export default function Home() {
  return (
    <main className=" px-4 sm:px-6 bg-gradient-to-r from-cyan-300 to-teal-200 text-sky-950  dark:from-blue-950 dark:to-indigo-950 dark:text-blue-200" >
      <Hero/>
      <About/>
      <Projects/>
    </main>
  )
}
