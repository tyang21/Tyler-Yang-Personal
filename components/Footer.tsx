import React from 'react';
import {
    AiOutlineGithub,
    AiOutlineFile,
    AiOutlineLinkedin,
    AiOutlineInstagram
} from 'react-icons/ai';

const Footer = () => {
    return (
        <footer className="mx-auto px-4 sm:px-6 bg-gradient-to-r  text-sky-950  dark:from-blue-950 dark:to-indigo-950 dark:text-blue-200 ">
            <hr className="w-full h-1 mx-auto border-2 border-blue-900 dark:border-sky-100 rounded border-dashed "></hr>
            <div className="mx-auto  p-4 flex flex-col text-center md:flex-row md:justify-between">
                <div>Check out my links!</div>
                <div className="flex flex-row items-center justify-center space-x-2 mb-1">
                <a href="https://github.com/tyang21" rel="noreferrer" target="_blank">
                    <AiOutlineGithub
                    className="hover:-translate-y-1 transition-transform cursor-pointer" 
                    size={30}
                    />
                </a>
                <a href="https://www.linkedin.com/in/tyler-yang-4160981b3/" rel="noreferrer" target="_blank">
                    <AiOutlineLinkedin
                    className="hover:-translate-y-1 transition-transform cursor-pointer"
                    size={30}
                    />
                </a>
                <a href="https://www.instagram.com/tyler.yang_/" rel="noreferrer" target="_blank">
                    <AiOutlineInstagram
                    className="hover:-translate-y-1 transition-transform cursor-pointer"
                    size={30}
                    />
                </a>
                <a href="/Yang_Tyler_Resume.pdf" rel="noreferrer" target="_blank">
                    <AiOutlineFile
                    className="hover:-translate-y-1 transition-transform cursor-pointer"
                    size={30}
                    />
                </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer