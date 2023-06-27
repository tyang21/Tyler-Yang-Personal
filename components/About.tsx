import React from 'react'
import '../styles/styles.css'

const About = () => {
    return (
        <section id="about">
            <div className="my-12 pb-12 md:pt-16 md:pb-40">
                <h1 className="text-center font-bold text-4xl">About me</h1>
                <div className="flex flex-col items-stretch justify-center align-top md:flex-row md:text-left md:py-4 md:px-20">
                    <div id="aboutMe" >
                        <p>
                            It would be kind of lame for me to spew stuff that is already stated on my resume so let me share with you other things that may not be.
                        </p>
                        <h1> Meteorology</h1>
                        <p> I love weather so much. I like looking at radar maps. I like predicting when it snows. I am a fiend for abnormal weather events (as long as it doesn't kill me). I used to post weather videos on my youtube channel with a weather report. Perhaps I'll start a weather blog sometime</p>
                        <h1> Geography</h1>
                        <p>The books I would read the most when I was little were atlas's. I've kind of lost my touch since highschool but I can still list all the countries in the world.</p>
                        <h1>Music</h1>
                        <p> I play both the Cello and the Piano and have been for years, but nowadays i've really been honing in my PlayByEar skills. Ask me any song and I'll be able to play it!</p>
                        <h1>City Landscapes</h1>
                        <p> I love modern architecture. I could look and appreciate at skyscrapers forever. One of my bucket lists is to visit all skyscrapers in the world that are above 950 feet. In the future, I'll list an updated spreadsheet of how many buildings I've visited. Otherwise checkout my second instagram account @si.tai_ to follow my journey!</p>
                        <h1>Airplanes/Airports</h1>
                        <p>I was known as airplane master back in middle school because of self explanatory reasons. I hope to fly to as many commercial airports as possible. This is also documented on the @si.tai_ instagram.</p>
                    </div>
                </div>
            </div>

        </section>
    )
}


export default About