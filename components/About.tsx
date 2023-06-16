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
                    </div>
                </div>
            </div>

        </section>
    )
}


export default About