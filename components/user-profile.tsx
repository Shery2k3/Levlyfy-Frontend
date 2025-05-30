"use client"
import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Sun, Moon, Settings } from "lucide-react"

export default function UserProfile() {
  const [view, setView] = useState<"daily" | "overall">("daily")
  const [isDarkMode, setIsDarkMode] = useState(true)

  return (
    <div className="bg-black/30 rounded-lg p-6 max-w-md w-full mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Image
              src="/placeholder.svg?height=80&width=80"
              alt="Profile"
              width={80}
              height={80}
              className="rounded-full border-2 border-gray-700"
            />
            <div className="absolute -top-1 -right-1">
              <Settings className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="text-sm text-gray-400">Player Level</div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">78</span>
                <Progress value={75} className="w-32 h-2 bg-green-900/30" indicatorClassName="bg-green-500" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-400">Leaderboard Ranking</div>
              <div className="flex items-center gap-2">
                <span className="text-sm">1904/5076</span>
                <Progress value={40} className="w-32 h-2 bg-blue-900/30" indicatorClassName="bg-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle & Dark Mode */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex">
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              view === "daily" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setView("daily")}
          >
            DAILY TASKS
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              view === "overall" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setView("overall")}
          >
            OVERALL
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Moon className="w-4 h-4 text-gray-400" />
          <Switch checked={!isDarkMode} onCheckedChange={() => setIsDarkMode(!isDarkMode)} />
          <Sun className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatHexagon
          title="Progress"
          value="80%"
          color="gold"
          icon={
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <path d="M20 12l-6-6v5H6v2h8v5l6-6z" fill="currentColor" />
            </svg>
          }
        />
        <StatHexagon
          title="Calls Made"
          value="180"
          color="orange"
          icon={
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <path
                d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1zM21 6h-3V3h-2v3h-3v2h3v3h2V8h3z"
                fill="currentColor"
              />
            </svg>
          }
        />
        <StatHexagon
          title="Deals Closed"
          value="78%"
          color="blue"
          icon={
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <path d="M21 7L9 19l-5.5-5.5 1.41-1.41L9 16.17 19.59 5.59 21 7z" fill="currentColor" />
            </svg>
          }
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-gray-400 text-sm mb-1">AI Feedback</div>
          <div className="text-xl font-bold">12</div>
          <div className="text-xs text-gray-500">improvements applied</div>
        </div>
        <div>
          <div className="text-gray-400 text-sm mb-1">Performance Score</div>
          <div className="text-xl font-bold">12,450</div>
          <div className="text-xs text-gray-500">points earned</div>
        </div>
        <div>
          <div className="text-gray-400 text-sm mb-1">Challenges</div>
          <div className="text-xl font-bold">2</div>
          <div className="text-xs text-gray-500">challenges completed</div>
        </div>
      </div>
    </div>
  )
}

interface StatHexagonProps {
  title: string
  value: string
  color: "gold" | "orange" | "blue"
  icon: React.ReactNode
}

export function StatHexagon({ title, value, color, icon }: StatHexagonProps) {
  const colorClasses = {
    gold: "bg-yellow-500/20 text-yellow-500",
    orange: "bg-orange-500/20 text-orange-500",
    blue: "bg-blue-500/20 text-blue-500",
  }

  return (
    <div className="text-center">
      <div className="relative w-16 h-16 mx-auto mb-2">
        {/* Hexagon Shape */}
        <div className={`absolute inset-0 ${colorClasses[color]} transform rotate-90`}>
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path d="M12 2l10 6v8l-10 6-10-6V8l10-6z" fill="currentColor" opacity="0.2" />
          </svg>
        </div>
        {/* Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${colorClasses[color]}`}>{icon}</div>
        </div>
      </div>
      <div className="text-gray-400 text-sm mb-1">{title}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  )
}

