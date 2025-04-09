"use client"

import { useState } from "react"
import { Star } from "lucide-react"

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  size?: "sm" | "md" | "lg"
  readOnly?: boolean
}

export function StarRating({ value, onChange = () => {}, size = "md", readOnly = false }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0)

  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  const handleMouseEnter = (index: number) => {
    if (!readOnly) {
      setHoverValue(index)
    }
  }

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverValue(0)
    }
  }

  const handleClick = (index: number) => {
    if (!readOnly && typeof onChange === "function") {
      onChange(index)
    }
  }

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          className={`focus:outline-none transition-colors ${readOnly ? "cursor-default" : "cursor-pointer"}`}
          disabled={readOnly}
        >
          <Star
            className={`${sizes[size]} ${
              star <= (hoverValue || value) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  )
}
