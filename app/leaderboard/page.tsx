"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquareText, Clock } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

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

interface UserStats {
  callsMade: number;
  dealsClosed: number;
  upsells: number;
  totalScore: number;
  rank: "challenger" | "gold" | "silver" | "bronze";
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("calls-made");
  const [timePeriod, setTimePeriod] = useState("weekly");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Get current user from auth context

  useEffect(() => {
    fetchLeaderboardData();
    fetchUserStats();
  }, [timePeriod]);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/performance/leaderboard?period=${timePeriod}`);
      setLeaderboardData(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await api.get(`/performance/leaderboard/me?period=${timePeriod}`);
      setUserStats(response.data.data || null);
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
      setUserStats(null);
    }
  };

  // Filter data based on active tab
  const getFilteredData = () => {
    if (activeTab === "deals-closed") {
      return [...leaderboardData].sort((a, b) => b.dealsClosed - a.dealsClosed);
    } else if (activeTab === "upsells") {
      return [...leaderboardData].sort((a, b) => b.upsells - a.upsells);
    }
    // Default: calls-made (sorted by callsMade)
    return [...leaderboardData].sort((a, b) => b.callsMade - a.callsMade);
  };

  const topPerformers = getFilteredData().slice(0, 3);
  const tableData = getFilteredData();

  return (
    <div className="px-4 md:px-8 py-6 space-y-8">
      {/* Banner */}
      <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl">
        <div className="relative h-36 md:h-44">
          <div className="absolute inset-0 banner-gradient z-10 flex flex-col justify-center p-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">LEADERBOARD</h1>
            <p className="text-gray-200 text-lg">
              "Rise to the Top! Compete, Improve, and Achieve."
            </p>
          </div>
          <Image
            src="/placeholder.svg?height=160&width=800"
            alt="Leaderboard Banner"
            width={800}
            height={160}
            className="absolute inset-0 object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-6 w-full">
        <Tabs
          defaultValue="calls-made"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full sm:w-fit"
        >
          <TabsList className="bg-gray-800 border border-gray-700 w-full sm:w-auto grid grid-cols-3 sm:flex rounded-xl">
            <TabsTrigger value="calls-made" className="rounded-lg">Calls Made</TabsTrigger>
            <TabsTrigger value="deals-closed" className="rounded-lg">Deals Closed</TabsTrigger>
            <TabsTrigger value="upsells" className="rounded-lg">Upsells</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-end items-end">
          <Tabs
            defaultValue="weekly"
            value={timePeriod}
            onValueChange={setTimePeriod}
            className="w-full sm:w-fit"
          >
            <TabsList className="bg-gray-800 border border-gray-700 w-full sm:w-auto grid grid-cols-3 sm:flex rounded-xl">
              <TabsTrigger value="weekly" className="rounded-lg">Weekly</TabsTrigger>
              <TabsTrigger value="monthly" className="rounded-lg">Monthly</TabsTrigger>
              <TabsTrigger value="all-time" className="rounded-lg">All-Time</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Top Performers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-gray-800 rounded-xl p-6 shadow-lg animate-pulse">
              <div className="h-16 bg-gray-700 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded mb-4"></div>
              <div className="grid grid-cols-3 gap-2">
                <div className="h-1 bg-gray-700 rounded-full"></div>
                <div className="h-1 bg-gray-700 rounded-full"></div>
                <div className="h-1 bg-gray-700 rounded-full"></div>
              </div>
            </div>
          ))
        ) : (
          topPerformers.map((performer, index) => (
            <PerformerCard
              key={performer.userId}
              name={performer.name}
              badge={performer.rank}
              trophy={index === 0 ? "gold" : "silver"}
              calls={performer.callsMade.toString()}
              deals={performer.dealsClosed.toString()}
              feedback={performer.upsells.toString()}
            />
          ))
        )}
      </div>

      {/* Action Buttons - Responsive */}
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
        <Button className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-200 text-base sm:text-lg">
          <Phone className="mr-2 h-5 w-5" />
          Call Next Customer
        </Button>
        <Button className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/25 transition-all duration-200 text-base sm:text-lg">
          <MessageSquareText className="mr-2 h-5 w-5" />
          Review AI Feedback
        </Button>
        <Button className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold bg-gray-700 hover:bg-gray-600 text-white shadow-lg hover:shadow-gray-500/25 transition-all duration-200 text-base sm:text-lg">
          <Clock className="mr-2 h-5 w-5" />
          History
        </Button>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-700">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700 text-gray-300 border-b border-gray-600">
              <th className="py-4 px-6 text-left font-semibold">Place</th>
              <th className="py-4 px-6 text-left font-semibold">Agent Name</th>
              <th className="py-4 px-6 text-left font-semibold">
                {activeTab === "calls-made" ? "Calls Made" : 
                 activeTab === "deals-closed" ? "Deals Closed" : "Upsells"}
              </th>
              <th className="py-4 px-6 text-left font-semibold">
                {activeTab === "calls-made" ? "Deals Closed" : 
                 activeTab === "deals-closed" ? "Calls Made" : "Deals Closed"}
              </th>
              <th className="py-4 px-6 text-left font-semibold">Total Score</th>
              <th className="py-4 px-6 text-left font-semibold">Rank</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <tr key={index} className="animate-pulse border-b border-gray-700/50">
                  <td className="py-5 px-6"><div className="h-8 w-8 bg-gray-700 rounded-full"></div></td>
                  <td className="py-5 px-6"><div className="h-4 bg-gray-700 rounded-lg w-24"></div></td>
                  <td className="py-5 px-6"><div className="h-4 bg-gray-700 rounded-lg w-16"></div></td>
                  <td className="py-5 px-6"><div className="h-4 bg-gray-700 rounded-lg w-16"></div></td>
                  <td className="py-5 px-6"><div className="h-4 bg-gray-700 rounded-lg w-16"></div></td>
                  <td className="py-5 px-6"><div className="h-4 bg-gray-700 rounded-lg w-20"></div></td>
                </tr>
              ))
            ) : tableData.length > 0 ? (
              tableData.map((entry, index) => (
                <LeaderboardRow
                  key={entry.userId}
                  place={index + 1}
                  name={entry.name}
                  calls={activeTab === "calls-made" ? entry.callsMade.toString() : 
                         activeTab === "deals-closed" ? entry.dealsClosed.toString() : 
                         entry.upsells.toString()}
                  deals={activeTab === "calls-made" ? entry.dealsClosed.toString() : 
                         activeTab === "deals-closed" ? entry.callsMade.toString() : 
                         entry.dealsClosed.toString()}
                  score={entry.totalScore.toString()}
                  rank={entry.rank}
                  isCurrentUser={user?._id === entry.userId}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-12 px-6 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-gray-700 rounded-full">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-lg mb-1">No leaderboard data available</p>
                      <p className="text-sm text-gray-500">Start making calls to see rankings</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PerformerCard({
  name,
  badge,
  trophy,
  calls,
  deals,
  feedback,
}: {
  name: string;
  badge: "challenger" | "gold" | "silver" | "bronze";
  trophy: "gold" | "silver";
  calls: string;
  deals: string;
  feedback: string;
}) {
  // Helper function to get badge styling
  const getBadgeStyle = (rank: string) => {
    switch(rank) {
      case "challenger": return "badge-challenger";
      case "gold": return "badge-gold";
      case "silver": return "badge-silver";
      case "bronze": return "badge-bronze";
      default: return "badge-bronze";
    }
  };

  const getDotStyle = (rank: string) => {
    switch(rank) {
      case "challenger": return "dot-challenger";
      case "gold": return "dot-gold";
      case "silver": return "dot-silver";
      case "bronze": return "dot-bronze";
      default: return "dot-bronze";
    }
  };

  const getRankLabel = (rank: string) => {
    switch(rank) {
      case "challenger": return "Challenger";
      case "gold": return "Gold";
      case "silver": return "Silver";
      case "bronze": return "Bronze";
      default: return "Bronze";
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-xl hover:shadow-blue-900/20 transition-all duration-300 hover:-translate-y-1 border border-gray-700">
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <Avatar className="h-14 w-14 border-2 border-gray-600">
          <AvatarImage src="/placeholder.svg?height=56&width=56" alt={name} />
          <AvatarFallback className="text-lg font-bold">{name[0]}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="font-bold text-lg mb-1 truncate">{name}</div>
          <div className="flex items-center gap-2 flex-wrap">
            <div
              className={`flex items-center rounded-full px-3 py-1 text-sm font-medium ${getBadgeStyle(badge)}`}
            >
              <div
                className={`mr-2 w-3 h-3 rounded-full ${getDotStyle(badge)}`}
              ></div>
              <span className="truncate">{getRankLabel(badge)}</span>
            </div>
          </div>
        </div>
        <div className="ml-auto">
          <div
            className={`w-16 h-16 rounded-full ${
              trophy === "gold" ? "bg-yellow-600/20 border-2 border-yellow-600/50" : "bg-gray-400/20 border-2 border-gray-400/50"
            } flex items-center justify-center`}
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-10 h-10 ${
                trophy === "gold" ? "text-yellow-600" : "text-gray-400"
              }`}
            >
              <path
                d="M5,16 L3,5 L8.5,5 L9.5,3 L14.5,3 L15.5,5 L21,5 L19,16 L5,16 Z M5,16 L8,20 L16,20 L19,16 M12,9 L12,13 M10,11 L14,11"
                stroke="currentColor"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 text-center text-sm mb-3 text-gray-400">
        <div className="font-medium">Calls Made</div>
        <div className="font-medium">Deals Closed</div>
        <div className="font-medium">Upsells</div>
      </div>

      <div className="grid grid-cols-3 text-center text-gray-200 mb-6">
        <div className="text-xl font-bold text-blue-400">{calls}</div>
        <div className="text-xl font-bold text-green-400">{deals}</div>
        <div className="text-xl font-bold text-purple-400">{feedback}</div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="h-2 bg-blue-600 rounded-full"></div>
        <div className="h-2 bg-green-600 rounded-full"></div>
        <div className="h-2 bg-purple-600 rounded-full"></div>
      </div>
    </div>
  );
}

