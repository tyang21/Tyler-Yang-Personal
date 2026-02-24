import React from "react";
import Linker from "next/link";

export const ProjectLinks = () => {
  return (
    <section className="section-shell pt-32 pb-14 md:pt-40 md:pb-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="headline">Projects</h1>
        </div>

        <div className="flex flex-col gap-4">
          <Linker
            href="/CS180/Project1"
            className="frost-card rounded-2xl px-6 py-5 text-center text-3xl font-bold tracking-tight transition hover:opacity-85 md:text-4xl"
          >
            Project 1
          </Linker>
          <Linker
            href="/CS180/Project2"
            className="frost-card rounded-2xl px-6 py-5 text-center text-3xl font-bold tracking-tight transition hover:opacity-85 md:text-4xl"
          >
            Project 2
          </Linker>
        </div>
      </div>
    </section>
  );
};

export default ProjectLinks;
