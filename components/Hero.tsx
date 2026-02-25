"use client"

import React from "react"
import Image from "next/image"
import { Link } from "react-scroll/modules"
import { HiArrowDown } from "react-icons/hi"

const Hero = () => {
  return (
    <section id="Home" className="section-shell pt-32 md:pt-40">
      <div className="frost-card grid items-center gap-10 rounded-3xl p-6 shadow-lg md:grid-cols-[320px_1fr] md:p-10">
        <div className="mx-auto">
          <Image
            className="h-64 w-64 rounded-3xl object-cover shadow-2xl ring-2 ring-white/40 md:h-72 md:w-72"
            src="/headshot.png"
            alt="Portrait of Tyler Yang"
            width={320}
            height={320}
            priority
          />
        </div>

        <div>
          <p className="mb-3 inline-flex rounded-full bg-sky-100/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-sky-900 dark:bg-cyan-500/10 dark:text-cyan-200">
            RTL Design Engineer
          </p>
          <h1 className="headline">Hi! I'm Tyler!</h1>
          <p className="subhead mt-4 max-w-2xl">
            Thank you for stopping by! At the top, you{"'"}ll discover links to some incredibly exciting things. If you are interested in delving deeper into who I am, feel free to continue scrolling down. This page is packed with fantastic content! Additionally, you{"'"}ll find icons at the bottom of the page that showcase my resume and social media profiles. If you prefer a different theme, simply click the button located in the bottom right corner to activate dark or light mode.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="/Yang_Tyler_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
            >
              View Resume
            </a>
            <Link
              to="projects"
              activeClass="active"
              spy
              smooth
              offset={-90}
              duration={500}
              className="cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-5 py-2.5 text-sm font-semibold"
            >
              See Projects
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Link to="about" activeClass="active" spy smooth offset={-90} duration={500}>
          <HiArrowDown size={34} className="animate-bounce text-[var(--text-soft)]" />
        </Link>
      </div>
    </section>
  )
}

export default Hero
