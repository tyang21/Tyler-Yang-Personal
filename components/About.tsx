import React from "react"

type Interest = {
  title: string
  text: string
  linkLabel?: string
  linkHref?: string
}

const interests: Interest[] = [
  {
    title: "Meteorology",
    text: "I love weather so much. I like looking at radar maps. I like predicting when it snows. I am a fiend for abnormal weather events (as long as it doesn't kill me). I used to post weather report videos on my YouTube channel. Perhaps, one day, I'll start my very own weather blog. I was apart of Climate Dynamics at Berkeley for 2 years doing research under Professor William Boos. We just did a really cool joint project on Indian Monsoon Onset Prediction with UChicago. You can find a link to the press release below.",
    linkLabel: "Monsoon Onset Prediction Landing Page",
    linkHref: "https://humancenteredforecasts.climate.uchicago.edu/forecasting-the-onset-of-the-indian-monsoon/",
  },
  {
    title: "Geography",
    text: "Atlases were the most common type of book on my childhood shelves. I've kind of lost my touch since high school but I can still list all the countries in the world.",
  },
  {
    title: "Music",
    text: "I've been playing both the cello and piano for many years, but nowadays I've really been honing my \"playing by ear\" skills. Name any song, and I'll be able to play it!",
  },
  {
    title: "City Landscapes",
    text: "I am fascinated by modern architecture. I could look at and appreciate city skylines forever! I have a list of all skyscrapers in the world above 950 feet, and someday I want to visit them all. In the future, I'll list an updated spreadsheet of all the buildings I've seen so far; but in the mean time, check out my second instagram account @si.tai_ to follow my journey!",
  },
  {
    title: "Airplanes and Airports",
    text: "I was known as airplane master back in middle school because of my excitement of everything flying related. I hope to fly to as many commercial airports as possible. This is also documented on the @si.tai_ instagram.",
  },
]

const lifts = [
  { lift: "Squat", max: 275 },
  { lift: "Bench", max: 225 },
  { lift: "Deadlift", max: 265 },
  { lift: "Overhead Press", max: 120 },
]

const About = () => {
  return (
    <section id="about" className="section-shell mt-14 pb-12 md:mt-20 md:pb-20">
      <div className="mb-10 text-center">
        <h2 className="headline">About Me</h2>
        <p className="subhead mx-auto mt-3 max-w-2xl">
          It would be kind of lame for me to spew stuff that is already stated on my resume so let me share with you other things that may not be.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {interests.map((item) => (
          <article key={item.title} className="frost-card rounded-2xl p-5 shadow-sm">
            <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-soft)] md:text-base">{item.text}</p>
            {item.linkHref && item.linkLabel && (
              <a
                href={item.linkHref}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm font-semibold text-sky-700 underline decoration-2 underline-offset-2 dark:text-cyan-300"
              >
                {item.linkLabel}
              </a>
            )}
          </article>
        ))}
      </div>

      <div className="frost-card mt-6 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold tracking-tight">Gym Snapshot</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-soft)] md:text-base">
          {"Now that I'm graduated its time to lock in. Currently losing weight so max's don't stay the same. 185 pound body weight with (probably) these lifts"}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {lifts.map((item) => (
            <div key={item.lift} className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4 text-center">
              <p className="text-sm font-medium text-[var(--text-soft)]">{item.lift}</p>
              <p className="mt-1 text-2xl font-bold">{item.max}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About
