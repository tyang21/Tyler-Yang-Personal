'use client';
import React, {useState} from 'react'
import { Link } from "react-scroll/modules"
// import { useTheme } from "next-themes"
import { RiMoonFill, RiSunLine } from "react-icons/ri"
import {useRouter} from 'next/navigation'
import Linker from 'next/link'
import { IoMdMenu, IoMdClose } from "react-icons/io"


const NavbarAboutPage = () => {
    const [navbar, setNavbar] = useState(false)
    const router = useRouter()
    return (
        <header className="w-full mx-auto px-4 bg-teal-100 text-sky-950 shadow fixed top-0 z-50 dark:bg-indigo-900 dark:border-b dark:border-indigo-500 dark:text-blue-100">
            <div className="justify-between md:items-center md:flex">
                <div>
                    <div className = "flex items-center justify-between py-3">
                        <div className="md:py-5 md:block">
                            <button type="button" onClick={() => router.back()}>
                                <h2 className='text-2xl font-bold'>Tyler Yang</h2>
                            </button>
                        </div>
                        <div className="md:hidden">
                            <button onClick={() => setNavbar(!navbar)}>
                                {navbar ? <IoMdClose size={30} /> : <IoMdMenu size={30}/>}
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <div 
                        className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${navbar ? "block" : "hidden"}`}>
                        <div className="items-center justify-center space-y-2 md:flex md:space-x-6 md:space-y-0">
                            AboutThisPage
                        </div>
                    </div>
                </div>
                
                
            </div>
        </header>
    )
}

export default NavbarAboutPage;