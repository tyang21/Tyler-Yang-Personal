import React from 'react'
import Image from "next/image"
import Link from "next/link"
import {BsGithub} from "react-icons/bs"
import {FaExternalLinkAlt} from "react-icons/fa"
const projects = [
    {
        name: "Ketchup!",
        description: "A Quality-of-Life MacOS app that performs a topic summarization of all unread messages. A demoable link will be available in the near future!",
        image: "/ketchup.png",
        github: "https://github.com/shrey150/ketchup",
        link: "none"
    },
    {
        name: "NetflixGPT",
        description: "A Netflix AI chatbot companion that provides spoiler-free context-aware Q&A powered by OpenAI's GPT-4. Currently works as a chrome extension that will scrape netflix metadata so you can just ask your question within a show and episode and answers with context up to your current episode will be provided! A demoable link will be available in the near future!",
        image: "/netflixgpt.png",
        github:"https://github.com/shrey150/NetflixGPT",
        link: "None"
    },
    {
        name: "Gitlet",
        description: "A file version-control system inspired by git that is supports many core features. The full spec is on the github page, but it is capable of initializing a repository, adding files, committing files, branching, merging, and more! If you want access to the full-spec, please contact me as it is private.",
        image: "/gitlet.png",
        github: "none",
        link: "none"
    }
]

const Projects = () => {
    return (
        <section id="projects">
            <h1 className="text-center font-bold text-4xl">Projects
            <hr className="w-16 h-1 mx-auto my-4 border-0 rounded bg-indigo-800 dark:bg-teal-200"></hr>
            </h1>
            <div className="flex flex-col space-y-28">
                {projects.map((project, idx) => {
                    const hasGithubLink = project.hasOwnProperty("github")
                    const hasExternalLink = project.hasOwnProperty("link")
                    const githubLink = hasGithubLink && isValidURL(project.github) ? project.github : null;
                    const externalLink = hasExternalLink && isValidURL(project.link) ? project.link : null;
                    return (
                        <div key={idx}>
                            <div className = "flex flex-col md:flex-row md:space-x-12">
                                <div className=" mt-8 md:w-1/2">
                                    {hasExternalLink ? (
                                        <Link href={project.link} target="_blank">
                                            <Image src={project.image} alt="" width={1000} height={1000} className="rounded-xl shadow-xl hover:opacity-70"/>
                                        </Link>
                                    ) : (<Image src={project.image} alt="" width={1000} height={1000} className="rounded-xl shadow-xl hover:opacity-70"/>)}
                                </div>
                                <div className="mt-12 md:w-1/2">
                                    <h1 className="text-4xl font-bold mb-6">{project.name}</h1>
                                    <p className="text-xl mb-4">{project.description}</p>
                                    <div className="flex flex-row align-bottom space-x-4">
                                        {githubLink && (
                                            <Link href={project.github} target="_blank">
                                                <BsGithub 
                                                    size={30} 
                                                    className="hover:-translate-y-1 transition-transform cursor-pointer text-gray-900 dark:text-gray-100 hover:text-gray-500 dark:hover:text-gray-400"/>
                                            </Link>
                                        )}
                                        {externalLink && (
                                            <Link href={project.link} target="_blank">
                                                <FaExternalLinkAlt
                                                    size={30}
                                                    className="hover:-translate-y-1 transition-transform cursor-pointer text-gray-900 dark:text-gray-100 hover:text-gray-500 dark:hover:text-gray-400"/>
                                            
                                            </Link>
                                        )}
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                    })}
            </div>
        </section>
    )
}
function isValidURL(urlString: string) {
    try {
      const url = new URL(urlString);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  }

export default Projects