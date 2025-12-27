"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Trophy } from "lucide-react"

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-white">Leaderboard</h2>
        </div>
        <Link href="/leaderboard">
          <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white text-sm px-4">
            View Full
          </Button>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-white/50 border-b border-white/10 text-sm">
              <th className="pb-3 font-medium">Place</th>
              <th className="pb-3 font-medium">Agent</th>
              <th className="pb-3 font-medium">Calls</th>
              <th className="pb-3 font-medium">Deals</th>
              <th className="pb-3 font-medium">Score</th>
              <th className="pb-3 font-medium">Rank</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.slice(0, 3).map((entry, index) => (
                <LeaderboardRow
                  key={entry.userId}
                  place={entry.place}
                  name={entry.name}
                  calls={`${entry.callsMade}`}
                  deals={`${entry.dealsClosed}`}
                  score={entry.totalScore.toLocaleString()}
                  rank={entry.rank}
                  isHovered={isHovered === index}
                  onHover={() => setIsHovered(index)}
                  onLeave={() => setIsHovered(null)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-white/40">
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
    <tr 
      className="border-b border-white/5 hover:bg-white/5 transition-colors" 
      onMouseEnter={onHover} 
      onMouseLeave={onLeave}
    >
      <td className="py-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold ${
              place === 1 
                ? "bg-gradient-to-br from-yellow-400 to-amber-600 text-white" 
                : place === 2 
                ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white" 
                : "bg-gradient-to-br from-amber-600 to-amber-800 text-white"
            }`}
          >
            {place}
          </div>
        </div>
      </td>
      <td className="py-3 text-white/90">{name}</td>
      <td className="py-3">
        <div className="flex flex-col gap-1">
          <span className="text-white/90">{calls}</span>
          <div className={`w-20 h-1 bg-gradient-to-r from-primary to-blue-400 rounded-full ${isHovered ? "animate-pulse" : ""}`}></div>
        </div>
      </td>
      <td className="py-3">
        <div className="flex flex-col gap-1">
          <span className="text-white/90">{deals}</span>
          <div className={`w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full ${isHovered ? "animate-pulse" : ""}`}></div>
        </div>
      </td>
      <td className="py-3 text-white/90 font-medium">{score}</td>
      <td className="py-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
            rank === "challenger" 
              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" 
              : rank === "gold" 
              ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30" 
              : rank === "silver" 
              ? "bg-gray-400/20 text-gray-300 border border-gray-400/30" 
              : "bg-amber-600/20 text-amber-300 border border-amber-500/30"
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${
            rank === "challenger" 
              ? "bg-purple-400" 
              : rank === "gold" 
              ? "bg-yellow-400" 
              : rank === "silver" 
              ? "bg-gray-400" 
              : "bg-amber-500"
          }`}></div>
          {rank.charAt(0).toUpperCase() + rank.slice(1)}
        </span>
      </td>
    </tr>
  )
}

