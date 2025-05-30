"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function TeamHighlights() {
  const [currentPage, setCurrentPage] = useState(0)

  const highlights = [
    {
      name: "Alex Johnson",
      message: "Alex Johnson closed 5 deals today, boosting the team's weekly target by 10%!",
      rank: "challenger" as const,
    },
    {
      name: "Mia Chen",
      message: "Mia Chen made 25 calls this morning, showcasing exceptional dedication!",
      rank: "gold" as const,
    },
    {
      name: "James Carter",
      message: "James Carter achieved a 90% positive sentiment score across his calls this week!",
      rank: "gold" as const,
    },
    {
      name: "Sarah Williams",
      message: "Sarah Williams successfully upsold 3 premium packages to existing clients today!",
      rank: "challenger" as const,
    },
  ]

  const itemsPerPage = 3
  const totalPages = Math.ceil(highlights.length / itemsPerPage)
  const displayedHighlights = highlights.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  return (
    <div className="stats-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Team Highlights</h2>
        {totalPages > 1 && (
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={prevPage} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextPage} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <div className="space-y-4">
        {displayedHighlights.map((highlight, index) => (
          <HighlightItem key={index} name={highlight.name} message={highlight.message} rank={highlight.rank} />
        ))}
      </div>
    </div>
  )
}

function HighlightItem({ name, message, rank }: { name: string; message: string; rank: "challenger" | "gold" }) {
  return (
    <div className="flex items-start gap-4 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
      <div className="flex-shrink-0">
        <Avatar>
          <AvatarImage src="/placeholder.svg?height=48&width=48" alt={name} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-bold">{name}</h3>
          <RankBadge rank={rank} />
        </div>
        <p className="text-sm text-gray-300">"{message}"</p>
      </div>
    </div>
  )
}

function RankBadge({ rank }: { rank: "challenger" | "gold" }) {
  if (rank === "challenger") {
    return (
      <div className="w-6 h-6 bg-challenger rounded-full flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white">
          <path
            d="M12 15C8.7 15 6 12.3 6 9V4.5C6 4.2 6.2 4 6.5 4C10.4 4 11 2 15 2C15.3 2 15.5 2.2 15.5 2.5V9C15.5 12.3 12.8 15 9.5 15H12ZM9.5 2C9.8 2 10 2.2 10 2.5V9C10 12.3 7.3 15 4 15H1.5C1.2 15 1 14.8 1 14.5V9C1 5.7 3.7 3 7 3C8.3 3 9.1 2.3 9.5 2ZM22.5 15H20C16.7 15 14 12.3 14 9V2.5C14 2.2 14.2 2 14.5 2C14.9 2.3 15.7 3 17 3C20.3 3 23 5.7 23 9V14.5C23 14.8 22.8 15 22.5 15Z"
            fill="currentColor"
          />
        </svg>
      </div>
    )
  }

  return (
    <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center">
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white">
        <path
          d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

