"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem("user")
    setIsLoggedIn(!!user)
  }, [])

  return (
    <header className="w-full py-4 px-6 border-b dark:bg-[#131924] bg-[#f9f9f7]">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href={isLoggedIn ? "/dashboard" : "/"}>
            <div className="relative w-40 h-10">
              <Image
                src="/images/logo-light.png"
                alt="NexaLink Logo Light"
                fill
                className="object-contain block dark:hidden"
                priority
              />
              <Image
                src="/images/logo-dark.png"
                alt="NexaLink Logo Dark"
                fill
                className="object-contain hidden dark:block"
                priority
              />
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {!isLoggedIn && (
            <>
              <Link href="/contact" className={`hover:underline ${pathname === "/contact" ? "font-medium" : ""}`}>
                Contact Us
              </Link>
              <Link href="/about" className={`hover:underline ${pathname === "/about" ? "font-medium" : ""}`}>
                Learn More
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
