import React from 'react'
import Link from 'next/link'
import { AiOutlineYoutube} from "react-icons/ai"

const toolMap = [
    {
        name: "Next.js (13)",
        link: "https://nextjs.org/",
        description: "Next.js 13 was utilized as the primary framework for this site"
    },
    {
        name: "TailwindCSS (2.2)",
        link: "https://tailwindcss.com/",
        description: "TailwindCSS 2.2 was utilized as the primary CSS framework for this site"
    },
    {
        name: "React (17)",
        link: "https://reactjs.org/",
        description: "React 17 is the primary library used for this site. Next 13 is built on top of React 17"
    },
    {
        name: "Typescript (4.4)",
        link: "https://www.typescriptlang.org/",
        description: "Typescript 4.4 is the primary language used for this site"
    },
]

const Aboutpage = () => {
    return (
        <div className = " p-4 flex flex-col items-center justify-center mb-56 w-full">
            <h1 className = "font-bold text-5xl">How Did I Create This Page?</h1>
            <p className = "italic p-2">Several toolboxes were utilized to create this page explained below</p>
            <div className = "flex flex-col space-y-2 w-5/6">
                {toolMap.map((tool, idx) => (
                    <div key={idx} className = "flex flex-row items-center justify-between space-x-10">
                        <Link href={tool.link} rel="noreferrer" target="_blank">
                            <div className="rounded border-2 p-4 border-sky-200 dark:border-indigo-800 bg-blue-100 dark:bg-blue-900 hover:opacity-70">
                                <p className = "font-bold text-xl ">{tool.name}</p>
                            </div>
                        </Link>
                        <p className = "italic w-2/3">{tool.description}</p>
                    </div>
                    ))}
            </div>
            <p className="mt-8 text-xl"> This site's UI was largely inspired by Hosna Qasmei's awesome tutorial. Check it out below! </p>
            <Link href="https://www.youtube.com/watch?v=7gnVzj_nMJw&ab_channel=HosnaQasmei" rel="noreferrer" target="_blank">
                <div className="flex flex-row items-center justify-center space-x-2 mt-4">
                    <AiOutlineYoutube
                        className="hover:-translate-y-1 transition-transform cursor-pointer"
                        size={30}
                    />
                    <p className="font-bold text-xl">Hosna Qasmei's Tutorial</p>
                </div>
            </Link>
        </div>
    )
}

export default Aboutpage