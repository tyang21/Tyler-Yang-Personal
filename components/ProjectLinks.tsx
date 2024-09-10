import React from "react";
import Linker from 'next/link'
export const ProjectLinks = () => {
  return (
    <div className = "sm:py-20 p-4 flex flex-col flex-grow items-center justify-start min-h-screen w-full">
        <h1 className = "font-bold text-5xl py-4 underline">Projects</h1>
        <Linker href="CS180\Project1" className="font-bold text-5xl hover:text-neutral-500 cursor-pointer">
                Project 1
        </Linker>
    </div>
  )};
export default ProjectLinks;