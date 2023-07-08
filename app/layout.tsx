
import './globals.css'
import { Metadata } from "next";
import Providers from "../components/Themeprovider";
import Themechanger from "../components/Themechanger";
import Navbar from '../components/navbar';
import Footer from "../components/Footer";
import { ThemeProvider } from "next-themes"
import { Inter } from 'next/font/google'
import { Crimson_Pro } from 'next/font/google'
import { Montserrat } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const crimson = Crimson_Pro({ subsets: ['latin'] })
const montserrat = Montserrat({ subsets: ['latin'] })
export const metadata: Metadata = {
  title: "Tyler Yang",
  description: "Manually Created",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <div  className = "bg-gradient-to-r from-cyan-300 to-blue-300 text-sky-950  dark:from-blue-950 dark:to-indigo-950 dark:text-blue-200">
          <Providers>
            <div className="overflow-x-hidden">
              <Themechanger />
            </div>
          </Providers>
          {children}
          <Footer />
        </div>
        
      </body>
    </html>
  )
}
