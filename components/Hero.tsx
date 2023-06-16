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
                    <h1 className="font-bold text-2xl md:text-4xl">Hello Hello! I'm Tyler, welcome to my page!</h1>
                    <p className="mt-4 mb-6 text-lg">
                        I code and do that kind of stuff - but I'm also an avid weather enthusiast, geography buff, piano man, anime lover, and overachiever.
                        Currently, one of my sidequests is being able to explore as many airports as possible and as many skyscrapers (and cities too) as possible.
                        Check below for some of my most meaningful projects as well as the rest of the page for my hobbies.
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