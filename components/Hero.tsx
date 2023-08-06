"use client"
import React from 'react'
import Image from "next/image"
import { Link } from 'react-scroll/modules'

import { HiArrowDown } from 'react-icons/hi'
const Hero = () => {
    return (
        <section id="Home">
            <div className="flex flex-col text-center items-center justify-center my-10 py-16 md:flex-row md:space-x-4 md:text-left md:pt-52 sm:py-20">
                <div className="md:w-full md:mt-2 md:ml-20">
                    <Image className = "rounded-full shadow-2xl w-72 h-72 object-none" src="/headshot.png" alt="" width={300} height={300} />
                </div>
                <div className= "px-20">
                    <h1 className="font-bold text-2xl md:text-4xl">Hello Hello! I&#39;m Tyler, welcome!</h1>
                    <p className="mt-4 mb-6 text-lg">
                    Thank you for stopping by! At the top, you&#39;ll discover links to some incredibly exciting things. If you are interested in delving deeper into who I am, feel free to continue scrolling down. This page is packed with fantastic content! Additionally, you&#39;ll find icons at the bottom of the page that showcase my resume and social media profiles. If you prefer a different theme, simply click the button located in the bottom right corner to activate dark or light mode.
                    </p>
                </div>
            </div>
            <div className="flex flex-row justify-center mb-10">
                <Link
                    to="about"
                    activeClass="active"
                    spy={true}
                    smooth={true}
                    offset={-100}
                    duration={500}
                >
                    <HiArrowDown size={35} className="animate-bounce"/>
                </Link>
            </div>
        </section>
    )
}

export default Hero