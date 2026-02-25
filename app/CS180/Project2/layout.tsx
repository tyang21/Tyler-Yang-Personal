import '../../globals.css'
import { Metadata } from "next";
import Navbar from '@/components/navbar';

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
    <div className="text-[var(--text-main)]">
      <Navbar/>
      {children}
    </div>
  )
}
