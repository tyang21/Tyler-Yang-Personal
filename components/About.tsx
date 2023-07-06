import React from 'react'
import '../styles/styles.css'
import { BsArrowRightCircle }  from 'react-icons/bs';

const MaxMap = [
    {
        lift: "Squat",
        max: 245
    },
    {
        lift: "Bench",
        max: 205
    },
    {
        lift: "Deadlift",
        max: 265
    },
    {
        lift: "Overhead Press",
        max: 120
    }
]

const About = () => {
    return (
        <section id="about">
            <div className="my-12 pb-12 md:pt-16 md:pb-40">
                <h1 className="text-center font-bold text-4xl">About me
                <hr className="w-16 h-1 mx-auto my-4 border-0 rounded bg-indigo-800 dark:bg-teal-200"></hr>
                </h1>
                <div className="flex flex-wrap items-stretch justify-center align-top md:flex-row md:text-left  md:px-20">
                    <div id="aboutMe" className="w-full" >
                        <p className = "flex italic">
                            It would be kind of lame for me to spew stuff that is already stated on my resume so let me share with you other things that may not be.
                        </p>
                        <h1> Meteorology</h1>
                        <p> I love weather so much. I like looking at radar maps. I like predicting when it snows. I am a fiend for abnormal weather events (as long as it doesn&#39;t kill me). I used to post weather report videos on my YouTube channel. Perhaps, one day, I&#39;ll start my very own weather blog.</p>
                        <h1> Geography</h1>
                        <p>Atlases were the most common type of book on my childhood shelves. I&#39;ve kind of lost my touch since high school but I can still list all the countries in the world.</p>
                        <h1>Music</h1>
                        <p> I&#39;ve been playing both the cello and piano for many years, but nowadays I&#39;ve really been honing my &#34;playing by ear&#34; skills. Name any song, and I&#39;ll be able to play it!</p>
                        <h1>City Landscapes</h1>
                        <p>I am fascinated by modern architecture. I could look at and appreciate city skylines forever! I have a list of all skyscrapers in the world above 950 feet, and someday I want to visit them all. In the future, I&#39;ll list an updated spreadsheet of all the buildings I&#39;ve seen so far; but in the mean time, check out my second instagram account @si.tai_ to follow my journey!</p>
                        <h1>Airplanes/Airports</h1>
                        <p>I was known as airplane master back in middle school because of my excitement of everything flying related. I hope to fly to as many commercial airports as possible. This is also documented on the @si.tai_ instagram.</p>
                        <h1>Gym</h1>
                        <p> I&#39;ve been lifting seriously during the summers for a couple of years. My current bodyweight is 195 pounds and current max&#39;s are listed below. I&#39;m running GZCLP this summer and will update maxes after August.</p>
                        <div className="flex flex-col md:px-60 space-y-4">
                            {MaxMap.map((lift, idx) => (
                                <div key={idx} className="flex flex-row items-center justify-between border-2 border-dashed rounded-xl py-2 space-y-2">
                                    <p className="w-1/2 mt-2 font-semibold">{lift.lift}</p>
                                    <BsArrowRightCircle size={30} className="align-center mt-2 pb-2"/>
                                    <p className="w-1/2 font-semibold">{lift.max}</p>
                                </div>
                            ))}
                        </div>
                        
                    </div>
                </div>
            </div>

        </section>
    )
}


export default About