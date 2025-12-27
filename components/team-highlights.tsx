"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Users } from "lucide-react"

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-white">Team Highlights</h2>
        </div>
        {totalPages > 1 && (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prevPage} 
              className="h-8 w-8 bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/30"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextPage} 
              className="h-8 w-8 bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/30"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <div className="space-y-3">
        {displayedHighlights.map((highlight, index) => (
          <HighlightItem key={index} name={highlight.name} message={highlight.message} rank={highlight.rank} />
        ))}
      </div>
    </div>
  )
}

function HighlightItem({ name, message, rank }: { name: string; message: string; rank: "challenger" | "gold" }) {
  return (
    <div className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all">
      <div className="flex-shrink-0">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${
          rank === "challenger" ? "bg-gradient-to-br from-orange-500 to-red-500" : "bg-gradient-to-br from-yellow-500 to-amber-600"
        }`}>
          {name[0]}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-semibold text-white">{name}</h3>
          <RankBadge rank={rank} />
        </div>
        <p className="text-sm text-white/60 line-clamp-2">{message}</p>
      </div>
    </div>
  )
}

function RankBadge({ rank }: { rank: "challenger" | "gold" }) {
  if (rank === "challenger") {
    return (
      <div className="px-2 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-medium">
        Challenger
      </div>
    )
  }

  return (
    <div className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium">
      Gold
    </div>
  )
}

