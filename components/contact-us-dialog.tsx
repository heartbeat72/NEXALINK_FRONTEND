"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function ContactUsDialog() {
  return (
    <Link href="/contact" passHref>
      <Button variant="outline">Contact Us</Button>
    </Link>
  )
}
