"use client"
import React, {useState} from 'react'
import { Link } from "react-scroll/modules"
// import { useTheme } from "next-themes"
import { RiMoonFill, RiSunLine } from "react-icons/ri"
import { IoMdMenu, IoMdClose } from "react-icons/io"
import Linker from 'next/link'

interface NavItem {
    label: string
    page: string
}

const NAV_ITEMS: Array<NavItem> = [
    {
        label: "Home",
        page: "Home",
    },
    { 
        label: "AboutMe",
        page: "about",
    },
    {
        label: "Projects",
        page: "projects",
    },
]

const Navbar = () => {
    // const {systemTheme, theme, setTheme } = useTheme()

    // const currentTheme = theme === "system" ? systemTheme : theme
    // console.log(currentTheme)
    const [navbar, setNavbar] = useState(false)


    return (
        <header className="w-full mx-auto px-4 bg-sky-200 text-sky-950 shadow fixed top-0 z-50 dark:bg-indigo-900 dark:border-b dark:border-indigo-500 dark:text-blue-100">
            <div className="justify-between md:items-center md:flex">
                <div>
                    <div className = "flex items-center justify-between py-3">
                        <div className="md:py-5 md:block">
                            <h2 className='text-2xl font-bold'>Tyler Yang</h2>
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
                            {NAV_ITEMS.map((item, idx) => {
                                return (
                                    <Link
                                      key={idx}
                                      to={item.page}
                                      className={
                                        "block lg:inline-block text-neutral-900  hover:text-neutral-500 dark:text-neutral-100 cursor-pointer"
                                      }
                                      activeClass="active"
                                      spy={true}
                                      smooth={true}
                                      offset={-100}
                                      duration={500}
                                      onClick={() => setNavbar(!navbar)}
                                    >
                                      {item.label}
                                    </Link>
                                  )
                            })}
                            <Linker href = "/aboutpage" className="block lg:inline-block text-neutral-900  hover:text-neutral-500 dark:text-neutral-100 cursor-pointer">
                                    AboutThisPage
                            </Linker>
                            <Linker href = "/CS180" className="block lg:inline-block text-neutral-900  hover:text-neutral-500 dark:text-neutral-100 cursor-pointer">
                                    CS180
                            </Linker>
                            {/* {currentTheme === "dark" ? (
                                <button onClick={() => setTheme("light")} className="bg-slate-100 p-2 rounded-xl">
                                    <RiSunLine size={25} color="black"/>
                                </button>
                            ) : (
                                <button onClick={() => setTheme("dark")} className="bg-slate-100 p-2 rounded-xl">
                                    <RiMoonFill size={25}/>
                                </button>
                            )

                            } */}
                        </div>
                    </div>
                </div>
                
                
            </div>
        </header>
    )
}

export default Navbar;