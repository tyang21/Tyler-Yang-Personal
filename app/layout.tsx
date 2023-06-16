// "use client"
import './globals.css'
import { Metadata } from "next";
import Providers from "../components/Themeprovider";
import Themechanger from "../components/Themechanger";
import Navbar from '../components/navbar'
import { ThemeProvider } from "next-themes"
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadat: Metadata = {
  title: "Create Night Mode",
  description: "Manually Created",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="overflow-x-hidden">
            <Themechanger />
          </div>
        </Providers>
        <Navbar/>
        {children}
        
      </body>
    </html>
  )
}
