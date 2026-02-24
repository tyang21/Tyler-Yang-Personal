import React from 'react';
import {
    AiOutlineGithub,
    AiOutlineFile,
    AiOutlineLinkedin,
    AiOutlineInstagram
} from 'react-icons/ai';

const Footer = () => {
    return (
        <footer className="w-full px-4 pb-6 pt-2 sm:px-6 md:pb-8">
            <div className="section-shell">
            <div className="frost-card rounded-2xl px-4 py-4 shadow-sm md:px-6">
            <div className="mx-auto flex flex-col text-center md:flex-row md:items-center md:justify-between">
                <div className="text-sm font-medium text-[var(--text-soft)]">Check out my links!</div>
                <div className="mt-2 flex flex-row items-center justify-center space-x-3 md:mt-0">
                <a href="https://github.com/tyang21" rel="noreferrer" target="_blank">
                    <AiOutlineGithub
                    className="cursor-pointer transition hover:-translate-y-1" 
                    size={30}
                    />
                </a>
                <a href="https://www.linkedin.com/in/tyler-yang-4160981b3/" rel="noreferrer" target="_blank">
                    <AiOutlineLinkedin
                    className="cursor-pointer transition hover:-translate-y-1"
                    size={30}
                    />
                </a>
                <a href="https://www.instagram.com/tyler.yang_/" rel="noreferrer" target="_blank">
                    <AiOutlineInstagram
                    className="cursor-pointer transition hover:-translate-y-1"
                    size={30}
                    />
                </a>
                <a href="/Yang_Tyler_Resume.pdf" rel="noreferrer" target="_blank">
                    <AiOutlineFile
                    className="cursor-pointer transition hover:-translate-y-1"
                    size={30}
                    />
                </a>
                </div>
            </div>
            </div>
            </div>
        </footer>
    )
}

export default Footer
