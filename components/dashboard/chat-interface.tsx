"use client"

import { BookOpen, User } from "lucide-react"

export function ChatInterface() {
  // Mock chat data
  const chatMessages = [
    {
      id: 1,
      sender: "ai",
      message: "Hello! I'm your AI study assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      sender: "user",
      message: "I'm having trouble understanding graph algorithms in my Data Structures class.",
      timestamp: new Date().toISOString(),
    },
    {
      id: 3,
      sender: "ai",
      message:
        "I'd be happy to help with graph algorithms! Let's start with the basics. Graphs are mathematical structures used to model pairwise relations between objects. They consist of vertices (or nodes) and edges that connect these vertices.\n\nWhat specific aspect of graph algorithms are you struggling with? Is it breadth-first search (BFS), depth-first search (DFS), shortest path algorithms like Dijkstra's, or something else?",
      timestamp: new Date().toISOString(),
    },
    {
      id: 4,
      sender: "user",
      message: "I'm mostly confused about Dijkstra's algorithm. How does it work?",
      timestamp: new Date().toISOString(),
    },
    {
      id: 5,
      sender: "ai",
      message:
        "Great question! Dijkstra's algorithm is used to find the shortest path from a starting node to all other nodes in a weighted graph with non-negative weights.\n\nHere's a step-by-step explanation of how Dijkstra's algorithm works:\n\n1. Initialize distances: Set the distance to the starting node as 0 and all other nodes as infinity.\n\n2. Create two sets: One for visited nodes and another for unvisited nodes.\n\n3. While there are unvisited nodes:\n   a. Select the unvisited node with the smallest distance.\n   b. Mark it as visited.\n   c. Update the distances to all its adjacent nodes: If the new calculated distance (current node's distance + edge weight) is less than the known distance, update the distance.\n\n4. Once all nodes are visited or the destination is reached, you have the shortest path.\n\nWould you like me to provide a specific example or code implementation to make this clearer?",
      timestamp: new Date().toISOString(),
    },
  ]

  return (
    <div className="space-y-4">
      {chatMessages.map((message) => (
        <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
          <div
            className={`flex max-w-[80%] items-start gap-2 rounded-lg p-3 ${
              message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            {message.sender === "ai" && (
              <div className="rounded-full bg-primary/10 p-1">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
            )}
            <div className="flex-1">
              <div className="whitespace-pre-line text-sm">{message.message}</div>
              <div className="mt-1 text-right text-xs opacity-70">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
            {message.sender === "user" && (
              <div className="rounded-full bg-primary-foreground/10 p-1">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
