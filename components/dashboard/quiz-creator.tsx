"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"

export function QuizCreator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [questionCount, setQuestionCount] = useState(10)

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="course">Course</Label>
        <Select>
          <SelectTrigger id="course">
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cs101">Introduction to Computer Science</SelectItem>
            <SelectItem value="ds201">Data Structures & Algorithms</SelectItem>
            <SelectItem value="ai301">Artificial Intelligence</SelectItem>
            <SelectItem value="db201">Database Systems</SelectItem>
            <SelectItem value="web101">Web Development</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="topic">Topic</Label>
        <Input id="topic" placeholder="Enter a specific topic (optional)" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="materials">Study Materials</Label>
        <Textarea
          id="materials"
          placeholder="Paste relevant study materials or notes (optional)"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Number of Questions</Label>
          <span className="text-sm font-medium">{questionCount}</span>
        </div>
        <Slider
          value={[questionCount]}
          onValueChange={(value) => setQuestionCount(value[0])}
          min={5}
          max={20}
          step={1}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="difficulty">Difficulty Level</Label>
        <Select defaultValue="medium">
          <SelectTrigger id="difficulty">
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="format">Quiz Format</Label>
        <Select defaultValue="mcq">
          <SelectTrigger id="format">
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mcq">Multiple Choice</SelectItem>
            <SelectItem value="tf">True/False</SelectItem>
            <SelectItem value="mixed">Mixed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Quiz...
          </>
        ) : (
          "Generate AI Quiz"
        )}
      </Button>
    </div>
  )
}
