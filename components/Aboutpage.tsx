import React from "react"
import Link from "next/link"
import { AiOutlineYoutube } from "react-icons/ai"

const toolMap = [
  {
    name: "Next.js (13)",
    link: "https://nextjs.org/",
    description: "Primary framework used to build and route this site.",
  },
  {
    name: "Tailwind CSS",
    link: "https://tailwindcss.com/",
    description: "Utility-first styling system used for layout, spacing, and components.",
  },
  {
    name: "React",
    link: "https://reactjs.org/",
    description: "Core UI library powering reusable interactive components.",
  },
  {
    name: "TypeScript",
    link: "https://www.typescriptlang.org/",
    description: "Typed language layer used across components for safer refactors.",
  },
]

const Aboutpage = () => {
  return (
    <section className="section-shell pt-32 pb-14 md:pt-40 md:pb-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="headline">How I Built This Site</h1>
          <p className="subhead mt-3">
            The core stack and tools used to design, build, and maintain this portfolio.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {toolMap.map((tool) => (
            <article key={tool.name} className="frost-card rounded-2xl p-5 shadow-sm md:p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
                <Link
                  href={tool.link}
                  rel="noreferrer"
                  target="_blank"
                  className="inline-flex w-fit rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2 text-base font-semibold transition hover:opacity-85"
                >
                  {tool.name}
                </Link>
                <p className="text-sm italic text-[var(--text-soft)] md:text-base">{tool.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="frost-card mt-8 rounded-2xl p-6 shadow-sm">
          <p className="text-base font-semibold">Versions</p>
          <div className="relative mt-4 space-y-6 pl-8">
            <div className="absolute left-3 top-1 h-[calc(100%-0.5rem)] w-px bg-[var(--border)]" />

            <article className="relative rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
              <span className="absolute -left-[1.62rem] top-5 h-3 w-3 rounded-full bg-[var(--accent)] ring-4 ring-[var(--bg-start)]" />
              <p className="text-sm font-semibold text-[var(--text-main)]">V1 [Jan 2024]</p>
              <p className="mt-2 text-sm text-[var(--text-soft)]">Inspired by Hosna Qasmei&apos;s tutorial.</p>
              <Link
                href="https://www.youtube.com/watch?v=7gnVzj_nMJw&ab_channel=HosnaQasmei"
                rel="noreferrer"
                target="_blank"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-main)] underline underline-offset-2"
              >
                <AiOutlineYoutube size={18} />
                Tutorial
              </Link>
            </article>

            <article className="relative rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
              <span className="absolute -left-[1.62rem] top-5 h-3 w-3 rounded-full bg-[var(--accent)] ring-4 ring-[var(--bg-start)]" />
              <p className="text-sm font-semibold text-[var(--text-main)]">V2 [Feb 2026]</p>
              <p className="mt-2 text-sm text-[var(--text-soft)]">Stylistic overhaul with the current visual system.</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Aboutpage
