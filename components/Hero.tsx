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
                        Thanks for visiting. On the top you should find links to some really cool things! If you want to explore more about me - feel free to also just keep scrolling below. There is plenty of good content on this page!
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