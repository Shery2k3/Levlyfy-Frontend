"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LeaderboardHighlights() {
  const [isHovered, setIsHovered] = useState<number | null>(null)

  return (
    <div className="stats-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Leaderboard Highlights</h2>
        <Link href="/leaderboard">
          <Button className="bg-blue-600 hover:bg-blue-700">View My Place</Button>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-800">
              <th className="pb-2">Place</th>
              <th className="pb-2">Agent ID</th>
              <th className="pb-2">Calls Made</th>
              <th className="pb-2">Deals Closed</th>
              <th className="pb-2">Total Score</th>
              <th className="pb-2">Rank</th>
            </tr>
          </thead>
          <tbody>
            <LeaderboardRow
              place={1}
              name="Alex Johnson"
              calls="65 (650)"
              deals="15 (750)"
              score="4,200"
              rank="challenger"
              isHovered={isHovered === 1}
              onHover={() => setIsHovered(1)}
              onLeave={() => setIsHovered(null)}
            />
            <LeaderboardRow
              place={2}
              name="Mia Chen"
              calls="65 (650)"
              deals="15 (750)"
              score="4,200"
              rank="challenger"
              isHovered={isHovered === 2}
              onHover={() => setIsHovered(2)}
              onLeave={() => setIsHovered(null)}
            />
            <LeaderboardRow
              place={3}
              name="Liam Smith"
              calls="65 (650)"
              deals="15 (750)"
              score="4,200"
              rank="gold"
              isHovered={isHovered === 3}
              onHover={() => setIsHovered(3)}
              onLeave={() => setIsHovered(null)}
            />
          </tbody>
        </table>
      </div>
    </div>
  )
}

function LeaderboardRow({
  place,
  name,
  calls,
  deals,
  score,
  rank,
  isHovered,
  onHover,
  onLeave,
}: {
  place: number
  name: string
  calls: string
  deals: string
  score: string
  rank: "challenger" | "gold"
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
}) {
  return (
    <tr className="leaderboard-row" onMouseEnter={onHover} onMouseLeave={onLeave}>
      <td className="py-2 flex items-center gap-2">
        <div
          className={`w-6 h-6 ${place === 1 ? "bg-yellow-600" : place === 2 ? "bg-gray-400" : "bg-amber-700"} rounded-full flex items-center justify-center text-sm font-bold`}
        >
          {place}
        </div>
      </td>
      <td className="py-2">{name}</td>
      <td className="py-2">
        <div className="flex flex-col">
          <span>{calls}</span>
          <div className={`w-20 h-1 bg-orange-700 rounded-full ${isHovered ? "animate-pulse" : ""}`}></div>
        </div>
      </td>
      <td className="py-2">
        <div className="flex flex-col">
          <span>{deals}</span>
          <div className={`w-16 h-1 bg-green-700 rounded-full ${isHovered ? "animate-pulse" : ""}`}></div>
        </div>
      </td>
      <td className="py-2">{score}</td>
      <td className="py-2">
        <div
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
            rank === "challenger" ? "badge-challenger" : "badge-gold"
          }`}
        >
          {rank === "challenger" ? "Challenger" : "Gold"}
          <div className={`ml-1 w-3 h-3 rounded-full ${rank === "challenger" ? "dot-challenger" : "dot-gold"}`}></div>
        </div>
      </td>
    </tr>
  )
}

