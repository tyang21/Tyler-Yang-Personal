"use client"

import React, { useState } from "react"
import { IoMdClose, IoMdMenu } from "react-icons/io"
import Link from "next/link"

const NavbarAboutPage = () => {
  const [navbar, setNavbar] = useState(false)

  return (
    <header className="fixed top-0 z-50 w-full px-4 sm:px-6">
      <div className="section-shell mt-4">
        <div className="frost-card flex items-center justify-between rounded-2xl px-4 py-3 shadow-md">
          <Link href="/" className="text-lg font-semibold tracking-tight md:text-xl">
            Tyler Yang
          </Link>

          <button
            aria-label="Toggle menu"
            className="md:hidden"
            onClick={() => setNavbar(!navbar)}
          >
            {navbar ? <IoMdClose size={28} /> : <IoMdMenu size={28} />}
          </button>

          <div
            className={`absolute left-4 right-4 top-[72px] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg backdrop-blur md:static md:top-auto md:block md:w-auto md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none ${
              navbar ? "block" : "hidden"
            }`}
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
              <Link
                href="/"
                onClick={() => setNavbar(false)}
                className="rounded-lg px-2 py-1 text-sm font-medium text-[var(--text-main)]/85 transition hover:bg-black/5 hover:text-[var(--text-main)] dark:hover:bg-white/10"
              >
                Home
              </Link>
              <span className="rounded-lg px-2 py-1 text-sm font-semibold text-[var(--text-main)]">
                About This Site
              </span>
              <Link
                href="/CS180"
                onClick={() => setNavbar(false)}
                className="rounded-lg px-2 py-1 text-sm font-medium text-[var(--text-main)]/85 transition hover:bg-black/5 hover:text-[var(--text-main)] dark:hover:bg-white/10"
              >
                CS180
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default NavbarAboutPage
