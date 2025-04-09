"use client"

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function LearnMoreDialog({ children }: { children?: React.ReactNode }) {
  return (
    <Link href="/about" passHref>
      {children || <Button variant="outline">Learn More</Button>}
    </Link>
  )
}
