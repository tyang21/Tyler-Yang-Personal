import React from "react"
import Image from "next/image"
import Link from "next/link"
import { BsGithub } from "react-icons/bs"
import { FaExternalLinkAlt } from "react-icons/fa"
import SlideUp from "./SlideUp"

type Project = {
  name: string
  description: string
  image: string
  github: string
  link: string
  status: string
}

const projects: Project[] = [
  {
    name: "Ketchup!",
    description:
      "A macOS app that summarizes unread group messages by clustering related topics and generating concise titles and summaries with GPT-4, then helps draft responses back into iMessage.",
    image: "/ketchup.png",
    github: "https://github.com/shrey150/ketchup",
    link: "none",
    status: "Demo coming soon",
  },
  {
    name: "NetflixGPT",
    description:
      "A spoiler-aware companion for Netflix and Crunchyroll that answers context-aware questions based on metadata and your current episode progress.",
    image: "/netflixgpt.png",
    github: "https://github.com/shrey150/NetflixGPT",
    link: "none",
    status: "Chrome extension",
  },
  {
    name: "Gitlet",
    description:
      "A Java implementation of a Git-like version control system supporting repository initialization, staging, commits, branches, and merges.",
    image: "/gitlet.png",
    github: "none",
    link: "none",
    status: "Private spec available on request",
  },
]

const Projects = () => {
  return (
    <section id="projects" className="section-shell pb-12 md:pb-24">
      <div className="mb-10 text-center">
        <h2 className="headline">Projects</h2>
        <p className="subhead mx-auto mt-3 max-w-2xl">I don{"'"}t do software anymore but here are some projects I{"'"}ve done through the years.</p>
      </div>

      <div className="flex flex-col gap-8">
        {projects.map((project) => {
          const githubLink = isValidURL(project.github) ? project.github : null
          const externalLink = isValidURL(project.link) ? project.link : null

          return (
            <SlideUp key={project.name} offset="-200px 0px -100px 0px">
              <article className="frost-card grid gap-5 rounded-3xl p-5 shadow-md md:grid-cols-[1.15fr_1fr] md:p-7">
                <div>
                  {externalLink ? (
                    <Link href={externalLink} target="_blank" rel="noreferrer">
                      <Image
                        src={project.image}
                        alt={project.name}
                        width={1200}
                        height={720}
                        className="h-full min-h-[220px] w-full rounded-2xl border border-[var(--border)] object-cover transition hover:opacity-90"
                      />
                    </Link>
                  ) : (
                    <Image
                      src={project.image}
                      alt={project.name}
                      width={1200}
                      height={720}
                      className="h-full min-h-[220px] w-full rounded-2xl border border-[var(--border)] object-cover"
                    />
                  )}
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <p className="inline-flex rounded-full bg-sky-100/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-900 dark:bg-cyan-500/10 dark:text-cyan-200">
                      {project.status}
                    </p>
                    <h3 className="mt-3 text-2xl font-bold tracking-tight">{project.name}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--text-soft)] md:text-base">{project.description}</p>
                  </div>

                  <div className="mt-5 flex items-center gap-4">
                    {githubLink && (
                      <Link href={githubLink} target="_blank" rel="noreferrer" aria-label={`${project.name} GitHub`}>
                        <BsGithub size={27} className="transition hover:-translate-y-0.5" />
                      </Link>
                    )}
                    {externalLink && (
                      <Link href={externalLink} target="_blank" rel="noreferrer" aria-label={`${project.name} external link`}>
                        <FaExternalLinkAlt size={23} className="transition hover:-translate-y-0.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            </SlideUp>
          )
        })}
      </div>
    </section>
  )
}

function isValidURL(urlString: string) {
  try {
    const url = new URL(urlString)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

export default Projects