function LeaderboardRow({
  place,
  name,
  calls,
  deals,
  score,
  rank,
  isCurrentUser = false,
}: {
  place: number;
  name: string;
  calls: string;
  deals: string;
  score: string;
  rank: "challenger" | "gold" | "silver" | "bronze";
  isCurrentUser?: boolean;
}) {
  // Helper function to get badge styling
  const getBadgeStyle = (rank: string) => {
    switch(rank) {
      case "challenger": return "badge-challenger";
      case "gold": return "badge-gold";
      case "silver": return "badge-silver";
      case "bronze": return "badge-bronze";
      default: return "badge-bronze";
    }
  };

  const getDotStyle = (rank: string) => {
    switch(rank) {
      case "challenger": return "dot-challenger";
      case "gold": return "dot-gold";
      case "silver": return "dot-silver";
      case "bronze": return "dot-bronze";
      default: return "dot-bronze";
    }
  };

  const getRankLabel = (rank: string) => {
    switch(rank) {
      case "challenger": return "Challenger";
      case "gold": return "Gold";
      case "silver": return "Silver";
      case "bronze": return "Bronze";
      default: return "Bronze";
    }
  };

  return (
    <tr
      className={`${
        place % 2 === 0 ? "bg-gray-700/30" : "bg-gray-800/50"
      } ${
        isCurrentUser ? "bg-blue-900/30 border-l-4 border-blue-500" : ""
      } hover:bg-gray-600/50 transition-colors duration-200 border-b border-gray-700/50`}
    >
      <td className="py-5 px-6">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full ${
              place === 1
                ? "bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg shadow-yellow-500/30"
                : place === 2
                ? "bg-gradient-to-br from-gray-400 to-gray-500 shadow-lg shadow-gray-400/30"
                : place === 3
                ? "bg-gradient-to-br from-amber-600 to-amber-700 shadow-lg shadow-amber-600/30"
                : "bg-gradient-to-br from-gray-600 to-gray-700"
            } flex items-center justify-center font-bold text-white`}
          >
            {place}
          </div>
        </div>
      </td>
      <td className="py-5 px-6">
        <div className="font-medium text-gray-200">
          {name}
          {isCurrentUser && <span className="ml-2 text-blue-400 text-sm font-normal">(You)</span>}
        </div>
      </td>
      <td className="py-5 px-6">
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-blue-400 mb-1">{calls}</span>
          <div className="w-24 h-2 bg-blue-600 rounded-full"></div>
        </div>
      </td>
      <td className="py-5 px-6">
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-green-400 mb-1">{deals}</span>
          <div className="w-20 h-2 bg-green-600 rounded-full"></div>
        </div>
      </td>
      <td className="py-5 px-6">
        <span className="text-lg font-semibold text-gray-200">{score}</span>
      </td>
      <td className="py-5 px-6">
        <div
          className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${getBadgeStyle(rank)}`}
        >
          {getRankLabel(rank)}
          <div
            className={`ml-2 w-3 h-3 rounded-full ${getDotStyle(rank)}`}
          ></div>
        </div>
      </td>
    </tr>
  );
}
