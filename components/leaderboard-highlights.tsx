"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface LeaderboardEntry {
  place: number;
  userId: string;
  name: string;
  callsMade: number;
  dealsClosed: number;
  upsells: number;
  totalScore: number;
  rank: "challenger" | "gold" | "silver" | "bronze";
}

interface LeaderboardHighlightsProps {
  data?: LeaderboardEntry[];
}

export default function LeaderboardHighlights({ data = [] }: LeaderboardHighlightsProps) {
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
            {data.length > 0 ? (
              data.slice(0, 3).map((entry, index) => (
                <LeaderboardRow
                  key={entry.userId}
                  place={entry.place}
                  name={entry.name}
                  calls={`${entry.callsMade} (${entry.callsMade * 10})`}
                  deals={`${entry.dealsClosed} (${entry.dealsClosed * 50})`}
                  score={entry.totalScore.toLocaleString()}
                  rank={entry.rank}
                  isHovered={isHovered === index}
                  onHover={() => setIsHovered(index)}
                  onLeave={() => setIsHovered(null)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-400">
                  No leaderboard data available
                </td>
              </tr>
            )}
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
  rank: "challenger" | "gold" | "silver" | "bronze"
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
            rank === "challenger" ? "badge-challenger" : 
            rank === "gold" ? "badge-gold" :
            rank === "silver" ? "badge-silver" : "badge-bronze"
          }`}
        >
          {rank.charAt(0).toUpperCase() + rank.slice(1)}
          <div className={`ml-1 w-3 h-3 rounded-full ${
            rank === "challenger" ? "dot-challenger" : 
            rank === "gold" ? "dot-gold" :
            rank === "silver" ? "dot-silver" : "dot-bronze"
          }`}></div>
        </div>
      </td>
    </tr>
  )
}

