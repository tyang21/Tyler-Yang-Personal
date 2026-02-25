import './globals.css'
import { Metadata } from "next";
import Providers from "../components/Themeprovider";
import Themechanger from "../components/Themechanger";
import Footer from "../components/Footer";

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
      <body>
        <div className="text-[var(--text-main)]">
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
