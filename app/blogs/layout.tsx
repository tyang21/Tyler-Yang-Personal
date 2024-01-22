import Themechanger from "../../components/Themechanger";
import { Metadata } from "next";
import NavbarBlog from "../../components/navbar-blog";
import Footer from "../../components/Footer";
import { ThemeProvider } from "next-themes"
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Tyler Yang",
  description: "Manually Created",
}

export default function About ({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div  className = "bg-gradient-to-r from-cyan-300 to-blue-300 text-sky-950  dark:from-blue-950 dark:to-indigo-950 dark:text-blue-200">
        <NavbarBlog/>
        {children}
    </div>
  )
}