import Image from 'next/image'
import Hero from "../components/Hero"
import About from "../components/About"
export default function Home() {
  return (
    <main className=" px-4 sm:px-6 " >
      <Hero/>
      <About/>
    </main>
  )
}
