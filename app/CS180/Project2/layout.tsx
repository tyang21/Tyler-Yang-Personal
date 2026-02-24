import '../../globals.css'
import { Metadata } from "next";
import Providers from "../../../components/Themeprovider";
import Themechanger from "../../../components/Themechanger";
import Navbar from '@/components/navbar';
import Footer from "../../../components/Footer";
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
    <div  className = "text-[var(--text-main)]">
        <Navbar/>
        {children}
    </div>
  )
}